import { Config } from '@remotion/cli/config';

Config.setCodec('h264');
Config.setFrameRange([0, 3132]);
Config.setOutputLocation('out/avanzza_pitch_final.mp4');
Config.setCrf(18);
