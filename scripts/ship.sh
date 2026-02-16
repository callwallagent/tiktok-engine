#!/usr/bin/env bash
# Render a Remotion composition and re-encode for platform compatibility.
# Usage: bash scripts/ship.sh <CompositionId> [output.mp4]
set -euo pipefail

COMP="${1:?Usage: ship.sh <CompositionId> [output.mp4]}"
OUT="${2:-out/final.mp4}"
RAW="out/raw-${COMP}.mp4"

mkdir -p out

echo "🎬 Rendering ${COMP}..."
npx remotion render "$COMP" --output "$RAW"

echo "🔧 Re-encoding → ${OUT}"
ffmpeg -y -i "$RAW" \
  -c:v libx264 -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -crf 18 -preset fast -profile:v high -level 4.1 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -map_metadata -1 \
  "$OUT"

echo "✅ Done: ${OUT}"
