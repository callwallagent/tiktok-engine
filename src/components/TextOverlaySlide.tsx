import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { Video } from "@remotion/media";

interface Props {
  topText?: string;
  bottomText?: string;
  bgImage?: string;
  bgVideo?: string;
  showLogo?: boolean;
  bgColor?: string;
}

export const TextOverlaySlide: React.FC<Props> = ({
  topText,
  bottomText,
  bgImage,
  bgVideo,
  showLogo,
  bgColor = "#1a1a2e",
}) => {
  const frame = useCurrentFrame();
  const topOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomOpacity = interpolate(frame, [8, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Background video */}
      {bgVideo && (
        <div className="absolute inset-0">
          <Video
            src={staticFile(bgVideo)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Background image with Ken Burns zoom */}
      {bgImage && !bgVideo && (() => {
        const scale = interpolate(frame, [0, 200], [1.0, 1.15], {
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(frame, [0, 200], [0, -20], {
          extrapolateRight: "clamp",
        });
        return (
          <div className="absolute inset-0" style={{ overflow: "hidden" }}>
            <Img
              src={staticFile(bgImage)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${scale}) translateY(${translateY}px)`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        );
      })()}

      {/* Top text */}
      {topText && (
        <div
          style={{ opacity: topOpacity }}
          className="absolute top-[80px] left-0 right-0 px-8"
        >
          <h1
            className="text-white text-[72px] font-black leading-[1.1] text-center"
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
              whiteSpace: "pre-line",
            }}
          >
            {topText}
          </h1>
        </div>
      )}

      {/* Bottom text */}
      {bottomText && (
        <div
          style={{ opacity: bottomOpacity }}
          className="absolute bottom-[200px] left-0 right-0 px-8"
        >
          <p
            className="text-white text-[56px] font-bold leading-tight text-center"
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
            }}
          >
            {bottomText}
          </p>
        </div>
      )}

      {/* CallWall logo + website */}
      {showLogo && (
        <div
          style={{ opacity: logoOpacity }}
          className="absolute bottom-[120px] left-0 right-0 flex flex-col items-center gap-4"
        >
          <Img
            src={staticFile("callwall-logo.jpg")}
            style={{ width: 600, height: "auto", borderRadius: 12 }}
          />
          <span
            className="text-white text-[48px] font-semibold tracking-wide"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            CallWall.AI
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
