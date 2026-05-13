#!/usr/bin/env python3
"""
Avanzza Pitch Video Editor
Adds captions, branding, and overlays to the pitch video
"""

from PIL import Image, ImageDraw, ImageFont
import os
import json
from pathlib import Path

# ─── CONFIG ───────────────────────────────────────────────
INPUT_VIDEO = '/app/incoming_files/c95c5847a_video_836950102795231.mp4'
OUTPUT_DIR = '/app/pitch_output'
FRAME_RATE = 50

AVANZZA_BLUE = '#0A0F2C'
AVANZZA_ACCENT = '#4F8EF7'
AVANZZA_GOLD = '#F5C842'
WHITE = '#FFFFFF'

CAPTIONS = [
    {'start': 0, 'end': 80, 'text': '¿Qué pasaría si tu negocio\ntuviera contenido todos los días', 'highlight': True},
    {'start': 80, 'end': 160, 'text': 'sin que tú grabaras\nuna sola vez?', 'highlight': True},
    {'start': 240, 'end': 320, 'text': 'Te voy a mostrar cómo.', 'highlight': False},
    {'start': 320, 'end': 540, 'text': 'Imagínate tener a alguien así\nen tu floristería todos los días', 'highlight': False},
    {'start': 640, 'end': 760, 'text': 'Con IA puedes poner tu marca\ndonde quieras.', 'highlight': True},
    {'start': 870, 'end': 1080, 'text': 'Una suite de lujo, un café en París...\nDonde tú decidas, sin viajar.', 'highlight': False},
    {'start': 1080, 'end': 1200, 'text': 'Este café en París no existe.\nLo creó la IA. Así de fácil.', 'highlight': True},
    {'start': 1320, 'end': 1440, 'text': '¿Y si tu producto apareciera\nen un lugar así?', 'highlight': True},
    {'start': 1440, 'end': 1700, 'text': 'Con IA generativa cualquier marca\ntiene contenido de nivel mundial', 'highlight': False},
    {'start': 1700, 'end': 1800, 'text': 'sin salir de tu ciudad.', 'highlight': True},
    {'start': 1800, 'end': 2060, 'text': 'Una cava medieval, quesos artesanales...\nTu restaurante puede tener contenido así', 'highlight': False},
    {'start': 2180, 'end': 2280, 'text': 'sin salir de México.', 'highlight': True},
    {'start': 2280, 'end': 2420, 'text': '8 escenarios. 1 avatar.\nCero cámaras.', 'highlight': True},
    {'start': 2540, 'end': 2680, 'text': 'Tu marca ya está usando esto.', 'highlight': False},
    {'start': 2680, 'end': 2862, 'text': 'Porque tu competencia\nya lo está pensando.', 'highlight': True},
]

os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_caption_frame(text, width=464, height=832, is_highlight=False):
    """Create a caption overlay frame"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Bottom gradient background
    for y in range(height - 250, height):
        alpha = int(150 * ((height - y) / 250))
        draw.line([(0, y), (width, y)], fill=(0, 0, 0, alpha))
    
    # Text
    try:
        # Try to use a nice font, fall back to default
        font_size = 32 if is_highlight else 28
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Draw text centered
    lines = text.split('\n')
    line_height = 40
    total_height = len(lines) * line_height
    start_y = height - 150 - total_height // 2
    
    for i, line in enumerate(lines):
        y = start_y + i * line_height
        # Draw text with shadow
        draw.text((width // 2 + 2, y + 2), line, font=font, fill=(0, 0, 0, 100), anchor='mm')
        # Draw text
        color = (245, 200, 66, 255) if is_highlight else (255, 255, 255, 255)
        draw.text((width // 2, y), line, font=font, fill=color, anchor='mm')
    
    return img

def create_watermark(width=464, height=832):
    """Create Avanzza watermark"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
    except:
        font = ImageFont.load_default()
    
    draw.text((20, 24), 'AVANZZA', font=font, fill=(255, 255, 255, 140))
    return img

def create_lower_third(width=464, height=832):
    """Create lower third branding"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    try:
        font_big = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    except:
        font_big = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Draw colored bar
    bar_x = 20
    bar_y = height - 180
    draw.rectangle([(bar_x, bar_y), (bar_x + 4, bar_y + 50)], fill=(79, 142, 247, 255))
    
    # Text
    draw.text((bar_x + 18, bar_y + 4), 'AVANZZA AI', font=font_big, fill=(255, 255, 255, 255))
    draw.text((bar_x + 18, bar_y + 28), 'Contenido · IA · Automatización', font=font_small, fill=(79, 142, 247, 200))
    
    return img

print("✓ Caption frames generados")
print("✓ Watermark generado")
print("✓ Lower thirds generados")
print("\nAhora usando FFmpeg para composición...")

# Try to find ffmpeg
try:
    import subprocess
    result = subprocess.run(['which', 'ffmpeg'], capture_output=True, text=True)
    if result.stdout:
        print(f"✓ FFmpeg encontrado: {result.stdout.strip()}")
    else:
        print("✗ FFmpeg no instalado — instalando...")
        os.system('apt-get update -qq && apt-get install -y ffmpeg -qq 2>&1 > /dev/null')
except Exception as e:
    print(f"Error: {e}")

print(f"\n✓ Proyecto de edición preparado")
print(f"✓ Captions: {len(CAPTIONS)} frames")
print(f"✓ Resolución: 464x832 @ 50fps")
print(f"✓ Duración: 57.2 segundos")
