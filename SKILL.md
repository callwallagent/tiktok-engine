# TikTok Engine — OpenClaw Skill

Generate scroll-stopping TikTok & Reels videos from a script. Multi-voice AI narration, auto-captions, iMessage screenshots, notification screens — all code, zero CapCut.

## Quick Start

```bash
# Clone and install
git clone https://github.com/callwallagent/tiktok-engine.git
cd tiktok-engine && npm install

# 1. Edit your story in src/data/salon-11labs.ts (or create a new one)
# 2. Generate voiceovers
bash scripts/generate-voiceover-11labs.sh

# 3. Transcribe for captions
bash scripts/transcribe-11labs.sh

# 4. Render
npx remotion render Salon11Labs --output out/video-raw.mp4

# 5. Re-encode for compatibility
npm run reencode
```

## Scene Types

- `scene` — Full-bleed image or video background with optional text overlay
- `imessage` — Pixel-perfect iMessage conversation bubbles (programmatic, no AI text garbling)
- `notifications` — iOS-style notification cards with slide-in animation
- `closer` — Animated logo/mascot reveal on white background

## Data File Format

Edit `src/data/salon-11labs.ts`. Each slide is a `SlideData` object:

```typescript
{ type: "scene", bgVideo: "veo-clips/hook.mp4" }
{ type: "imessage", contactName: "Client", messages: [{text: "...", isMe: false}] }
{ type: "notifications", items: ["📅 Appointment booked", "✅ Reminder sent"] }
{ type: "closer" }
```

## Voiceover

Uses ElevenLabs API. Set `ELEVENLABS_API` env var. Edit `scripts/generate-voiceover-11labs.sh` to configure voices and scripts per scene.

## Captions

Uses Whisper.cpp for word-level timestamps. Download the model:
```bash
mkdir -p whisper.cpp && cd whisper.cpp
wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.en.bin
```

## Requirements

- Node.js 18+
- ffmpeg (for re-encoding)
- ElevenLabs API key (for voiceover)
- Whisper.cpp (for captions)

## Output

1080×1920 vertical video at 30fps. Ready for TikTok, Instagram Reels, YouTube Shorts.
