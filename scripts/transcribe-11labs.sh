#!/bin/bash
# Transcribe 11Labs voiceover files with Whisper
WHISPER="./whisper.cpp/main"
MODEL="./whisper.cpp/ggml-medium.en.bin"
INDIR="public/voiceover/salon-11labs"
OUTDIR="public/captions/salon-11labs"
mkdir -p "$OUTDIR"

for scene in scene-01-hook scene-02-combined scene-03-problem scene-04-ai scene-05-convert scene-06-closer; do
  JSON="$OUTDIR/$scene.json"
  if [ -f "$JSON" ]; then
    echo "Skipping $scene (exists)"
    continue
  fi
  
  MP3="$INDIR/$scene.mp3"
  WAV="/tmp/$scene.wav"
  
  echo "Converting $scene to WAV..."
  ffmpeg -y -i "$MP3" -ar 16000 -ac 1 "$WAV" 2>/dev/null
  
  echo "Transcribing $scene..."
  $WHISPER -m "$MODEL" -f "$WAV" --dtw medium.en -oj -ojf -of "/tmp/$scene" -pp 2>&1 | grep -E "^\[|progress"
  
  # Convert whisper JSON to Remotion caption format
  python3 -c "
import json
with open('/tmp/${scene}.json') as f:
    data = json.load(f)
captions = []
for seg in data.get('transcription', []):
    for tok in seg.get('tokens', []):
        t = tok.get('text', '').strip()
        if not t or t.startswith('['):
            continue
        captions.append({
            'text': tok['text'],
            'startMs': int(tok['offsets']['from']),
            'endMs': int(tok['offsets']['to']),
            'timestampMs': int(tok['offsets']['from']),
            'confidence': tok.get('p', 1.0)
        })
with open('$JSON', 'w') as f:
    json.dump(captions, f, indent=2)
print(f'  → $JSON ({len(captions)} tokens)')
"
  
  rm -f "$WAV"
done

echo "Done!"
