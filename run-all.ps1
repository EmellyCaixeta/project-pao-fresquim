# Run backend and frontend in separate PowerShell windows
# Usage: from the project root, run: .\run-all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverFolder = Join-Path $root 'server'
$clientFolder = Join-Path $root 'client'

function Test-PortListening {
    param(
        [int]$Port
    )

    return [bool](Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' })
}

function Get-BackendPortFromFile {
    $backendPortFile = Join-Path $serverFolder 'backend-port.txt'

    if (-not (Test-Path $backendPortFile)) {
        return $null
    }

    $backendPortRaw = Get-Content -Path $backendPortFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ([int]::TryParse($backendPortRaw, [ref]$null)) {
        return [int]$backendPortRaw
    }

    return $null
}

function Get-RunningBackendPort {
    $candidatePorts = @()

    $backendPortFromFile = Get-BackendPortFromFile
    if ($backendPortFromFile) {
        $candidatePorts += $backendPortFromFile
    }

    for ($port = 8081; $port -le 8090; $port++) {
        $candidatePorts += $port
    }

    foreach ($port in ($candidatePorts | Select-Object -Unique)) {
        if (Test-PortListening -Port $port) {
            return $port
        }
    }

    return 8081
}

function Wait-ForBackendPortFile {
    param(
        [int]$TimeoutSeconds = 30
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    $backendPortFile = Join-Path $serverFolder 'backend-port.txt'

    while ((Get-Date) -lt $deadline) {
        if (Test-Path $backendPortFile) {
            $backendPortRaw = Get-Content -Path $backendPortFile -ErrorAction SilentlyContinue | Select-Object -First 1
            if ([int]::TryParse($backendPortRaw, [ref]$null)) {
                return [int]$backendPortRaw
            }
        }

        Start-Sleep -Seconds 1
    }

    return $null
}

function Wait-ForPort {
    param(
        [string]$ServiceName,
        [int]$Port,
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        if (Test-PortListening -Port $Port) {
            Write-Host "$ServiceName is ready on port $Port"
            return $true
        }

        Start-Sleep -Seconds 1
    }

    Write-Host "$ServiceName did not become ready on port $Port within $TimeoutSeconds seconds"
    return $false
}

$backendPort = Get-RunningBackendPort

if (-not (Test-PortListening -Port $backendPort)) {
    $backendPortFile = Join-Path $serverFolder 'backend-port.txt'
    if (Test-Path $backendPortFile) {
        Remove-Item -Path $backendPortFile -Force -ErrorAction SilentlyContinue
    }

    Start-Process pwsh -ArgumentList @(
        '-NoExit',
        '-ExecutionPolicy', 'Bypass',
        '-Command', "Set-Location -Path '$serverFolder'; .\run-backend.ps1"
    )

    $backendPort = Wait-ForBackendPortFile
    if (-not $backendPort) {
        Write-Host "Backend did not create a port file. Check the backend terminal for errors."
    }
}

if (-not (Test-PortListening -Port 3000)) {
    Start-Process pwsh -ArgumentList @(
        '-NoExit',
        '-ExecutionPolicy', 'Bypass',
        '-Command', "Set-Location -Path '$clientFolder'; .\run-frontend.ps1"
    )
}

$backendReady = if ($backendPort) { Wait-ForPort -ServiceName 'Backend' -Port $backendPort } else { $false }
$frontendReady = Wait-ForPort -ServiceName 'Frontend' -Port 3000

if ($backendReady -and $frontendReady) {
    Write-Host "Backend and frontend are running. Backend: $backendPort, Frontend: 3000"
} elseif ($backendReady) {
    Write-Host "Backend is running, but the frontend did not become ready. Check the frontend terminal for errors."
} elseif ($frontendReady) {
    Write-Host "Frontend is running, but the backend did not become ready. Check the backend terminal for errors."
} else {
    Write-Host "The backend and frontend were not both ready within the timeout. Check the separate terminals for logs."
}
