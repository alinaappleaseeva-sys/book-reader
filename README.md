# Book Reader UI

A web-based reading experience for non-fiction books. Built as an entry for a design competition — the goal is to create an interface where reading feels like **opening a beautiful book, not another SaaS tab**.

## What This Is

A static site for reading non-fiction books chapter by chapter. V1 scope:

- **Chapter reading page** — three-column layout (nav · table of contents · chapter text)
- **Table of contents overlay** — full book navigation with search
- **Global search** — client-side, across all chapters
- **Mobile version** — responsive, works on phones

No auth, no paywall, no dark theme, no comments. Just reading.

## Design Direction

The client's brief calls for a hybrid of three things:

| Source | What we take | What we don't take |
|--------|-------------|-------------------|
| **[Poor Charlie's Almanack](https://stripe.press/poor-charlies-almanack)** (Stripe Press) | Layout choreography: page splits into two-pane for illustrations, pull-quotes as architectural elements, rhythm of reading | Vintage visual style, sepia colors, old-fashioned serif |
| **[Linear](https://linear.app/)** / **[Notion](https://notion.so/)** | Typographic discipline, restrained palette, millimeter-precise spacing, clean minimalism | Dark theme, dashboard patterns, "tool" feeling |
| **The book itself** | Warm off-white background ("paper, not screen"), generous whitespace, serif for body text, a sense of respect for the reader | Substack/Medium blandness, academic dryness |

**Brand character:** *"Quiet power of a mature professional — serious, rational, authoritative, but without snobbery or academic dryness."*

## Tech Stack

- **HTML / CSS / JavaScript** — vanilla, no framework (the brief explicitly asks for "vibe-coded" HTML/CSS/JS)
- **Fonts** — free only (Google Fonts / Fontshare / OFL-licensed)
- **No build step required** for basic development — open `index.html` in browser
- **Optional:** local dev server for live reload

## Project Structure

```
book-reader/
├── index.html              # Chapter reading page (main entry point)
├── css/
│   ├── tokens.css          # Design tokens: colors, typography, spacing
│   ├── base.css            # Reset, body, global styles
│   ├── layout.css          # Three-column grid, responsive breakpoints
│   ├── typography.css      # Headings, body, lists, links
│   ├── components.css      # Blockquotes, skeptic, pull-quotes, galleries
│   └── overlay.css         # TOC overlay, search modal
├── js/
│   ├── toc.js              # Table of contents overlay logic
│   ├── search.js           # Client-side search (Lunr/FlexSearch)
│   └── nav.js              # Scroll-spy, active section highlighting
├── assets/
│   └── images/             # Demo chapter images
├── content/
│   └── demo-chapter.html   # Rendered demo chapter with all block types
└── README.md
```

## Getting Started

```bash
# Clone
git clone <repo-url>
cd book-reader

# Option 1: Just open in browser
open index.html

# Option 2: Local dev server (any of these work)
npx serve .
# or
python3 -m http.server 8000
# or
php -S localhost:8000
```

## Content Blocks

The demo chapter includes all required block types from the design brief (§7.4):

- **Headings** — h2, h3, h4 within chapter
- **Body paragraphs** — main reading mode
- **Bulleted and numbered lists**
- **Blockquotes** — standard citations
- **Skeptic voice** — recurring character who challenges claims (`> Skeptic: ...`), must be visually distinct
- **Scholar citations** — with source attribution
- **Inline code** — for methodology templates like `I want to {verb}`
- **Images with captions** — single images
- **Image galleries** — two or more images in a row
- **Pull-quotes** — large italic serif text that breaks the prose flow
- **Two-pane layout** — image left / text right (experimental, PCA-inspired)
- **Footnotes**

## Key Design Decisions

Documenting _why_ things are the way they are:

1. **No island/card pattern** — the client explicitly rejected the "floating white rectangle on gray" approach from the previous design (AURA Book). The page is one continuous warm surface.

2. **Serif for body, sans for UI** — body text uses a reading-optimized serif (not EB Garamond — it's beautiful but hard on eyes for long reading). UI elements (nav, TOC, meta) use a clean sans-serif.

3. **Warm off-white, not white** — `#F5F3EF`-ish range. The brain reads pure white as "screen/app" and off-white as "paper/book".

4. **One accent color, restrained** — no pink, no bright colors. Something that says "quiet power": deep navy, olive, or muted terracotta.

5. **Three columns on desktop** — left nav (80px) + TOC/context (280-320px) + chapter text (700-800px). The left column exists in v1 for compositional integrity even though its links don't work yet.

6. **Dynamic two-pane** — when an illustration needs to "talk" to text, the layout splits. When it doesn't, it merges back. This is the PCA choreography we're borrowing.

7. **No visual noise** — no gradients, no 3D, no scroll-jacking, no progress bars, no reading time estimates. Micro-animations only for function (hover, focus, overlay transitions).

## Competition Context

The previous design attempt ([AURA Book](https://www.figma.com/proto/YmSff5NpsL4KfiIIHtMNrZ/AURA-Book)) was "technically correct but emotionally flat." The reference to beat is [Stripe Press PCA](https://stripe.press/poor-charlies-almanack/talk-two) — but only its layout discipline, not its vintage aesthetic.

A competitor's entry exists at `editorial-book-ui-41282466630.us-west1.run.app`. Their strengths: warm palette, drop-cap, reading settings. Their weaknesses: editorial/collage style instead of Linear-clean, EB Garamond for body, pink accent, no three-column layout, `<title>My Google AI Studio App</title>`.

## Production

- **Prod URL:** TBD (will be deployed to a static host)
- **Domain:** TBD

## References

- [Design Brief](./docs/DESIGN-BRIEF.md) — full requirements from the client
- [Design Analysis](./docs/design-analysis.md) — our analysis of AURA Book vs PCA
- [Competitor Analysis](./docs/competitor-analysis.md) — breakdown of the competitor's entry

## License

Private. Competition entry — not for redistribution.
