#!/usr/bin/env python3
"""
Renderiza el pitch video de Avanzza con captions y branding
Usa ffmpeg + PIL para procesar frames
"""

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import subprocess
import os
from pathlib import Path

INPUT_VIDEO = '/app/incoming_files/c95c5847a_video_836950102795231.mp4'
OUTPUT_VIDEO = '/app/avanzza_pitch_final.mp4'
TEMP_DIR = '/tmp/avanzza_render'

# Colores Avanzza
AVANZZA_BLUE = (10, 15, 44)  # BGR
AVANZZA_ACCENT = (247, 142, 79)  # BGR (blue 4F8EF7)
AVANZZA_GOLD = (66, 200, 245)  # BGR (gold F5C842)
WHITE = (255, 255, 255)

CAPTIONS = [
    (0, 80, "¿Qué pasaría si tu negocio tuviera", None, 'impact'),
    (80, 160, "contenido todos los días sin que tú grabaras?", None, 'impact'),
    (160, 240, "Te voy a mostrar cómo.", None, 'normal'),
    (240, 350, "Imagínate tener a alguien presentando", None, 'normal'),
    (350, 480, "tus productos en tu floristería", None, 'normal'),
    (480, 600, "sin contratar a nadie.", "sin contratar", 'normal'),
    (600, 720, "Con IA puedes poner tu marca donde quieras.", "Con IA", 'impact'),
    (720, 850, "Una suite de lujo, un café en París,", None, 'normal'),
    (850, 950, "donde tú decidas sin viajar.", "sin viajar", 'impact'),
    (950, 1100, "Este café en París no existe.", None, 'impact'),
    (1100, 1250, "Lo creó la IA. Así de fácil.", "Lo creó la IA", 'impact'),
    (1250, 1380, "¿Y si tu producto apareciera así?", None, 'impact'),
    (1380, 1520, "Con IA generativa cualquier marca", "cualquier marca", 'normal'),
    (1520, 1650, "tiene contenido de nivel mundial", None, 'impact'),
    (1650, 1780, "sin salir de tu ciudad.", "sin salir de tu ciudad", 'impact'),
    (1780, 1920, "Tu restaurante puede tener contenido así", None, 'normal'),
    (1920, 2050, "en una cava medieval, con quesos", None, 'normal'),
    (2050, 2180, "artesanales y vino reserva.", None, 'normal'),
    (2180, 2320, "Sin salir de México.", "Sin salir de México", 'impact'),
    (2320, 2450, "8 escenarios. 1 avatar. Cero cámaras.", "Cero cámaras", 'impact'),
    (2450, 2580, "Así funciona la IA para tu negocio.", None, 'normal'),
    (2580, 2700, "Tu marca ya está usando esto.", "Tu marca", 'impact'),
    (2700, 2862, "Porque tu competencia ya lo está pensando.", "tu competencia", 'impact'),
]

def setup():
    """Prepara directorio temporal"""
    os.makedirs(TEMP_DIR, exist_ok=True)
    print(f"✓ Directorio: {TEMP_DIR}")

def draw_caption(frame_bgr, text, highlight_text, caption_type, progress_alpha):
    """Dibuja caption en el frame"""
    h, w = frame_bgr.shape[:2]
    pil_image = Image.fromarray(cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_image)
    
    # Gradiente de opacidad
    alpha = int(255 * progress_alpha)
    
    # Fondo oscuro abajo
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    gradient_height = 200
    
    for y in range(h - gradient_height, h):
        alpha_grad = int(180 * (y - (h - gradient_height)) / gradient_height)
        overlay_draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha_grad))
    
    pil_image = Image.alpha_composite(pil_image.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(pil_image)
    
    # Intenta cargar fuente, fallback a la default
    try:
        font_size = 36 if caption_type == 'impact' else 28
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Dibuja texto
    y_pos = h - 120
    
    if highlight_text and highlight_text in text:
        parts = text.split(highlight_text)
        x_pos = 30
        draw.text((x_pos, y_pos), parts[0], fill=(255, 255, 255, alpha), font=font)
        
        # Texto destacado en dorado
        bbox = draw.textbbox((x_pos, y_pos), parts[0], font=font)
        x_pos = bbox[2] + 2
        draw.text((x_pos, y_pos), highlight_text, fill=(66, 200, 245, alpha), font=font)
        
        bbox = draw.textbbox((x_pos, y_pos), highlight_text, font=font)
        x_pos = bbox[2] + 2
        draw.text((x_pos, y_pos), parts[1] if len(parts) > 1 else "", fill=(255, 255, 255, alpha), font=font)
    else:
        draw.text((30, y_pos), text, fill=(255, 255, 255, alpha), font=font)
    
    # Watermark Avanzza
    try:
        wm_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
    except:
        wm_font = ImageFont.load_default()
    
    draw.text((w - 100, 20), "AVANZZA", fill=(255, 255, 255, 100), font=wm_font)
    
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

def render_with_captions():
    """Renderiza el video original + captions + branding"""
    print("\n📹 Abriendo video original...")
    cap = cv2.VideoCapture(INPUT_VIDEO)
    
    if not cap.isOpened():
        print(f"❌ No se pudo abrir: {INPUT_VIDEO}")
        return False
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"  FPS: {fps}")
    print(f"  Frames: {frame_count}")
    print(f"  Resolución: {w}x{h}")
    
    # FFmpeg writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(OUTPUT_VIDEO, fourcc, fps, (w, h))
    
    frame_idx = 0
    print(f"\n🎬 Renderizando {frame_count} frames...")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Busca caption activo
        active_caption = None
        for start, end, text, highlight, cap_type in CAPTIONS:
            if frame_idx >= start and frame_idx < end:
                progress = (frame_idx - start) / (end - start)
                # Fade in primeros 8 frames
                progress_alpha = min(progress, 1.0) if frame_idx < start + 8 else min(1.0 - (frame_idx - (end - 8)) / 8, 1.0) if frame_idx > end - 8 else 1.0
                active_caption = (text, highlight, cap_type, progress_alpha)
                break
        
        # Dibuja caption
        if active_caption:
            text, highlight, cap_type, alpha = active_caption
            frame = draw_caption(frame, text, highlight, cap_type, alpha)
        
        out.write(frame)
        
        if frame_idx % 300 == 0:
            percent = (frame_idx / frame_count) * 100
            print(f"  {frame_idx}/{frame_count} ({percent:.0f}%)")
        
        frame_idx += 1
    
    cap.release()
    out.release()
    
    print(f"\n✅ Video renderizado: {OUTPUT_VIDEO}")
    return True

if __name__ == '__main__':
    setup()
    
    if render_with_captions():
        # Verifica output
        if os.path.exists(OUTPUT_VIDEO):
            size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
            print(f"\n📊 Archivo final: {size_mb:.1f} MB")
            print("🎉 ¡Renderizado exitoso!")
        else:
            print("❌ El archivo no se creó")
    else:
        print("❌ Error en renderizado")
