# Regenerates the self-hosted brand webfonts.
#
# Fetches the exact weights/axes the site uses from Google Fonts, keeps the
# latin + latin-ext subsets, downloads the woff2 files into public/fonts/, and
# writes src/styles/fonts.css with @font-face rules pointing at those local paths.
#
# Run from the repo root (PowerShell):  ./scripts/fetch-fonts.ps1
# Re-run whenever the weights/axes in the specs below change, then commit the
# regenerated public/fonts/*.woff2 and src/styles/fonts.css.

$ErrorActionPreference = 'Stop'
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
$root = Split-Path -Parent $PSScriptRoot
$fontDir = Join-Path $root "public\fonts"
$cssOut  = Join-Path $root "src\styles\fonts.css"
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null

# Exact axis/weight specs mirroring the design system (keep in sync with DESIGN_NOTES.md).
$families = @(
  @{ slug = "newsreader";     q = "Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500" },
  @{ slug = "hanken-grotesk"; q = "Hanken+Grotesk:wght@400;500;600;700" },
  @{ slug = "ibm-plex-mono";  q = "IBM+Plex+Mono:wght@400;500" }
)

$keepSubsets = @("latin", "latin-ext")
$header = "/* Self-hosted brand webfonts. Generated from Google Fonts (latin + latin-ext subsets)." + [Environment]::NewLine + "   Do not hand-edit; regenerate with scripts/fetch-fonts.ps1 if weights/axes change. */" + [Environment]::NewLine + [Environment]::NewLine
$allCss = New-Object System.Collections.Generic.List[string]
$allCss.Add($header)
$downloaded = 0

foreach ($fam in $families) {
  $url = "https://fonts.googleapis.com/css2?family=$($fam.q)&display=swap"
  $css = (Invoke-WebRequest -Uri $url -UserAgent $ua -TimeoutSec 30 -UseBasicParsing).Content

  $rx = [regex]'(?s)/\*\s*(?<subset>[\w-]+)\s*\*/\s*@font-face\s*\{(?<body>.*?)\}'
  foreach ($m in $rx.Matches($css)) {
    $subset = $m.Groups['subset'].Value.Trim()
    if ($keepSubsets -notcontains $subset) { continue }
    $body = $m.Groups['body'].Value

    $style  = ([regex]'font-style:\s*([^;]+);').Match($body).Groups[1].Value.Trim()
    $weight = ([regex]'font-weight:\s*([^;]+);').Match($body).Groups[1].Value.Trim()
    $srcUrl = ([regex]'url\(([^)]+)\)').Match($body).Groups[1].Value.Trim()

    $wTok = ($weight -replace '\s+','-')
    $fileName = "$($fam.slug)-$style-$wTok-$subset.woff2"
    $outFile = Join-Path $fontDir $fileName

    Invoke-WebRequest -Uri $srcUrl -UserAgent $ua -TimeoutSec 30 -UseBasicParsing -OutFile $outFile
    $downloaded++

    $newBody = ($body -replace 'url\([^)]+\)', "url('/fonts/$fileName')").Trim()
    $allCss.Add("@font-face {" + [Environment]::NewLine + "  " + ($newBody -replace "`r?`n\s*", ([Environment]::NewLine + "  ")) + [Environment]::NewLine + "}" + [Environment]::NewLine)
  }
}

($allCss -join [Environment]::NewLine) | Out-File -FilePath $cssOut -Encoding utf8
Write-Output "Downloaded $downloaded woff2 files to $fontDir"
Write-Output "Wrote CSS to $cssOut"
