# Public Assets (Not Included in Repo)

This directory holds media files that are **not checked into git** (audio, video, images).

## Directory Structure

```
public/
├── voiceover/
│   └── salon-v2/           ← Generated MP3 voiceovers (via scripts/generate-voiceover-11labs.sh)
│       ├── scene-01-hook.mp3
│       ├── scene-02-combined.mp3
│       ├── scene-03-problem.mp3
│       ├── scene-04-ai.mp3
│       ├── scene-05-convert.mp3
│       └── scene-06-closer.mp3
├── captions/
│   └── salon-v2/           ← Generated caption JSON (via scripts/transcribe-11labs.sh)
│       ├── scene-01-hook.json
│       └── ...
├── veo-clips/              ← AI-generated video clips (Veo, Runway, etc.)
│   ├── clip01_hook.mp4
│   ├── clip03_problem.mp4
│   └── clip05_convert.mp4
├── bg-music.mp3            ← Background music track
├── salon-payoff.jpg        ← Notification screen background
├── callwall-mascot.png     ← Closer slide mascot
└── callwall-logo.jpg       ← Closer slide logo
```

## Getting Started

1. Run `scripts/generate-voiceover-11labs.sh` to generate voiceovers (needs `ELEVENLABS_API` env var)
2. Combine multi-voice scenes with ffmpeg (see script comments)
3. Run `scripts/transcribe-11labs.sh` to generate word-level captions
4. Add your background video clips to `veo-clips/`
5. Add background images and brand assets

All paths in the data file (`src/data/salon-11labs.ts`) are relative to this `public/` directory.
