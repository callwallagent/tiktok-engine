import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

interface Props {
  items: string[];
}

const ICONS = ["📅", "👥", "✅", "📞", "💬", "🔔"];

export const NotificationScreen: React.FC<Props> = ({ items }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* Blurred salon background */}
      <AbsoluteFill>
        <Img
          src={staticFile("salon-payoff.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(30px) brightness(0.4)",
            transform: "scale(1.1)",
          }}
        />
      </AbsoluteFill>

      {/* Status bar */}
      <div style={{
        position: "absolute",
        top: 60,
        left: 40,
        fontSize: 36,
        fontWeight: 600,
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
        11:06
      </div>

      {/* Notifications */}
      <div style={{
        position: "absolute",
        top: 300,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: "0 48px",
      }}>
        {items.map((item, i) => {
          const delay = i * 15;
          const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(frame - delay, [0, 12], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Split emoji icon from text
          const emoji = item.match(/^[\p{Emoji}\uFE0F]+/u)?.[0] || ICONS[i] || "📞";
          const text = item.replace(/^[\p{Emoji}\uFE0F]+\s*/u, "");

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.92)",
                borderRadius: 28,
                padding: "28px 32px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: i === 0 ? "#FF6B35" : i === 1 ? "#007AFF" : "#34C759",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
              }}>
                {emoji}
              </div>
              <div style={{
                fontSize: 52,
                fontWeight: 600,
                color: "#1a1a1a",
                lineHeight: 1.3,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}>
                {text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
