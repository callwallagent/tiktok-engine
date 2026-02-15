import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useVideoConfig,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";

const HIGHLIGHT_COLOR = "#39E508";
const SWITCH_CAPTIONS_EVERY_MS = 800;

interface CaptionOverlayProps {
  captionFiles: { file: string; offsetMs: number }[];
}

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 280,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          whiteSpace: "pre-wrap",
          textAlign: "center",
          maxWidth: "90%",
          lineHeight: 1.2,
          textShadow:
            "0 4px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8), 2px 2px 0 rgba(0,0,0,0.7), -2px -2px 0 rgba(0,0,0,0.7)",
        }}
      >
        {page.tokens.map((token, i) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;

          return (
            <span
              key={`${token.fromMs}-${i}`}
              style={{
                color: isActive ? HIGHLIGHT_COLOR : "white",
                transition: "color 0.05s",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  captionFiles,
}) => {
  const { fps } = useVideoConfig();
  const [allCaptions, setAllCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const combined: Caption[] = [];
      for (const { file, offsetMs } of captionFiles) {
        const response = await fetch(staticFile(file));
        const captions: Caption[] = await response.json();
        // Offset all timestamps
        for (const cap of captions) {
          combined.push({
            ...cap,
            startMs: cap.startMs + offsetMs,
            endMs: cap.endMs + offsetMs,
          });
        }
      }
      setAllCaptions(combined);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [captionFiles, continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const pages = useMemo(() => {
    if (!allCaptions) return [];
    return createTikTokStyleCaptions({
      captions: allCaptions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    }).pages;
  }, [allCaptions]);

  if (!allCaptions) return null;

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps
        );
        const durationInFrames = Math.max(1, Math.ceil(endFrame - startFrame));

        return (
          <Sequence
            key={index}
            from={Math.round(startFrame)}
            durationInFrames={durationInFrames}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
