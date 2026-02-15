# TikTok Engine — OpenClaw Skill

Generate scroll-stopping TikTok & Reels videos from a script. Multi-voice AI narration, auto-captions, iMessage screenshots, notification screens — all code, zero CapCut.

Open source: https://github.com/callwallagent/tiktok-engine

## Install

```bash
git clone https://github.com/callwallagent/tiktok-engine.git ~/tiktok-engine
cd ~/tiktok-engine && npm install
```

### Required API Keys

On first use, the agent should prompt the user for these and save to `~/tiktok-engine/.env`:

1. **ELEVENLABS_API** — ElevenLabs API key for multi-voice TTS (https://elevenlabs.io → Profile → API Keys)

```bash
echo "ELEVENLABS_API=your_key_here" > ~/tiktok-engine/.env
```

### Required Tools (auto-install if missing)

- **Node.js 18+** — `node --version` to check
- **ffmpeg** — for final video re-encoding (`sudo apt install ffmpeg` or `brew install ffmpeg`)
- **Whisper.cpp** — for word-level captions:
  ```bash
  cd ~/tiktok-engine
  git clone https://github.com/ggerganov/whisper.cpp.git
  cd whisper.cpp && make -j
  wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.en.bin
  ```

## Usage

The agent workflow is conversational. The user describes a vertical/story and the agent:

1. **Creates a data file** — Edit `src/data/` with the story structure (slides, messages, narration scripts)
2. **Generates images** — Use AI image generation (Gemini, Veo, etc.) for scene backgrounds → save to `public/`
3. **Generates voiceover** — Run `bash scripts/generate-voiceover-11labs.sh` (edit script with scene text + voice IDs)
4. **Transcribes captions** — Run `bash scripts/transcribe-11labs.sh`
5. **Renders video** — `npx remotion render Salon11Labs --output out/video-raw.mp4`
6. **Re-encodes** — `npm run reencode` (fixes pixel format for platform compatibility)

Final output: `out/video.mp4` — 1080×1920, 30fps, ready for TikTok/Reels/Shorts.

## Scene Types

| Type | Description |
|------|-------------|
| `scene` | Full-bleed image or video background with optional text overlay + Ken Burns |
| `imessage` | Pixel-perfect iMessage bubbles — programmatic text, zero AI garbling |
| `notifications` | iOS-style notification cards with slide-in animations |
| `closer` | Animated logo/mascot reveal on white background |

## Data File Format

Each slide is a `SlideData` object in TypeScript:

```typescript
// Scene with video background
{ type: "scene", bgVideo: "veo-clips/hook.mp4" }

// iMessage conversation
{ type: "imessage", contactName: "Client", messages: [
  { text: "I've been trying to book for 2 weeks!!", isMe: false },
  { text: "I can't answer mid-color 😭", isMe: true }
]}

// iOS notifications
{ type: "notifications", items: [
  "📅 Appointment booked: Saturday 2pm",
  "✅ Reminder sent to clients"
]}

// Closer with branding
{ type: "closer" }
```

## ElevenLabs Voices

Edit `scripts/generate-voiceover-11labs.sh` to set voices per scene. Default voices:
- **Sarah** (`EXAVITQu4vr4xnSDxMaL`) — narrator, mature confident female
- **Jessica** (`cgSgspJ2msm6clMCkdW9`) — client, playful bright female
- **Bella** — stylist/professional, warm female

Browse voices: https://elevenlabs.io/voice-library

## Tips

- **Scene slides = clean images only** — captions handle all text display
- **iMessage font is 66px, vertically centered** — tested and approved for readability
- **Background music**: drop a file in `public/bg-music.mp3`, set `bgMusic` and `bgMusicVolume` (0.12 recommended) in Root.tsx
- **Telegram squish is a LIE** — Telegram's player misapplies SAR on vertical video. The file is correct. Verify in VLC/Photos.
- **Always re-encode** after Remotion render — fixes yuvj420p → yuv420p for platform compatibility

## Requirements

- Node.js 18+
- ffmpeg
- ElevenLabs API key
- Whisper.cpp (for captions)
- ~2GB disk (Whisper model)
