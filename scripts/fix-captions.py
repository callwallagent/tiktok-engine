#!/usr/bin/env python3
"""Fix brand name misspellings in Whisper-generated caption JSON files."""

import json
import sys
import re
from pathlib import Path

REPLACEMENTS = {
    r"\bKallwall\b": "CallWall",
    r"\bKall Wall\b": "CallWall",
    r"\bCall Wahl\b": "CallWall",
    r"\bCallwahl\b": "CallWall",
    r"\bCall Wall\b": "CallWall",
    r"\bKall wall\b": "CallWall",
    r"\bkallwall\b": "CallWall",
    r"\bcall wall\b": "CallWall",
    r"\bcallwahl\b": "CallWall",
    r"\bKallwal\b": "CallWall",
    r"\bCallwal\b": "CallWall",
}


def fix_text(text: str) -> str:
    for pattern, replacement in REPLACEMENTS.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text


def fix_caption_file(path: Path) -> bool:
    data = json.loads(path.read_text())
    changed = False
    for cap in data:
        if "text" in cap:
            fixed = fix_text(cap["text"])
            if fixed != cap["text"]:
                cap["text"] = fixed
                changed = True
    if changed:
        path.write_text(json.dumps(data, indent=2) + "\n")
        print(f"Fixed: {path}")
    return changed


if __name__ == "__main__":
    paths = sys.argv[1:] or list(Path("public/captions").rglob("*.json"))
    fixed = sum(fix_caption_file(Path(p)) for p in paths)
    print(f"Done. {fixed} file(s) updated.")
