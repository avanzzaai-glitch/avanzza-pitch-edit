"""
Build the Avanzza pitch video with captions, intro, outro using moviepy
"""
import subprocess
import sys

# Intentar instalar moviepy
result = subprocess.run([sys.executable, '-m', 'pip', 'install', 'moviepy', '-q'], capture_output=True)
print("MoviePy setup...")

try:
    from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, ColorClip, CompositeAudioClip
    from moviepy.video.io.ffmpeg_tools import resize_video
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    # Rutas
    INPUT_VIDEO = '/app/incoming_files/c95c5847a_video_836950102795231.mp4'
    OUTPUT_VIDEO = '/app/avanzza_pitch_final.mp4'
    TEMP_DIR = '/tmp/avanzza_pitch_frames'
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    print("✅ Dependencias listas")
    print("📹 Cargando video original...")
    
    # Cargar el video original
    video = VideoFileClip(INPUT_VIDEO)
    w, h = video.size
    fps = video.fps
    duration = video.duration
    
    print(f"   Resolución: {w}x{h} @ {fps}fps, Duración: {duration:.1f}s")
    
    # Datos de captions
    captions_data = [
        (0, 1.6, "¿Qué pasaría si tu negocio tuviera", "normal"),
        (1.6, 3.2, "contenido todos los días", "bold"),
        (3.2, 4.8, "sin que tú grabaras una sola vez?", "question"),
        (4.8, 6.4, "Te voy a mostrar cómo.", "impact"),
        (6.4, 8.6, "Imagínate tener a alguien así", "normal"),
        (8.6, 10.8, "en tu floristería todos los días", "normal"),
        (10.8, 12.8, "presentando tus arreglos", "normal"),
        (12.8, 15.2, "Con IA puedes poner tu marca donde quieras", "impact"),
        (15.2, 17.4, "Una suite de lujo, un café en París", "normal"),
        (17.4, 19.6, "donde tú decidas — sin viajar", "bold"),
        (19.6, 24, "Este café en París no existe", "impact"),
        (24, 28, "Lo creó la IA. Así de fácil.", "impact"),
        (28, 30, "¿Y si tu producto apareciera en un lugar así?", "question"),
        (30, 32, "Con IA generativa cualquier marca", "normal"),
        (32, 34, "tiene contenido de nivel mundial", "impact"),
        (34, 36, "sin salir de tu ciudad", "bold"),
        (36, 38, "Una cava medieval, quesos artesanales", "normal"),
        (38, 40, "vino reserva — tu restaurante", "normal"),
        (40, 42, "puede tener contenido así", "normal"),
        (42, 44, "sin salir de México", "impact"),
        (44, 46, "8 escenarios. 1 avatar.", "impact"),
        (46, 48, "Cero cámaras. Así funciona la IA.", "impact"),
        (48, 51, "Tu marca ya está usando esto", "impact"),
        (51, 57.2, "Porque tu competencia ya lo está pensando", "question"),
    ]
    
    print(f"📝 Agregando {len(captions_data)} captions...")
    
    # Colors
    BLUE = '#0A0F2C'
    ACCENT = '#4F8EF7'
    GOLD = '#F5C842'
    WHITE = '#FFFFFF'
    
    # Crear clips de captions
    text_clips = []
    for start, end, text, style in captions_data:
        fontsize = 32 if style == 'impact' else 24
        fontweight = 'bold' if style in ('impact', 'bold') else 'normal'
        
        txt_clip = TextClip(
            text,
            fontsize=fontsize,
            font='Arial',
            color=WHITE,
            method='caption',
            size=(w-40, None),
            align='center',
            stroke_color='black',
            stroke_width=2,
        )
        txt_clip = txt_clip.set_position(('center', h*0.65)).set_duration(end-start).set_start(start)
        text_clips.append(txt_clip)
    
    # Compositar video + captions
    final_video = CompositeVideoClip([video] + text_clips)
    
    print(f"🎬 Renderizando a {OUTPUT_VIDEO}...")
    final_video.write_videofile(
        OUTPUT_VIDEO,
        codec='libx264',
        audio_codec='aac',
        fps=fps,
        verbose=False,
        logger=None,
    )
    
    print(f"✅ Video completado: {OUTPUT_VIDEO}")
    print(f"   Tamaño: {os.path.getsize(OUTPUT_VIDEO) / 1024 / 1024:.1f} MB")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
