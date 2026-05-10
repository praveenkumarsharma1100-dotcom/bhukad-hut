$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Listening on port $port"
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    
    $path = $req.RawUrl.Split('?')[0]
    if ($path -eq "/") { $path = "/index.html" }
    $filepath = Join-Path "C:\Users\HP\.antigravity\bhukad-hut" $path.Replace("/", "\")
    
    if (Test-Path $filepath) {
        if ($filepath -match "\.css$") { $res.ContentType = "text/css" }
        elseif ($filepath -match "\.js$") { $res.ContentType = "application/javascript" }
        else { $res.ContentType = "text/html" }
        
        $bytes = [System.IO.File]::ReadAllBytes($filepath)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.Close()
}
