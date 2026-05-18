"""
Analyze dominant colors in the original diagram, then remap them
to the book-reader palette.

Color mapping:
  #FFFFFF (white bg)     → #F5F3EF (--color-paper)
  Bright cyan/blue       → #3A5A7C (muted navy, near --color-accent)
  Bright red             → #A0675B (muted terracotta)
  Pure black #000000     → #2D3A35 (dark graphite-olive)
  Near-whites            → warm off-whites
"""

from PIL import Image
import colorsys

# Load
img = Image.open('images/4_1_original.png').convert('RGBA')
pixels = img.load()
w, h = img.size

# First: analyze top colors
from collections import Counter
color_counts = Counter()
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if a < 128:
            continue
        # Quantize to reduce noise
        rq, gq, bq = (r // 16) * 16, (g // 16) * 16, (b // 16) * 16
        color_counts[(rq, gq, bq)] += 1

print("=== Top 25 quantized colors ===")
for color, count in color_counts.most_common(25):
    pct = count / (w * h) * 100
    print(f"  RGB({color[0]:3d}, {color[1]:3d}, {color[2]:3d})  #{color[0]:02x}{color[1]:02x}{color[2]:02x}  {pct:.1f}%  ({count} px)")
