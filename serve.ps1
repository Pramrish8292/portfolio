param (
    [int]$Port = 8080
)

$baseDir = $PSScriptRoot

# Try binding to an open port (8080, 8081, 8082, ...)
$listener = $null
$maxAttempts = 10
$currentPort = $Port

for ($i = 0; $i -lt $maxAttempts; $i++) {
    try {
        $tempListener = New-Object System.Net.HttpListener
        $prefix = "http://localhost:$currentPort/"
        $tempListener.Prefixes.Add($prefix)
        $tempListener.Start()
        $listener = $tempListener
        break
    }
    catch {
        if ($tempListener) {
            $tempListener.Close()
        }
        $currentPort++
    }
}

if (-not $listener -or -not $listener.IsListening) {
    Write-Host "Error: Could not bind to an open port between $Port and $($Port + $maxAttempts)." -ForegroundColor Red
    exit 1
}

$url = "http://localhost:$currentPort/"
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 Portfolio Web Server is Live!" -ForegroundColor Green
Write-Host " Local URL: $url" -ForegroundColor Yellow
Write-Host " Root Directory: $baseDir" -ForegroundColor Gray
Write-Host " Press [Ctrl + C] in this terminal to stop the server." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

Start-Process $url

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "index.html"
        }

        # Prevent directory traversal
        $fullPath = [System.IO.Path]::GetFullPath((Join-Path $baseDir $localPath))
        if (-not $fullPath.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            
            # Content-type mapping
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = "application/octet-stream"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".js"   { $mime = "application/javascript; charset=utf-8" }
                ".jpg"  { $mime = "image/jpeg" }
                ".jpeg" { $mime = "image/jpeg" }
                ".png"  { $mime = "image/png" }
                ".svg"  { $mime = "image/svg+xml" }
                ".json" { $mime = "application/json; charset=utf-8" }
                ".ico"  { $mime = "image/x-icon" }
            }
            $response.ContentType = $mime
            $response.ContentLength64 = [long]$bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = [long]$msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
    catch {
        # Catch individual request failures without crashing the server
    }
}

if ($listener) {
    $listener.Stop()
    $listener.Close()
}
