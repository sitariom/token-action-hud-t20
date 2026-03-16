# Define variables
$moduleName = "token-action-hud-t20"
$zipName = "module.zip"
$exclude = @(".git", ".gitignore", "node_modules", ".vscode", ".idea", ".DS_Store", "Thumbs.db", "package-release.ps1", "module.zip", "temp_package")

# Remove existing zip if it exists
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

# Create a temporary directory for packaging
$tempDir = Join-Path $PSScriptRoot "temp_package"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files to temp directory
Get-ChildItem -Path $PSScriptRoot | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tempDir -Recurse
}

# Create the zip file
# Note: We zip the CONTENT of the folder, not the folder itself, so it extracts correctly in Foundry
Compress-Archive -Path "$tempDir\*" -DestinationPath "$PSScriptRoot\$zipName"

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

Write-Host "Success! Created $zipName ready for release."
