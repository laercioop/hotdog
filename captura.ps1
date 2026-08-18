$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$captureDirectory = Join-Path $projectRoot "capturas"
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
$browserCandidates = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $pythonCommand) {
    throw "Python não foi encontrado. Instale o Python e adicione-o ao PATH."
}

if (-not $browser) {
    throw "Google Chrome ou Microsoft Edge não foi encontrado."
}

New-Item -ItemType Directory -Force -Path $captureDirectory | Out-Null

$portProbe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$portProbe.Start()
$port = ([System.Net.IPEndPoint]$portProbe.LocalEndpoint).Port
$portProbe.Stop()

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$outputPath = Join-Path $captureDirectory "campanha-$timestamp.png"
$profilePath = Join-Path ([System.IO.Path]::GetTempPath()) "asj-capture-$([guid]::NewGuid())"
$server = $null

try {
    New-Item -ItemType Directory -Force -Path $profilePath | Out-Null
    $server = Start-Process -FilePath $pythonCommand.Source `
        -ArgumentList @("-m", "http.server", $port, "--bind", "127.0.0.1") `
        -WorkingDirectory $projectRoot `
        -WindowStyle Hidden `
        -PassThru

    $pageUrl = "http://127.0.0.1:$port/index.html"
    $ready = $false

    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        try {
            $response = Invoke-WebRequest -UseBasicParsing -Uri $pageUrl -TimeoutSec 1
            if ($response.StatusCode -eq 200) {
                $ready = $true
                break
            }
        } catch {
            Start-Sleep -Milliseconds 200
        }
    }

    if (-not $ready) {
        throw "O servidor local não ficou disponível a tempo."
    }

    $browserArguments = @(
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1366,608",
        "--user-data-dir=$profilePath",
        "--screenshot=$outputPath",
        $pageUrl
    )

    & $browser @browserArguments | Out-Null

    for ($attempt = 0; $attempt -lt 40 -and -not (Test-Path -LiteralPath $outputPath); $attempt++) {
        Start-Sleep -Milliseconds 250
    }

    if (-not (Test-Path -LiteralPath $outputPath)) {
        throw "O navegador não gerou o arquivo PNG."
    }

    Write-Host "Captura criada com sucesso:" -ForegroundColor Green
    Write-Host $outputPath
} finally {
    if ($server -and -not $server.HasExited) {
        Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
    }

    if (Test-Path -LiteralPath $profilePath) {
        Remove-Item -LiteralPath $profilePath -Recurse -Force -ErrorAction SilentlyContinue
    }
}
