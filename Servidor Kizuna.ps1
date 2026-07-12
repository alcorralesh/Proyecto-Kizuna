$root = $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
Start-Process 'http://localhost:8000/index.html'
Write-Host 'Kizuna Travel Bureau está disponible en http://localhost:8000/index.html'
Write-Host 'Cierra esta ventana cuando termines.'
$mime = @{'.html'='text/html; charset=utf-8';'.css'='text/css; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.png'='image/png';'.jpg'='image/jpeg';'.jpeg'='image/jpeg';'.svg'='image/svg+xml';'.webp'='image/webp'}
while ($listener.IsListening) {
  $context = $listener.GetContext()
  $relative = [uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
  if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
  $relative = $relative -replace '/', '\\'
  $file = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
  if (-not $file.StartsWith([System.IO.Path]::GetFullPath($root)) -or -not (Test-Path -LiteralPath $file -PathType Leaf)) {
    $context.Response.StatusCode = 404
    $context.Response.Close()
    continue
  }
  $extension = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
  $context.Response.ContentType = if ($mime.ContainsKey($extension)) { $mime[$extension] } else { 'application/octet-stream' }
  $bytes = [System.IO.File]::ReadAllBytes($file)
  $context.Response.ContentLength64 = $bytes.Length
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.Close()
}
