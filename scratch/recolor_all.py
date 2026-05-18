"""
Recolor all 13 diagram images to match book-reader palette.

Image background: #F9F7F3 (slightly lighter than page --color-paper #F5F3EF)
Blues → muted deep navy
Blacks → warm graphite-olive
Grays → warm olive-tinted grays
"""

from PIL import Image
import math, os, sys

# Target palette
PAPER = (249, 247, 243)           # #F9F7F3 — slightly lighter than page bg
DEEP_NAVY = (42, 63, 95)         # --color-accent #2A3F5F
SOFT_NAVY = (107, 138, 175)      # lighter navy for mid-blues
WARM_GRAPHITE = (45, 58, 53)     # #2D3A35
WARM_GRAY_DARK = (107, 103, 96)
WARM_GRAY_MID = (156, 152, 145)
WARM_GRAY_LIGHT = (195, 191, 184)
TERRACOTTA = (160, 103, 91)      # #A0675B — for reds if any

def lerp_color(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

def recolor(src, dst):
    img = Image.open(src).convert('RGBA')
    pixels = img.load()
    w, h = img.size
    out = img.copy()
    out_px = out.load()

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 10:
                out_px[x, y] = (r, g, b, a)
                continue

            brightness = (r + g + b) / 3

            # --- BACKGROUND: near-whites → warm paper ---
            if r > 210 and g > 210 and b > 210:
                whiteness = min(r, g, b) / 255.0
                t = max(0, (whiteness - 0.82)) / 0.18
                new_color = lerp_color((r, g, b), PAPER, t * 0.9)
                out_px[x, y] = (*new_color, a)
                continue

            # --- RED/WARM tones → terracotta ---
            if r > 120 and r > g * 1.5 and r > b * 1.5 and brightness < 180:
                saturation = (max(r, g, b) - min(r, g, b)) / max(1, max(r, g, b))
                if saturation > 0.3:
                    t = min(1.0, brightness / 180)
                    new_color = lerp_color(TERRACOTTA,
                                           lerp_color(TERRACOTTA, WARM_GRAY_LIGHT, 0.4), t)
                    out_px[x, y] = (*new_color, a)
                    continue

            # --- NEAR-BLACK → warm graphite ---
            if brightness < 40:
                blue_dominance = b - max(r, g)
                if blue_dominance > 10:
                    t = min(1.0, (40 - brightness) / 40)
                    new_color = lerp_color(DEEP_NAVY, WARM_GRAPHITE, 1 - t)
                else:
                    t = min(1.0, (40 - brightness) / 40)
                    new_color = lerp_color(WARM_GRAY_DARK, WARM_GRAPHITE, t)
                out_px[x, y] = (*new_color, a)
                continue

            # --- DARK BLUE → deep navy ---
            if b > 50 and b > r * 2 and b > g * 1.3 and brightness < 90:
                saturation = (max(r, g, b) - min(r, g, b)) / max(1, max(r, g, b))
                if saturation > 0.3:
                    t = min(1.0, brightness / 90)
                    new_color = lerp_color(DEEP_NAVY, SOFT_NAVY, t)
                    out_px[x, y] = (*new_color, a)
                    continue

            # --- MEDIUM BLUE → soft navy ---
            if b > 80 and b > r * 1.3 and brightness >= 90 and brightness < 170:
                saturation = (max(r, g, b) - min(r, g, b)) / max(1, max(r, g, b))
                if saturation > 0.2:
                    t = min(1.0, (brightness - 90) / 80)
                    new_color = lerp_color(SOFT_NAVY, WARM_GRAY_LIGHT, t)
                    out_px[x, y] = (*new_color, a)
                    continue

            # --- GRAYS: add warm olive tint ---
            if brightness >= 40 and brightness <= 210:
                saturation = (max(r, g, b) - min(r, g, b)) / max(1, max(r, g, b))
                if saturation < 0.15:
                    t = (brightness - 40) / 170
                    if t < 0.33:
                        new_color = lerp_color(WARM_GRAPHITE, WARM_GRAY_DARK, t / 0.33)
                    elif t < 0.66:
                        new_color = lerp_color(WARM_GRAY_DARK, WARM_GRAY_MID, (t - 0.33) / 0.33)
                    else:
                        new_color = lerp_color(WARM_GRAY_MID, WARM_GRAY_LIGHT, (t - 0.66) / 0.34)
                    out_px[x, y] = (*new_color, a)
                    continue

            # --- FALLBACK: slightly warm-shift ---
            new_r = min(255, r + 3)
            new_b = max(0, b - 5)
            out_px[x, y] = (new_r, g, new_b, a)

    out.save(dst, optimize=True)
    print(f"  ✓ {os.path.basename(dst)}")

# All images to process
BASE_URL = "https://zamesin.ru/producthowto/book/content/images/2025/01/"
images = [
    "4_1", "4_2", "4_3", "4_4", "4_5", "4_6", "4_7", "4_8",
    "5_1", "5_2", "5_3", "5_4", "5_5"
]

img_dir = "images"
os.makedirs(img_dir, exist_ok=True)

# All already downloaded via curl

print(f"\nRecoloring {len(images)} images (bg → #F9F7F3)...\n")
for name in images:
    src = os.path.join(img_dir, f"{name}_original.png")
    dst = os.path.join(img_dir, f"{name}.png")
    recolor(src, dst)

print(f"\nDone! {len(images)} images saved to {img_dir}/")
