# Jury Walkthrough

**Live:** https://alinaappleaseeva-sys.github.io/book-reader/

---

## Screens

### 1 — Desktop: three-column layout
*Viewport 1440 × 900*

Left column (80 px): logotype + global nav.
Middle column (300 px): sticky chapter/section TOC, scroll-spy active state in slate-blue.
Right column (820 px): reading content at 680 px max-width — two comfortable sentences per line.

Three columns never collapse into a single soup. The warm `#F5F3EF` paper surface runs edge-to-edge with no card containers, no box shadows on prose, nothing competing with the text.

---

### 2 — Two-pane + sticky gallery deck
*Scrolled to "The Job Graph" section*

When a concept needs a diagram alongside its explanation the page splits: a `2fr / 3fr` grid, image column `position: sticky`, gallery deck with a physical "stack of cards" shadow cue. Eight slides advance on click, arrow keys, or ← → buttons. The image stays in view as the longer text column scrolls past — the same choreography Stripe Press uses for PCA's talk illustrations, without borrowing its vintage palette.

---

### 3 — TOC overlay: full book map + search
*Triggered from "Open table of contents" in the middle column*

A keyboard-dismissible overlay (Escape / click backdrop) renders the complete four-part book structure. The search field does live substring matching across all chapter and section titles, scrolling the result into view on Enter. `aria-live` region announces result counts to screen readers. No modal library — 80 lines of vanilla JS.

---

### 4 — Mobile 375 px
*Single-column, no sidebars*

Both navigation columns collapse. A fixed FAB ("≡ Contents") sits centered at the bottom — thumb-reachable on any phone — and opens the same TOC overlay. Body text stays at 19 px / 1.8 line-height; nothing is squeezed or truncated. The two-pane blocks stack vertically (image → text). The sticky gallery deck reverts to `position: static`.

---

### 5 — Citation → pull-quote: the editorial "rest stop"
*"What is value?" section*

A blockquote from Lisa Feldman Barrett (olive left-border, no background fill) leads into a 32 px italic pull-quote framed by hairline rules top and bottom. This is the one moment per chapter where the reading pace deliberately slows. The TOC scroll-spy updates in real time so the reader always knows where they are.

---

## Design rationale

**Why this answers the brief.** The brief asked for a reading experience that feels like a serious book, not a dashboard. Every decision flows from one constraint: *the page is a single warm surface, and text does all the work*. There are no content cards, no elevated panels, no rounded-corner containers. Typography uses exactly three visual levels — `40 px / 700` chapter title, `24 px / 500` section heading, `19 px / 400` body — because adding a fourth level is never about information hierarchy, it is about decoration. Outfit for headings (confident, neutral, modern), Crimson Pro for body (editorial warmth, high legibility at 19 px), Inter for UI chrome (invisible when it works). The one accent colour (`#252628`, near-black warm) is used exclusively for interactive affordances: links, FAB, chapter-end nav. State feedback (active TOC item, focus ring, search highlight) gets a separate restrained slate-blue so it never competes with prose.

**Why this is different from the competitor.** The known competing entry uses a warm palette and drop-caps — both reasonable editorial choices — but its overall structure is *editorial collage*: floating pull-quote cards with drop shadows, decorative section dividers, a pink accent that reads as brand rather than content. The result feels like a magazine landing page, not a reader. This entry makes the opposite bet: ruthless subtraction. Three strictly proportioned columns give the reader three things and only three — global context (left), chapter position (middle), words (right). The reading column never widens beyond 680 px regardless of viewport, because comfortable line-length matters more than filling the screen. The two-pane layout is structural, not decorative: it appears exactly when a diagram needs to sit alongside its explanation and nowhere else. Linear's typographic discipline and Notion's breathing room without their tool-like chrome — that is the target feeling, and the diff between this entry and the competitor is precisely that distance.
