import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const CloserSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mascotScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const domainY = interpolate(frame, [8, 20], [30, 0], { extrapolateRight: "clamp" });
  const domainOpacity = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}>
      {/* Logo + Domain */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: logoOpacity,
        marginBottom: 60,
      }}>
        <div style={{
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -2,
          fontFamily: "Inter, system-ui, sans-serif",
          display: "flex",
        }}>
          <span style={{ color: "#E8751A" }}>Call</span>
          <span style={{ color: "#1a1a1a" }}>Wall</span>
        </div>
        <div style={{
          fontSize: 48,
          fontWeight: 600,
          color: "#1a1a1a",
          marginTop: 12,
          opacity: domainOpacity,
          transform: `translateY(${domainY}px)`,
          fontFamily: "Inter, system-ui, sans-serif",
        }}>
          callwall.ai
        </div>
      </div>

      {/* Mascot — fixed aspect ratio container */}
      <div style={{
        width: 450,
        height: 426,
        transform: `scale(${mascotScale})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Img
          src={staticFile("callwall-mascot.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
