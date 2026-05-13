import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  staticFile,
  Text,
} from 'remotion';

export const PitchVideo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro: 0-120 frames
  const introOpacity = interpolate(frame, [0, 20], [1, 1], { extrapolateRight: 'clamp' });
  const introExit = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp' });

  if (frame < 120) {
    return (
      <AbsoluteFill style={{
        background: 'linear-gradient(160deg, #0A0F2C 0%, #0d1a4a 60%, #0a2060 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: introOpacity * introExit,
      }}>
        <Text style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: 'white',
          letterSpacing: 8,
        }}>
          AVANZZA
        </Text>
      </AbsoluteFill>
    );
  }

  // Video + captions: 120-2982
  if (frame >= 120 && frame < 2982) {
    const videoFrame = frame - 120;
    return (
      <AbsoluteFill>
        <Video src={staticFile('pitch.mp4')} style={{ width: '100%', height: '100%' }} />
        <AbsoluteFill style={{ background: 'rgba(0,0,0,0.2)' }} />
        <div style={{
          position: 'absolute',
          bottom: 100,
          left: 20,
          right: 20,
          color: 'white',
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}>
          {videoFrame < 200 && '¿Qué pasaría si tu negocio tuviera contenido todos los días?'}
          {videoFrame >= 200 && videoFrame < 400 && 'Sin que tú grabaras una sola vez'}
          {videoFrame >= 400 && videoFrame < 600 && 'Con IA puedes poner tu marca donde quieras'}
        </div>
      </AbsoluteFill>
    );
  }

  // Outro: 2982-3132
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(160deg, #0A0F2C 0%, #0d1a4a 60%, #0a2060 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <Text style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 20 }}>AVANZZA</Text>
        <Text style={{ fontSize: 20, marginTop: 20 }}>avanzza.ai</Text>
      </div>
    </AbsoluteFill>
  );
};
