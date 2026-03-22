import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ─── PALETA ───────────────────────────────────────────
const GREEN  = "#2D6A4F";
const GREEN2 = "#40916C";
const GREEN3 = "#52B788";
const GOLD   = "#C9A84C";
const GOLD2  = "#E8C96A";
const CREAM  = "#F8F5F0";
const DARK   = "#1A1A2E";
const WHITE  = "#FFFFFF";
const MINT   = "#B7E4C7";

// ─── PRODUCTOS ────────────────────────────────────────
const PRODUCTS = [
  { name: "Urinary +",  desc: "Tracto urinario sano",  price: "$390", emoji: "💧", color: "#3A86FF", rating: 4.8, image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69817b346a2e239014eef625/3104a4820_hf_20260205_004620_4d0935aa-7b59-40b0-b84a-35618af5891a.png" },
  { name: "Artro +",    desc: "Articulaciones fuertes", price: "$380", emoji: "🦴", color: "#FF6B6B", rating: 4.9, image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69817b346a2e239014eef625/56a4949ba_hf_20260205_005523_1c182387-9dbc-4381-8e99-a3fdaf178901.png" },
  { name: "Alergy +",   desc: "Reduce picazón",         price: "$410", emoji: "✨", color: "#9B5DE5", rating: 4.7, image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69817b346a2e239014eef625/9aac856e1_hf_20260205_004429_18b723d5-1e62-4d77-a0d9-91bd2a85324c.png" },
  { name: "Mobility +", desc: "Movilidad articular",    price: "$380", emoji: "🏃", color: "#F15BB5", rating: 4.7, image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69817b346a2e239014eef625/1fd5818d5_hf_20260205_005545_fac59ea8-1ae9-428b-9e73-464609c2702f.png" },
];

// ─── HELPERS ──────────────────────────────────────────
const fadeIn = (frame: number, fps: number, start = 0, duration = 0.5) =>
  interpolate(frame, [start * fps, (start + duration) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

const slideUp = (frame: number, fps: number, start = 0, distance = 40) =>
  interpolate(frame, [start * fps, (start + 0.6) * fps], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

const scaleIn = (frame: number, fps: number, start = 0) =>
  spring({ frame: frame - start * fps, fps, config: { damping: 200 } });

// ─── ESCENA 1: INTRO ──────────────────────────────────
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 4 * fps], [1.08, 1], {
    extrapolateRight: "clamp",
  });
  const logoOpacity = fadeIn(frame, fps, 0.3, 0.7);
  const logoY = slideUp(frame, fps, 0.3, 60);
  const tagOpacity = fadeIn(frame, fps, 1.0, 0.6);
  const tagY = slideUp(frame, fps, 1.0, 30);
  const ctaOpacity = fadeIn(frame, fps, 1.8, 0.6);
  const ctaScale = scaleIn(frame, fps, 1.8);

  // Partículas flotantes
  const particles = [
    { x: 80, y: 200, delay: 0, size: 8 },
    { x: 950, y: 350, delay: 10, size: 6 },
    { x: 120, y: 700, delay: 20, size: 10 },
    { x: 900, y: 900, delay: 5, size: 7 },
    { x: 200, y: 1400, delay: 15, size: 9 },
    { x: 850, y: 1600, delay: 8, size: 6 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${GREEN} 0%, ${GREEN2} 50%, ${GREEN3} 100%)`,
        transform: `scale(${bgScale})`,
      }}
    >
      {/* Círculo decorativo grande */}
      <div style={{
        position: "absolute",
        width: 700,
        height: 700,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
        top: -100,
        right: -200,
      }} />
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        bottom: 200,
        left: -150,
      }} />

      {/* Partículas */}
      {particles.map((p, i) => {
        const floatY = interpolate(
          (frame + p.delay * 10) % (fps * 3),
          [0, fps * 1.5, fps * 3],
          [0, -15, 0]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y + floatY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: GOLD2,
              opacity: 0.6,
            }}
          />
        );
      })}

      {/* Contenido central */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 0 }}>

        {/* Paw icon animado */}
        <div style={{
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
          fontSize: 100,
          marginBottom: 24,
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
        }}>
          🐾
        </div>

        {/* Título */}
        <div style={{
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
          textAlign: "center",
          padding: "0 60px",
        }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 72,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.1,
            textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            marginBottom: 16,
          }}>
            Happy &{"\n"}Healthy Pets
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          textAlign: "center",
          padding: "0 80px",
          marginTop: 12,
        }}>
          <div style={{
            fontSize: 34,
            color: GOLD2,
            fontWeight: 600,
            letterSpacing: 1,
          }}>
            Suplementos Premium
          </div>
          <div style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            marginTop: 8,
            fontWeight: 400,
          }}>
            para mascotas que merecen lo mejor
          </div>
        </div>

        {/* Badge CTA */}
        <div style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          marginTop: 48,
          background: GOLD,
          borderRadius: 50,
          padding: "18px 52px",
          boxShadow: "0 8px 32px rgba(201,168,76,0.5)",
        }}>
          <div style={{
            fontSize: 30,
            fontWeight: 800,
            color: WHITE,
            letterSpacing: 0.5,
          }}>
            🌿 100% Natural
          </div>
        </div>

        {/* Stars */}
        <div style={{
          opacity: ctaOpacity,
          marginTop: 32,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}>
          <div style={{ fontSize: 40, color: GOLD2, letterSpacing: 4 }}>★★★★★</div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>4.8 / 5.0</div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── ESCENA 2: PROBLEMA ───────────────────────────────
const SceneProblema: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { icon: "😰", text: "¿Tu mascota se cansa rápido?" },
    { icon: "🦴", text: "¿Tiene problemas en las articulaciones?" },
    { icon: "🤒", text: "¿Alergias o piel irritada?" },
    { icon: "😿", text: "¿Digestión irregular?" },
  ];

  return (
    <AbsoluteFill style={{ background: CREAM }}>
      {/* Header */}
      <div style={{
        padding: "120px 60px 60px",
        opacity: fadeIn(frame, fps, 0, 0.5),
        transform: `translateY(${slideUp(frame, fps, 0, 40)}px)`,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: GREEN2, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
          ¿Lo reconoces?
        </div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 56,
          fontWeight: 900,
          color: DARK,
          lineHeight: 1.2,
        }}>
          Tu mascota merece sentirse bien{" "}
          <span style={{ color: GREEN }}>todos los días</span>
        </div>
      </div>

      {/* Pain points */}
      <div style={{ padding: "0 60px", display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map((item, i) => {
          const delay = 0.4 + i * 0.2;
          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, fps, delay, 0.4),
                transform: `translateX(${interpolate(frame, [delay * fps, (delay + 0.5) * fps], [-60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) })}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                background: WHITE,
                borderRadius: 20,
                padding: "28px 36px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                borderLeft: `6px solid ${GREEN3}`,
              }}
            >
              <div style={{ fontSize: 50 }}>{item.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 600, color: DARK }}>{item.text}</div>
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <div style={{
        position: "absolute",
        bottom: 100,
        left: 0, right: 0,
        textAlign: "center",
        opacity: fadeIn(frame, fps, 1.8, 0.5),
      }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: GREEN }}>
          Tenemos la solución natural 👇
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ESCENA 3: PRODUCTO CARD ──────────────────────────
const ProductCard: React.FC<{
  product: typeof PRODUCTS[0];
  frameOffset: number;
}> = ({ product, frameOffset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - frameOffset;

  const cardScale = spring({ frame: f, fps, config: { damping: 18, stiffness: 180 } });
  const opacity = interpolate(f, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const starsCount = Math.floor(product.rating);
  const stars = "★".repeat(starsCount) + "☆".repeat(5 - starsCount);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${cardScale})`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{
        width: 900,
        background: WHITE,
        borderRadius: 40,
        overflow: "hidden",
        boxShadow: "0 20px 80px rgba(0,0,0,0.18)",
      }}>
        {/* Imagen */}
        <div style={{
          width: "100%",
          height: 540,
          background: `linear-gradient(135deg, ${product.color}22, ${product.color}44)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* eslint-disable-next-line @remotion/warn-native-media-tag */}
          <img
            src={product.image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Badge top */}
          <div style={{
            position: "absolute",
            top: 28,
            left: 28,
            background: GREEN,
            color: WHITE,
            fontSize: 22,
            fontWeight: 800,
            padding: "10px 24px",
            borderRadius: 50,
            letterSpacing: 0.5,
          }}>
            🌿 Natural & Premium
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "48px 60px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: GREEN2, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
            Suplemento {product.emoji}
          </div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 64,
            fontWeight: 900,
            color: DARK,
            marginBottom: 16,
          }}>
            {product.name}
          </div>
          <div style={{ fontSize: 34, color: "#666", marginBottom: 24 }}>
            {product.desc}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ fontSize: 40, color: GOLD, letterSpacing: 4 }}>{stars}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: DARK }}>{product.rating}</div>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ fontSize: 68, fontWeight: 900, color: GREEN }}>
              {product.price}
              <span style={{ fontSize: 28, color: "#999", fontWeight: 400 }}> MXN</span>
            </div>
            <div style={{
              background: GREEN,
              color: WHITE,
              fontSize: 30,
              fontWeight: 800,
              padding: "18px 40px",
              borderRadius: 50,
              boxShadow: `0 8px 24px ${GREEN}66`,
            }}>
              100 Tab
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ESCENA 3: PRODUCTOS ──────────────────────────────
const SceneProductos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = fadeIn(frame, fps, 0, 0.5);
  const headerY = slideUp(frame, fps, 0, 40);

  // Cada producto se muestra 4 segundos = 120 frames
  const DURATION_PER = 120;
  const currentIndex = Math.min(Math.floor(frame / DURATION_PER), PRODUCTS.length - 1);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, #F0FAF4 0%, ${CREAM} 100%)`,
    }}>
      {/* Header */}
      <div style={{
        padding: "80px 60px 0",
        opacity: headerOpacity,
        transform: `translateY(${headerY}px)`,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: GREEN2, letterSpacing: 2, textTransform: "uppercase" }}>
          Nuestros Productos
        </div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 52,
          fontWeight: 900,
          color: DARK,
          marginTop: 8,
        }}>
          Fórmulas que <span style={{ color: GREEN }}>funcionan</span>
        </div>
      </div>

      {/* Producto activo */}
      <div style={{ position: "absolute", top: 220, left: 0, right: 0, bottom: 180 }}>
        {PRODUCTS.map((p, i) => {
          const start = i * DURATION_PER;
          const end = start + DURATION_PER;
          if (frame < start - 10 || frame > end + 10) return null;
          return (
            <ProductCard
              key={p.name}
              product={p}
              frameOffset={start}
            />
          );
        })}
      </div>

      {/* Dots indicator */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 16,
      }}>
        {PRODUCTS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIndex ? 36 : 12,
              height: 12,
              borderRadius: 6,
              background: i === currentIndex ? GREEN : MINT,
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── ESCENA 4: BENEFICIOS ─────────────────────────────
const SceneBeneficios: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const benefits = [
    { icon: "🌿", title: "100% Natural",   desc: "Sin aditivos artificiales" },
    { icon: "🔬", title: "Respaldo Científico", desc: "Fórmulas veterinarias" },
    { icon: "🐾", title: "Perros & Gatos", desc: "Para todas las razas" },
    { icon: "📦", title: "17+ Productos",  desc: "Para cada necesidad" },
    { icon: "⚡", title: "Resultados rápidos", desc: "Notas cambios en semanas" },
    { icon: "💚", title: "Garantía",       desc: "Satisfacción garantizada" },
  ];

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${GREEN} 0%, ${DARK} 100%)`,
    }}>
      {/* Deco */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
        top: -200,
        right: -200,
      }} />

      <div style={{ padding: "100px 60px 60px" }}>
        <div style={{
          opacity: fadeIn(frame, fps, 0, 0.5),
          transform: `translateY(${slideUp(frame, fps, 0, 40)}px)`,
          marginBottom: 60,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: GOLD2, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            ¿Por qué elegirnos?
          </div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 58,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.2,
          }}>
            Lo mejor para tu <span style={{ color: GOLD2 }}>mejor amigo</span>
          </div>
        </div>

        {/* Grid 2x3 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}>
          {benefits.map((b, i) => {
            const delay = 0.4 + i * 0.15;
            return (
              <div
                key={i}
                style={{
                  opacity: fadeIn(frame, fps, delay, 0.4),
                  transform: `scale(${scaleIn(frame, fps, delay)})`,
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 24,
                  padding: "32px 28px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 44 }}>{b.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: WHITE }}>{b.title}</div>
                <div style={{ fontSize: 22, color: "rgba(255,255,255,0.65)" }}>{b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── ESCENA 5: CTA FINAL ──────────────────────────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulseScale = interpolate(
    frame % (fps * 1.5),
    [0, fps * 0.75, fps * 1.5],
    [1, 1.04, 1],
    { easing: Easing.inOut(Easing.sin) }
  );

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${GREEN} 0%, ${GREEN2} 50%, #1a472a 100%)`,
    }}>
      {/* Decos */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 480;
        const x = 540 + Math.cos(angle) * radius;
        const y = 960 + Math.sin(angle) * radius;
        const rotateDeg = interpolate(frame, [0, 30 * fps], [0, 360], { extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            left: x - 4,
            top: y - 4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: GOLD2,
            opacity: 0.4,
            transform: `rotate(${rotateDeg}deg)`,
          }} />
        );
      })}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "0 60px" }}>

        <div style={{
          opacity: fadeIn(frame, fps, 0, 0.6),
          transform: `translateY(${slideUp(frame, fps, 0, 60)}px)`,
          textAlign: "center",
          marginBottom: 40,
        }}>
          <div style={{ fontSize: 100, marginBottom: 16 }}>🐾</div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 66,
            fontWeight: 900,
            color: WHITE,
            lineHeight: 1.2,
            textShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}>
            Dale a tu mascota la mejor vida
          </div>
        </div>

        <div style={{
          opacity: fadeIn(frame, fps, 0.6, 0.5),
          transform: `translateY(${slideUp(frame, fps, 0.6, 30)}px)`,
          textAlign: "center",
          marginBottom: 60,
        }}>
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: 800 }}>
            17 suplementos premium diseñados especialmente para perros y gatos
          </div>
        </div>

        {/* Botón pulsante */}
        <div style={{
          opacity: fadeIn(frame, fps, 1.0, 0.6),
          transform: `scale(${pulseScale * scaleIn(frame, fps, 1.0)})`,
          textAlign: "center",
        }}>
          <div style={{
            background: GOLD,
            borderRadius: 60,
            padding: "28px 80px",
            boxShadow: `0 12px 48px rgba(201,168,76,0.6)`,
            marginBottom: 32,
          }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: WHITE }}>
              🛒 Compra ahora
            </div>
          </div>

          <div style={{
            fontSize: 28,
            color: GOLD2,
            fontWeight: 600,
          }}>
            happyandhealthypets.com.mx
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          opacity: fadeIn(frame, fps, 1.5, 0.5),
          display: "flex",
          gap: 32,
          marginTop: 60,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {["🚚 Envío express", "🌿 100% Natural", "⭐ 4.8/5"].map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.9)",
              fontSize: 26,
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: 50,
            }}>
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── COMPOSICIÓN PRINCIPAL ────────────────────────────
export const HappyPetsPromo: React.FC = () => {
  // Duración total: 750 frames @ 30fps = 25 segundos
  // Escena 1 INTRO:       0   – 150  (5s)
  // Escena 2 PROBLEMA:    150 – 300  (5s)
  // Escena 3 PRODUCTOS:   300 – 570  (9s — 4 productos x ~2.25s)
  // Escena 4 BENEFICIOS:  570 – 690  (4s)
  // Escena 5 CTA:         690 – 750  (4s)

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={150}>
        <SceneIntro />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <SceneProblema />
      </Sequence>
      <Sequence from={300} durationInFrames={270}>
        <SceneProductos />
      </Sequence>
      <Sequence from={570} durationInFrames={120}>
        <SceneBeneficios />
      </Sequence>
      <Sequence from={690} durationInFrames={60}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
