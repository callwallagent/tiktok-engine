import "./index.css";
import { Composition } from "remotion";
import { TikTokCarouselWithAudio } from "./TikTokCarouselWithAudio";
import {
  salonData11Labs,
  salon11LabsAudio,
  salon11LabsCaptions,
  salon11LabsDurations,
} from "./data/salon-11labs";
import {
  vcData11Labs,
  vc11LabsAudio,
  vc11LabsCaptions,
  vc11LabsDurations,
} from "./data/vc-11labs";

const totalFrames = salon11LabsDurations.reduce((a, b) => a + b, 0);
const vcTotalFrames = vc11LabsDurations.reduce((a, b) => a + b, 0);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Salon11Labs"
        component={TikTokCarouselWithAudio}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          slides: salonData11Labs,
          audioFiles: salon11LabsAudio,
          captionFiles: salon11LabsCaptions,
          sceneDurations: salon11LabsDurations,
          bgMusic: "bg-music.mp3",
          bgMusicVolume: 0.12,
        }}
      />
      <Composition
        id="VC11Labs"
        component={TikTokCarouselWithAudio}
        durationInFrames={vcTotalFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          slides: vcData11Labs,
          audioFiles: vc11LabsAudio,
          captionFiles: vc11LabsCaptions,
          sceneDurations: vc11LabsDurations,
          bgMusic: "bg-music-vc-inst-trimmed.mp3",
          bgMusicVolume: 0.55,
          audioDelayFrames: 30,
        }}
      />
    </>
  );
};
