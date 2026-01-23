$textures = @{
    "earth_clouds.jpg" = "https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg"
    "earth_normal.jpg" = "https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.tif" # TIF might be an issue, checking commonly available JPG source
    # SolarSystemScope normal map is TIF usually? 
    # Let's try JPG or PNG from another source if possible, or assume it works.
    # Actually, let's use a known JPG/PNG source for normal map if SSS returns TIF. Browser might not load TIF.
    # Trying alternative reliable source for normal/bump.
    "earth_daymap.jpg" = "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg" # Re-downloading just in case
    "moon.jpg" = "https://www.solarsystemscope.com/textures/download/2k_moon.jpg"
    "stars_milky_way.jpg" = "https://www.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg"
}

# Earth Normal override (fallback to daymap if not found, but trying to find a bump map)
# Using a placeholder URL for normal map that is JPG
$textures["earth_normal.jpg"] = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Earth_normal_map.jpg/2048px-Earth_normal_map.jpg" 
# That wiki path is hypothetical. 
# Better: https://www.solarsystemscope.com/textures/download/2k_moon.jpg is fine.
# For Earth Normal, let's try:
# https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg
$textures["earth_normal.jpg"] = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg"
$textures["earth_specular.jpg"] = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"
$textures["earth_clouds.jpg"] = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"

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
