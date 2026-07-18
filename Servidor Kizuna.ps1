$root = $PSScriptRoot
$preferredPort = 8000

function Test-KizunaServer([int]$Port) {
  try {
    $response = Invoke-WebRequest -Uri "http://localhost:$Port/index.html" -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200 -and $response.Content -match 'KIZUNA'
  } catch {
    return $false
  }
}

# El acceso directo puede ejecutarse varias veces. Si Kizuna ya está servido
# (por este script o por `python -m http.server`), reutilizamos esa instancia.
if (Test-KizunaServer $preferredPort) {
  $url = "http://localhost:$preferredPort/index.html"
  Write-Host "Kizuna ya estaba disponible en $url"
  Start-Process $url
  exit 0
}

# Si otra aplicación ocupa 8000, buscamos un puerto alternativo para no
# detener ni cerrar procesos ajenos.
$port = $preferredPort
while ($port -le 8010) {
  $occupied = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
  if (-not $occupied) { break }
  $port++
}
if ($port -gt 8010) {
  Write-Error 'No hay ningún puerto disponible entre 8000 y 8010.'
  exit 1
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
try {
  $listener.Start()
} catch {
  Write-Error "No se pudo iniciar el servidor de Kizuna: $($_.Exception.Message)"
  exit 1
}

$url = "http://localhost:$port/index.html"
Start-Process $url
Write-Host "Kizuna Travel Bureau está disponible en $url"
Write-Host 'Cierra esta ventana cuando termines.'
$mime = @{'.html'='text/html; charset=utf-8';'.css'='text/css; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.json'='application/json; charset=utf-8';'.webmanifest'='application/manifest+json';'.png'='image/png';'.jpg'='image/jpeg';'.jpeg'='image/jpeg';'.svg'='image/svg+xml';'.webp'='image/webp';'.ico'='image/x-icon';'.mp3'='audio/mpeg';'.wav'='audio/wav';'.ogg'='audio/ogg'}
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $relative = [uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
    $relative = $relative -replace '/', '\'
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
} finally {
  $listener.Stop()
  $listener.Close()
}
