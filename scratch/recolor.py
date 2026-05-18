"""
Recolor diagram 4_1.png to match book-reader palette.

Mapping:
  Near-white bg (#e8e8e8 to #ffffff) → warm paper #F5F3EF
  Dark blues (#003060-#005080)       → muted deep navy #2A3F5F (--color-accent)
  Medium blues (#3060a0-#5090c0)     → softer navy #6B8AAF
  Near-blacks (#000000-#102030)      → warm graphite #2D3A35
  Grays (#707070-#b0b0b0)           → warm grays with slight olive tint
"""

from PIL import Image
import math

img = Image.open('images/4_1_original.png').convert('RGBA')
pixels = img.load()
w, h = img.size
out = img.copy()
out_px = out.load()

def dist(c1, c2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))

def lerp_color(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

# Paper color
PAPER = (245, 243, 239)  # #F5F3EF

# Target palette
DEEP_NAVY = (42, 63, 95)       # --color-accent #2A3F5F
SOFT_NAVY = (107, 138, 175)    # lighter navy for mid-blues
WARM_GRAPHITE = (45, 58, 53)   # #2D3A35 - dark olive-graphite
WARM_GRAY_DARK = (107, 103, 96)  # warm dark gray
WARM_GRAY_MID = (156, 152, 145)  # warm mid gray
WARM_GRAY_LIGHT = (195, 191, 184) # warm light gray

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a < 10:
            out_px[x, y] = (r, g, b, a)
            continue

        # --- BACKGROUND: near-whites → warm paper ---
        if r > 210 and g > 210 and b > 210:
            # Blend toward paper based on how white it is
            whiteness = min(r, g, b) / 255.0
            t = max(0, (whiteness - 0.82)) / 0.18  # 0 at gray, 1 at pure white
            new_color = lerp_color((r, g, b), PAPER, t * 0.9)
            out_px[x, y] = (*new_color, a)
            continue

        # --- NEAR-BLACK: → warm graphite ---
        brightness = (r + g + b) / 3
        if brightness < 40:
            # Check if it's blue-black or neutral black
            blue_dominance = b - max(r, g)
            if blue_dominance > 10:
                # Blue-black → deep navy
                t = min(1.0, (40 - brightness) / 40)
                new_color = lerp_color(DEEP_NAVY, WARM_GRAPHITE, 1 - t)
            else:
                # Neutral black → warm graphite
                t = min(1.0, (40 - brightness) / 40)
                new_color = lerp_color(WARM_GRAY_DARK, WARM_GRAPHITE, t)
            out_px[x, y] = (*new_color, a)
            continue

        # --- DARK BLUE (#003060 - #005080) → deep navy ---
        if b > 50 and b > r * 2 and b > g * 1.3 and brightness < 90:
            saturation = (max(r, g, b) - min(r, g, b)) / max(1, max(r, g, b))
            if saturation > 0.3:
                # Map to deep navy, preserving relative brightness
                t = min(1.0, brightness / 90)
                new_color = lerp_color(DEEP_NAVY, SOFT_NAVY, t)
                out_px[x, y] = (*new_color, a)
                continue

        # --- MEDIUM BLUE (#3060a0 - #6090d0) → soft navy ---
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
                # Neutral gray → warm gray
                t = (brightness - 40) / 170  # 0=dark, 1=light
                if t < 0.33:
                    new_color = lerp_color(WARM_GRAPHITE, WARM_GRAY_DARK, t / 0.33)
                elif t < 0.66:
                    new_color = lerp_color(WARM_GRAY_DARK, WARM_GRAY_MID, (t - 0.33) / 0.33)
                else:
                    new_color = lerp_color(WARM_GRAY_MID, WARM_GRAY_LIGHT, (t - 0.66) / 0.34)
                out_px[x, y] = (*new_color, a)
                continue

        # --- FALLBACK: slightly warm-shift ---
        # Reduce blue channel slightly, add warmth
        new_r = min(255, r + 3)
        new_g = g
        new_b = max(0, b - 5)
        out_px[x, y] = (new_r, new_g, new_b, a)

out.save('images/4_1_recolored.png', optimize=True)
print(f"Done: images/4_1_recolored.png ({w}x{h})")
