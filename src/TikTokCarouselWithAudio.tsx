import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import { SlideData } from "./types";
import { IMessageScreen } from "./components/IMessageScreen";
import { NotificationScreen } from "./components/NotificationScreen";
import { TextOverlaySlide } from "./components/TextOverlaySlide";
import { CaptionOverlay } from "./components/CaptionOverlay";
import { CloserSlide } from "./components/CloserSlide";

interface Props {
  slides: SlideData[];
  audioFiles: string[];
  captionFiles: string[];
  sceneDurations: number[]; // in frames
  bgMusic?: string;
  bgMusicVolume?: number;
}

const SlideRenderer: React.FC<{ slide: SlideData }> = ({ slide }) => {
  switch (slide.type) {
    case "hook":
    case "scene":
      return (
        <TextOverlaySlide
          topText={slide.topText}
          bottomText={slide.bottomText}
          bgImage={slide.bgImage}
          bgVideo={slide.bgVideo}
        />
      );
    case "closer":
      return <CloserSlide />;
    case "imessage":
      return (
        <IMessageScreen
          contactName={slide.contactName || "Unknown"}
          messages={slide.messages || []}
          payoffImage={slide.payoffImage}
          payoffVideo={slide.payoffVideo}
          payoffAtFrame={slide.payoffAtFrame}
        />
      );
    case "notifications":
      return <NotificationScreen items={slide.items || []} />;
    default:
      return null;
  }
};

const SlideWithTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const TikTokCarouselWithAudio: React.FC<Props> = ({
  slides,
  audioFiles,
  captionFiles,
  sceneDurations,
  bgMusic,
  bgMusicVolume = 0.12,
}) => {
  // Calculate offsets for each scene
  const sceneOffsets: number[] = [];
  let offset = 0;
  for (const dur of sceneDurations) {
    sceneOffsets.push(offset);
    offset += dur;
  }

  // Build caption file list with offsets in ms
  const captionEntries = captionFiles
    .map((file, i) => ({
      file,
      offsetMs: (sceneOffsets[i] / 30) * 1000,
    }))
    .filter((e) => e.file);

  return (
    <AbsoluteFill className="bg-black">
      {/* Visual slides */}
      {slides.map((slide, i) => (
        <Sequence
          key={`slide-${i}`}
          from={sceneOffsets[i]}
          durationInFrames={sceneDurations[i]}
        >
          <SlideWithTransition>
            <SlideRenderer slide={slide} />
          </SlideWithTransition>
        </Sequence>
      ))}

      {/* Audio per scene */}
      {audioFiles.map((file, i) =>
        file ? (
          <Sequence key={`audio-${i}`} from={sceneOffsets[i]}>
            <Audio src={staticFile(file)} />
          </Sequence>
        ) : null
      )}

      {/* Background music */}
      {bgMusic && (
        <Audio src={staticFile(bgMusic)} volume={bgMusicVolume} loop />
      )}

      {/* Caption overlay */}
      <CaptionOverlay captionFiles={captionEntries} />
    </AbsoluteFill>
  );
};
