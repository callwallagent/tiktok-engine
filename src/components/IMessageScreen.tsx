import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { Message } from "../types";

interface Props {
  contactName: string;
  messages: Message[];
  payoffImage?: string;
  payoffVideo?: string;
  payoffAtFrame?: number; // frame to start crossfade to payoff
}

export const IMessageScreen: React.FC<Props> = ({ contactName, messages, payoffImage, payoffVideo, payoffAtFrame }) => {
  const frame = useCurrentFrame();

  // Payoff image crossfade
  const payoffOpacity = payoffImage && payoffAtFrame != null
    ? interpolate(frame, [payoffAtFrame, payoffAtFrame + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "white", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div className="flex justify-between items-center px-8 pt-4 pb-2">
        <span className="text-black text-[32px] font-semibold">9:41</span>
        <div className="flex gap-2">
          <span className="text-black text-[24px]">📶</span>
          <span className="text-black text-[24px]">🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <span className="text-blue-500 text-[36px] mr-4">‹</span>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-[80px] h-[80px] rounded-full bg-gray-300 flex items-center justify-center mb-2">
            <span className="text-[40px]">👤</span>
          </div>
          <span className="text-black text-[48px] font-medium">{contactName}</span>
        </div>
        <span className="text-blue-500 text-[36px]">📹</span>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col justify-center px-6 gap-6">
        {messages.map((msg, i) => {
          const delay = i * 15;
          const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(frame - delay, [0, 8], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{ opacity, transform: `translateY(${translateY}px)` }}
              className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-6 py-4 rounded-[24px] ${
                  msg.isMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <span className="text-[66px] leading-tight">{msg.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="flex items-center px-6 py-4 border-t border-gray-200 gap-4">
        <div className="flex-1 h-[60px] rounded-full border-2 border-gray-300 px-6 flex items-center">
          <span className="text-gray-400 text-[34px]">iMessage</span>
        </div>
        <span className="text-blue-500 text-[36px]">⬆️</span>
      </div>

      {/* Payoff crossfade — video or image */}
      {(payoffVideo || payoffImage) && payoffOpacity > 0 && (
        <AbsoluteFill style={{ opacity: payoffOpacity }}>
          {payoffVideo ? (
            <Video
              src={staticFile(payoffVideo)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
            />
          ) : (
            <Img
              src={staticFile(payoffImage!)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
