import { Composition } from "remotion";
import { HappyPetsPromo } from "./HappyPetsPromo";

// 30fps · ~25 segundos = 750 frames
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HappyPetsPromo"
        component={HappyPetsPromo}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
