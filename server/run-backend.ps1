# Run backend with Supabase env vars
# Usage: from the project root, run: .\server\run-backend.ps1

Set-Location -Path $PSScriptRoot

$env:DB_URL = "jdbc:postgresql://aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
$env:DB_USER = "postgres.mrueogwqnbkwarumjlfs"
$env:DB_PASSWORD = "j-bvgs-4iSt6L2Y"

if (-not $env:SERVER_PORT) {
    $env:SERVER_PORT = "8081"
}

# Parse the configured port and fallback to 8081 if invalid
$serverPortRaw = $env:SERVER_PORT
[int]$serverPort = 8081
if (-not [int]::TryParse($serverPortRaw, [ref]$serverPort)) {
    $cleaned = ($serverPortRaw -replace '[^0-9]', '')
    if (-not [int]::TryParse($cleaned, [ref]$serverPort)) {
        $serverPort = 8081
    }
}
$env:SERVER_PORT = $serverPort.ToString()

# Check if the configured port is in use; if so, find the next available port
function Test-PortOpen {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connection -ne $null
    } catch {
        return $false
    }
}

while (Test-PortOpen -Port $serverPort) {
    Write-Host "Port $serverPort already in use, trying next port..."
    $serverPort += 1
}
$env:SERVER_PORT = $serverPort.ToString()

# Write the chosen backend port so the frontend can read it
$backendPortFile = Join-Path $PSScriptRoot "backend-port.txt"
Set-Content -Path $backendPortFile -Value $serverPort -Encoding UTF8

# Ensure Java is installed
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "Java not found in PATH. Please install a JDK (e.g., Temurin/OpenJDK 17 or 21) before proceeding."
    Write-Host "Download: https://adoptium.net/ or https://adoptium.net/temurin/releases"
    exit 1
}

# Try to use system mvn; if not available, download the Maven distribution specified by the wrapper
$mvnCmd = $null
$mvnLookup = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvnLookup) {
    $mvnCmd = $mvnLookup.Source
}
if ($mvnCmd) {
    Write-Host "Using system mvn at $mvnCmd"
    & "$mvnCmd" "-DskipTests" "-Dserver.port=$serverPort" "org.springframework.boot:spring-boot-maven-plugin:4.0.5:run"
    exit $LASTEXITCODE
}

Write-Host "System 'mvn' not found — attempting to use .mvn/wrapper distribution..."
$wrapperProps = Join-Path $PSScriptRoot ".mvn\wrapper\maven-wrapper.properties"
if (-not (Test-Path $wrapperProps)) {
    Write-Host "No Maven wrapper properties found at $wrapperProps. Install Maven or create a wrapper."
    exit 1
}

$distUrlLine = Select-String -Path $wrapperProps -Pattern 'distributionUrl' -SimpleMatch
if (-not $distUrlLine) {
    Write-Host "distributionUrl not found in wrapper properties."
    exit 1
}

$distUrl = $distUrlLine -replace '.*=',''
$zipPath = Join-Path $PSScriptRoot ".mvn\wrapper\apache-maven-wrapper.zip"
$extractDir = Join-Path $PSScriptRoot ".mvn\apache-maven"

if (-not (Test-Path $extractDir)) {
    Write-Host "Downloading Maven from $distUrl ..."
    try {
        Invoke-WebRequest -Uri $distUrl -OutFile $zipPath -UseBasicParsing -ErrorAction Stop
        Expand-Archive -LiteralPath $zipPath -DestinationPath $extractDir -Force
        Remove-Item $zipPath -Force
    } catch {
        Write-Host "Failed to download or extract Maven: $_"
        exit 1
    }
}

# Find the mvn.cmd (Windows) or mvn (Unix) inside extracted folder
$mvnBin = Get-ChildItem -Path $extractDir -Recurse -Filter 'mvn.cmd' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $mvnBin) {
    $mvnBin = Get-ChildItem -Path $extractDir -Recurse -Filter 'mvn' -ErrorAction SilentlyContinue | Select-Object -First 1
}

if (-not $mvnBin) {
    Write-Host "Could not locate mvn executable inside extracted Maven distribution."
    exit 1
}

$mvnExe = $mvnBin.FullName
Write-Host "Using Maven at $mvnExe"

# Ensure the bin folder is on PATH for this session
$mavenBinDir = Split-Path $mvnExe -Parent
$env:Path = "$mavenBinDir;$env:Path"

& "$mvnExe" "-DskipTests" "-Dserver.port=$serverPort" "org.springframework.boot:spring-boot-maven-plugin:4.0.5:run"
exit $LASTEXITCODE
