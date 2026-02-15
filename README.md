# 🎬 TikTok Engine

### An [OpenClaw](https://openclaw.ai) Skill / Plugin

**Programmatic TikTok & Reels video engine powered by [Remotion](https://remotion.dev).**

Create scroll-stopping vertical videos entirely from code — no video editor needed. Define your scenes in a TypeScript data file, generate voiceovers with ElevenLabs, auto-caption with Whisper, and render pixel-perfect 1080×1920 video.

**As an OpenClaw skill**, your AI agent can generate TikTok videos conversationally — just say *"make me a salon TikTok"* and the agent handles the entire pipeline: scriptwriting, voice generation, captioning, and rendering.

Built by [CallWall](https://callwall.ai) for founder content that actually converts.

---

## 🎥 What It Does

The included example tells the story of a **hair salon owner drowning in missed calls** — until AI starts handling her bookings. The video flows through:

1. **Hook** — AI-generated video clip (Veo) with voiceover
2. **iMessage conversation** — programmatic chat bubbles with exact text (no AI garbling)
3. **Problem scene** — cinematic B-roll with narration
4. **Notification screen** — iOS-style notifications showing AI at work
5. **Testimonial iMessage** — conversion moment with multi-voice dialogue
6. **Payoff** — brand video with closer narration
7. **Closer** — animated logo + mascot + CTA

Every element is rendered programmatically. No screenshots, no screen recordings, no manual editing.

---

## ✨ Features

- **🎙️ Multi-voice ElevenLabs TTS** — Different voices for narrator, client, stylist
- **📝 Whisper auto-captions** — Word-level timestamps with real-time highlighting (green word tracking)
- **💬 Programmatic iMessage screens** — Pixel-perfect chat bubbles, animated entrance
- **🔔 iOS notification screens** — Blurred background, staggered card animations
- **🎬 Veo/AI video backgrounds** — Drop in AI-generated clips as scene backgrounds
- **🎵 Background music** — Looping audio track with configurable volume
- **🎨 Ken Burns effects** — Smooth zoom/pan on static images
- **⚡ Crossfade transitions** — 8-frame opacity transitions between scenes
- **📐 1080×1920 native** — Vertical-first, TikTok/Reels/Shorts ready

---

## 🤖 OpenClaw Skill Installation

If you're using [OpenClaw](https://openclaw.ai), install this as a skill so your agent can generate videos from natural language:

```bash
cd ~/.openclaw/skills
git clone https://github.com/callwallagent/tiktok-engine.git
cd tiktok-engine && npm install
```

Then just tell your agent: *"Make me a TikTok about my salon"* — it reads `SKILL.md` and handles the rest.

See [`SKILL.md`](./SKILL.md) for full agent usage docs.

---

## 🚀 Quick Start (Standalone)

### 1. Clone & Install

```bash
git clone https://github.com/callwallagent/tiktok-engine.git
cd tiktok-engine
npm install
```

### 2. Preview in Remotion Studio

```bash
npm run dev
```

> ⚠️ You'll need media files in `public/` first. See [Public Assets](./public/README.md) for the directory structure.

### 3. Generate Voiceovers (ElevenLabs)

```bash
export ELEVENLABS_API="your-api-key"
bash scripts/generate-voiceover-11labs.sh
```

This creates MP3 files for each scene using different voices (Sarah = narrator, Jessica = client, Laura = stylist).

### 4. Combine Multi-Voice Scenes

For scenes with multiple speakers (e.g., iMessage conversations), concatenate with ffmpeg:

```bash
ffmpeg -i scene-02-client.mp3 -i scene-02-stylist.mp3 \
  -filter_complex "[0][1]concat=n=2:v=0:a=1" \
  scene-02-combined.mp3
```

### 5. Transcribe for Captions (Whisper)

```bash
bash scripts/transcribe-11labs.sh
```

> Requires [whisper.cpp](https://github.com/ggerganov/whisper.cpp) built locally with the `medium.en` model. The script converts MP3→WAV, runs word-level transcription, and outputs Remotion-compatible caption JSON.

### 6. Render & Re-encode

```bash
# Render with Remotion
npm run render

# Re-encode for universal compatibility
npm run reencode
```

Or do both in one step:

```bash
npm run build
```

Your final video is at `out/final.mp4`.

---

## 📁 Data File Format

Videos are defined in TypeScript data files (see `src/data/salon-11labs.ts`). Each video is an array of `SlideData` objects:

```typescript
interface SlideData {
  type: "hook" | "scene" | "imessage" | "notifications" | "closer";
  topText?: string;           // Large text overlay (top)
  bottomText?: string;        // Secondary text overlay (bottom)
  bgImage?: string;           // Background image path (relative to public/)
  bgVideo?: string;           // Background video path (relative to public/)
  contactName?: string;       // iMessage: contact name
  messages?: Message[];       // iMessage: chat bubbles
  items?: string[];           // Notifications: notification cards
  showLogo?: boolean;         // Show brand logo overlay
  payoffImage?: string;       // Crossfade payoff image
  payoffVideo?: string;       // Crossfade payoff video
  payoffAtFrame?: number;     // Frame to start payoff crossfade
}

interface Message {
  text: string;
  isMe: boolean;              // true = blue bubble (right), false = gray (left)
}
```

### Slide Types

| Type | Component | What It Does |
|------|-----------|-------------|
| `hook` | `TextOverlaySlide` | Full-screen video/image with text overlay |
| `scene` | `TextOverlaySlide` | Same as hook — use for any B-roll scene |
| `imessage` | `IMessageScreen` | Animated iMessage conversation |
| `notifications` | `NotificationScreen` | iOS notification cards on blurred background |
| `closer` | `CloserSlide` | Animated logo + mascot + domain reveal |

### Scene Timing

Each scene also needs:
- **Audio file** — path to the voiceover MP3
- **Caption file** — path to the Whisper-generated JSON
- **Duration** — in frames (audio duration + 0.3s padding, × 30fps)

```typescript
export const durations = [
  Math.ceil((5.67 + 0.3) * 30),  // scene-01: audio is 5.67s + 0.3s pad
  Math.ceil((4.60 + 0.3) * 30),  // scene-02
  // ...
];
```

---

## 🎙️ Voiceover Pipeline

```
ElevenLabs API → MP3 files → ffmpeg concat (multi-voice) → Whisper transcription → Caption JSON
```

1. **Generate** — `scripts/generate-voiceover-11labs.sh` calls the ElevenLabs API with per-scene text and voice IDs
2. **Combine** — For multi-speaker scenes, concatenate MP3s with ffmpeg
3. **Transcribe** — `scripts/transcribe-11labs.sh` runs whisper.cpp with `--dtw` for word-level timestamps
4. **Format** — Python converts Whisper JSON to Remotion's `Caption[]` format:

```json
[
  { "text": " She", "startMs": 0, "endMs": 440, "timestampMs": 0, "confidence": 0.95 },
  { "text": " ghosted", "startMs": 440, "endMs": 880, "timestampMs": 440, "confidence": 0.92 }
]
```

The `CaptionOverlay` component uses `@remotion/captions` to create TikTok-style word highlighting — the current word lights up green as it's spoken.

---

## 🎞️ FFmpeg Re-encode

Remotion outputs `yuvj420p` pixel format which causes issues on some players. The re-encode step fixes this:

```bash
ffmpeg -y -i out/raw.mp4 \
  -c:v libx264 -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -crf 18 -preset fast -profile:v high -level 4.1 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -map_metadata -1 \
  out/final.mp4
```

This ensures:
- ✅ Correct pixel format (`yuv420p`) for universal playback
- ✅ BT.709 color space tags for accurate colors
- ✅ `faststart` for instant web playback
- ✅ Clean metadata

### ⚠️ Telegram Squish is a LIE

Telegram's inline video player misapplies SAR on vertical (1080×1920) video — it looks squished/stretched in the chat preview. **The file is actually correct.** Always verify by:
- Downloading and opening in Photos or VLC
- The video displays perfectly on TikTok, Instagram, YouTube Shorts, and every other platform

Don't chase encoding ghosts. Trust the file.

---

## 🏗️ Project Structure

```
tiktok-engine/
├── src/
│   ├── index.ts                      # Remotion entry point
│   ├── Root.tsx                      # Composition registration
│   ├── TikTokCarouselWithAudio.tsx   # Main video engine
│   ├── types.ts                      # SlideData types
│   ├── components/
│   │   ├── TextOverlaySlide.tsx      # Video/image + text overlay
│   │   ├── IMessageScreen.tsx        # iMessage conversation UI
│   │   ├── NotificationScreen.tsx    # iOS notifications UI
│   │   ├── CloserSlide.tsx           # Brand closer with animations
│   │   └── CaptionOverlay.tsx        # Word-level caption rendering
│   └── data/
│       └── salon-11labs.ts           # Example: salon video data
├── scripts/
│   ├── generate-voiceover-11labs.sh  # ElevenLabs TTS generation
│   └── transcribe-11labs.sh          # Whisper transcription
├── public/                           # Media assets (not in git)
│   ├── voiceover/                    # Generated MP3s
│   ├── captions/                     # Generated caption JSONs
│   └── veo-clips/                    # AI video backgrounds
├── remotion.config.ts                # Remotion + Tailwind config
├── package.json
└── tsconfig.json
```

---

## 🎨 Customizing

### Create a New Video

1. Copy `src/data/salon-11labs.ts` → `src/data/your-video.ts`
2. Define your slides, audio files, captions, and durations
3. Update `src/Root.tsx` to import your new data file
4. Generate voiceovers and captions
5. Render!

### Add a New Slide Type

1. Create a new component in `src/components/`
2. Add the type to `SlideData` in `src/types.ts`
3. Add the case to `SlideRenderer` in `TikTokCarouselWithAudio.tsx`

---

## 📋 Requirements

- **Node.js** 18+
- **ffmpeg** (for audio concat and final re-encode)
- **ElevenLabs API key** (for TTS generation)
- **whisper.cpp** with `medium.en` model (for transcription)

---

## 🙏 Credits

- [OpenClaw](https://openclaw.ai) — AI agent platform (this is an OpenClaw plugin/skill)
- Built with [Remotion](https://remotion.dev) — React for video
- Example brand: [CallWall](https://callwall.ai) — AI phone agent for service businesses
- TTS: [ElevenLabs](https://elevenlabs.io)
- Captions: [whisper.cpp](https://github.com/ggerganov/whisper.cpp)

---

## 📄 License

MIT — use it, fork it, make videos that convert.
