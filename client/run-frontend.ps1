# Run frontend (Next.js) with API URL env var
# Usage: from project root run: .\client\run-frontend.ps1

Set-Location -Path $PSScriptRoot

$defaultApiUrl = "http://localhost:8081/"
$backendPortFile = Join-Path $PSScriptRoot "..\server\backend-port.txt"
if (Test-Path $backendPortFile) {
    $backendPort = Get-Content -Path $backendPortFile -ErrorAction SilentlyContinue
    if ($backendPort -match '^[0-9]+$') {
        $env:NEXT_PUBLIC_API_URL = "http://localhost:$backendPort/"
        Write-Host "Using backend URL: $env:NEXT_PUBLIC_API_URL"
    } else {
        $env:NEXT_PUBLIC_API_URL = $defaultApiUrl
        Write-Host "Invalid backend port file contents; using default API URL $defaultApiUrl"
    }
} else {
    $env:NEXT_PUBLIC_API_URL = $defaultApiUrl
    Write-Host "Backend port file not found; using default API URL $defaultApiUrl"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm not found in PATH. Please install Node.js (includes npm)."
    exit 1
}

npm install
npm run dev
