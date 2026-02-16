#!/usr/bin/env python3
"""GPU-accelerated transcription with CPU fallback. Uses faster-whisper (CTranslate2).
Outputs word-level JSON captions compatible with the TikTok Engine pipeline."""

import json, re, sys, os, time, glob

def transcribe(audio_path, output_path, device="auto", model_size="medium.en"):
    from faster_whisper import WhisperModel
    
    if device == "auto":
        try:
            import ctranslate2
            device = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
        except:
            device = "cpu"
    
    compute = "float16" if device == "cuda" else "int8"
    print(f"  Device: {device} ({compute})")
    
    model = WhisperModel(model_size, device=device, compute_type=compute)
    
    start = time.time()
    segments, info = model.transcribe(audio_path, word_timestamps=True)
    
    words = []
    for seg in segments:
        for w in seg.words:
            text = w.word
            # Skip Whisper control tokens
            if re.match(r'^\s*\[.*\]\s*$', text):
                continue
            words.append({
                "text": text,
                "startMs": int(w.start * 1000),
                "endMs": int(w.end * 1000),
                "timestampMs": int(w.start * 1000),
                "confidence": round(w.probability, 6)
            })
    
    elapsed = time.time() - start
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(words, f, indent=2)
    
    print(f"  {len(words)} words in {elapsed:.2f}s → {output_path}")
    return words

def fix_brand_names(caption_path, replacements=None):
    """Fix common Whisper brand misspellings."""
    if replacements is None:
        replacements = {
            "Kallwall": "CallWall",
            "Call Wahl": "CallWall", 
            "Callwall": "CallWall",
            "call wall": "CallWall",
            "Kall wall": "CallWall",
        }
    
    with open(caption_path) as f:
        words = json.load(f)
    
    full_text = "".join(w["text"] for w in words)
    changed = False
    for wrong, right in replacements.items():
        if wrong.lower() in full_text.lower():
            # Fix individual word tokens
            for w in words:
                for wrong_word in wrong.split():
                    if w["text"].strip().lower() == wrong_word.lower():
                        # Map to correct word
                        right_words = right.split()
                        if len(right_words) == 1:
                            w["text"] = " " + right if w["text"].startswith(" ") else right
                            changed = True
    
    if changed:
        with open(caption_path, 'w') as f:
            json.dump(words, f, indent=2)
        print(f"  Fixed brand names in {caption_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: transcribe-gpu.py <audio_dir> <caption_dir> [--device cuda|cpu|auto] [--fix-brands]")
        sys.exit(1)
    
    audio_dir = sys.argv[1]
    caption_dir = sys.argv[2]
    device = "auto"
    fix_brands = False
    
    for arg in sys.argv[3:]:
        if arg.startswith("--device"):
            device = sys.argv[sys.argv.index(arg) + 1]
        if arg == "--fix-brands":
            fix_brands = True
    
    audio_files = sorted(glob.glob(os.path.join(audio_dir, "*.mp3")))
    if not audio_files:
        print(f"No MP3 files found in {audio_dir}")
        sys.exit(1)
    
    print(f"Transcribing {len(audio_files)} files...")
    total_start = time.time()
    
    for audio_path in audio_files:
        base = os.path.splitext(os.path.basename(audio_path))[0]
        output_path = os.path.join(caption_dir, f"{base}.json")
        print(f"\n{base}:")
        transcribe(audio_path, output_path, device=device)
        
        if fix_brands:
            fix_brand_names(output_path)
    
    total = time.time() - total_start
    print(f"\nDone! {len(audio_files)} files in {total:.2f}s")
