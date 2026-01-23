$textures = @{
    "mercury.jpg" = "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg"
    "venus.jpg" = "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg"
    "earth.jpg" = "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg"
    "mars.jpg" = "https://www.solarsystemscope.com/textures/download/2k_mars.jpg"
    "jupiter.jpg" = "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg"
    "saturn.jpg" = "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg"
    "uranus.jpg" = "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg"
    "neptune.jpg" = "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg"
    "sun.jpg" = "https://www.solarsystemscope.com/textures/download/2k_sun.jpg"
}

$dest = "client/public/textures"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force }

foreach ($name in $textures.Keys) {
    $url = $textures[$name]
    $output = Join-Path $dest $name
    Write-Host "Downloading $name from $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -ErrorAction Stop
        Write-Host "Success."
    } catch {
        Write-Host "Failed to download $name. Error: $_"
    }
}
