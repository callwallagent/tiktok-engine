#!/bin/bash
# Multi-voice ElevenLabs TTS for salon carousel
# Set ELEVENLABS_API env var before running
# export ELEVENLABS_API="your-api-key"

# Voice IDs
SARAH="EXAVITQu4vr4xnSDxMaL"   # Narrator - mature, confident
JESSICA="cgSgspJ2msm6clMCkdW9"  # Client - playful, bright  
LAURA="FGY2WhTYpPnrIDTdsKH5"    # Stylist - enthusiastic

OUTDIR="public/voiceover/salon-11labs"
mkdir -p "$OUTDIR"

generate() {
  local id=$1
  local voice=$2
  local text=$3
  local out="$OUTDIR/$id.mp3"
  
  if [ -f "$out" ]; then
    echo "Skipping $id (exists)"
    return
  fi
  
  echo "Generating $id (voice: $voice)..."
  curl -s "https://api.elevenlabs.io/v1/text-to-speech/$voice" \
    -H "xi-api-key: $ELEVENLABS_API" \
    -H "Content-Type: application/json" \
    -o "$out" \
    -d "{
      \"text\": \"$text\",
      \"model_id\": \"eleven_multilingual_v2\",
      \"voice_settings\": {
        \"stability\": 0.5,
        \"similarity_boost\": 0.75,
        \"style\": 0.3
      }
    }"
  
  local size=$(stat -c%s "$out" 2>/dev/null || echo 0)
  if [ "$size" -lt 1000 ]; then
    echo "  ERROR: File too small ($size bytes), may have failed"
    cat "$out"
    rm "$out"
  else
    echo "  → $out ($((size/1024)) KB)"
  fi
}

# Scene 1: Narrator hook
generate "scene-01-hook" "$SARAH" \
  "She ghosted my calls for three weeks. Turns out she was just... cutting hair."

# Scene 2: Two voices - client then stylist
generate "scene-02-client" "$JESSICA" \
  "I've been trying to book with you for two weeks!"
generate "scene-02-stylist" "$LAURA" \
  "I literally cannot answer mid-color."

# Scene 3: Narrator problem
generate "scene-03-problem" "$SARAH" \
  "Four missed calls. Hands full. Phone ringing. Every stylist knows this feeling."

# Scene 4: Narrator AI working  
generate "scene-04-ai" "$SARAH" \
  "Then AI started answering. Appointments booked. Waitlist updated. DMs handled. All while she worked."

# Scene 5: Stylist testimonial
generate "scene-05-convert" "$LAURA" \
  "I went from forty percent no-shows to five percent because AI confirms every single appointment. I'm literally crying."

# Scene 6: Narrator closer
generate "scene-06-closer" "$SARAH" \
  "Your clients aren't ghosting you. They just can't reach you."

echo ""
echo "Done! Files in $OUTDIR"
