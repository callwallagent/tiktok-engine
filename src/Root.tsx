import "./index.css";
import { Composition } from "remotion";
import { TikTokCarouselWithAudio } from "./TikTokCarouselWithAudio";
import {
  salonData11Labs,
  salon11LabsAudio,
  salon11LabsCaptions,
  salon11LabsDurations,
} from "./data/salon-11labs";

const totalFrames = salon11LabsDurations.reduce((a, b) => a + b, 0);

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
    </>
  );
};
