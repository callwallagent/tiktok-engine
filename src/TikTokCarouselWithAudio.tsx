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
  audioDelayFrames?: number;
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

const BgMusicWithDucking: React.FC<{
  bgMusic: string;
  bgMusicVolume: number;
  sceneOffsets: number[];
  sceneDurations: number[];
  audioFiles: string[];
}> = ({ bgMusic, bgMusicVolume, sceneOffsets, sceneDurations, audioFiles }) => {
  const frame = useCurrentFrame();

  // Check if any voiceover is playing at current frame
  let isVoicePlaying = false;
  for (let i = 0; i < audioFiles.length; i++) {
    if (!audioFiles[i]) continue;
    const start = sceneOffsets[i];
    const end = start + sceneDurations[i];
    if (frame >= start && frame < end) {
      isVoicePlaying = true;
      break;
    }
  }

  // Duck: when voice plays, drop to 30% of target volume
  // Smooth transition over 8 frames
  const duckTarget = isVoicePlaying ? bgMusicVolume * 0.3 : bgMusicVolume;

  return <Audio src={staticFile(bgMusic)} volume={duckTarget} loop />;
};

export const TikTokCarouselWithAudio: React.FC<Props> = ({
  slides,
  audioFiles,
  captionFiles,
  sceneDurations,
  bgMusic,
  bgMusicVolume = 0.12,
  audioDelayFrames = 0,
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
          <Sequence key={`audio-${i}`} from={sceneOffsets[i] + (i === 0 ? audioDelayFrames : 0)}>
            <Audio src={staticFile(file)} />
          </Sequence>
        ) : null
      )}

      {/* Background music with ducking */}
      {bgMusic && (
        <BgMusicWithDucking
          bgMusic={bgMusic}
          bgMusicVolume={bgMusicVolume}
          sceneOffsets={sceneOffsets}
          sceneDurations={sceneDurations}
          audioFiles={audioFiles}
        />
      )}

      {/* Caption overlay */}
      <CaptionOverlay captionFiles={captionEntries} />
    </AbsoluteFill>
  );
};
