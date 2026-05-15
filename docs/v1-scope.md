# V1 Scope — What's In, What's Out

Extracted from [DESIGN-BRIEF.md](./DESIGN-BRIEF.md) §3, §4, §7, §9, §11, §12.
This is the single source of truth for what V1 must deliver.

---

## ✅ V1 — Must Have

### Pages
- **Chapter reading page** (`/books/{book}/{chapter}`) — the entire V1 is this one page

### Layout (§7.1)
- Three-column desktop layout (≥1280px):
  - Left column (~80px): logo + global nav (Books / Canon / Home) — **drawn but non-functional** (links → `#`)
  - Middle column (~280-320px): chapter context + TOC sidebar
  - Right column (~700-800px): chapter text
- Left & middle columns are sticky on scroll
- Right column scrolls with content

### Chapter Header (§7.2)
- Chapter title — large
- Author name + avatar (always Ivan for now, but architecture supports co-authors)
- "Copy link" button with "Copied ✓" feedback (2 seconds)
- Contributors line — "Thanks to N contributors..." (shown only if contributors exist, expandable)

### Chapter Content Blocks (§7.4)
- h2, h3, h4 sub-headings
- Body paragraphs (comfortable reading — the primary use case)
- Bulleted and numbered lists
- Standard blockquotes
- **Skeptic voice** — visually distinct (icon/color/border), appears ≥1 per chapter. Marked as `> Skeptic:` in markdown
- Scholar citations — with source attribution below the block
- Client quotes — short, via dash / blockquote
- Inline code and code blocks (e.g. `I want to {verb}`)
- Footnotes
- Single images with captions
- **Image galleries** — 2+ images in a row (mandatory, book is very visual)
- Pull-quotes — large italic serif, breaks prose flow
- **Two-pane layout** (image left / text right) — experimental, best-effort, not a blocker

### TOC Sidebar (§7.1, middle column)
- "Open table of contents" button → opens overlay (§7.3)
- Active Part name with expanded chapter list
- Current chapter highlighted
- Sub-headings (h2/h3) of current chapter as clickable anchor links
- Scroll-spy: highlight active section on scroll

### TOC Overlay (§7.3)
- Full-screen overlay over content
- Header: "This book has N chapters" + "M more in progress" + subscribe toggle (stub, gray)
- Search field at top — `⌘K` / `⌘/` shortcut
- Hierarchical list of Parts and chapters
- Current chapter highlighted
- Close: click outside, Esc, or X button

### Search (§9)
- Global search across all chapters (V1: one book)
- Client-side (Lunr / FlexSearch), index loaded once
- Results: text fragment with highlight + chapter name + book name + link
- Triggered from overlay or `⌘K` / `⌘/`

### Responsive / Adaptive (§11)
- **Desktop (≥1280px)** — three columns as described above
- **Tablet (768-1279px)** — left column stays, middle collapses to dropdown
- **Mobile (<768px)** — single column (chapter text only) + floating "Contents" button at bottom → opens TOC overlay
- Mobile is mandatory in V1

### Visual Style (§10.2)
- Linear/Notion clean + book reading feel
- Warm off-white background ("paper, not screen")
- Single restrained accent color (Deep Navy #2A3F5F)
- No island/card pattern — continuous warm surface
- Generous whitespace
- Typographic hierarchy for contrast, not color blocks
- No gradients, no 3D, no scroll-jacking
- Micro-animations only for function (hover, focus, overlay transitions)

---

## ❌ V1 — Explicitly Out

### Pages (→ V2)
- Home page / landing (`/`)
- Book shelf (`/books`)
- Book card page (`/books/{slug}`)
- Canon page (`/canon`)

### Features (→ V2)
- Working global nav links (Books / Canon / Home drawn but non-functional)
- Subscribe to new chapters (toggle drawn as stub, no backend)
- "Read / In progress" markers on chapters (open question, needs client-side state)
- Book-specific accent colors (TBD, leaning toward unified style)

### Features (→ Never)
- Dark theme
- Paywall / paid access
- Audio chapter versions
- Multi-language / language switcher
- Separate `/about` page
- User accounts / login
- Email subscription backend
- Comments under chapters

### Visual Anti-Patterns (§7.5, §10.2)
- Sidebar ads / "Similar articles"
- Intrusive popups (newsletter, cookie banners — minimal if any)
- Reading progress bar at top
- Reading time estimate ("~12 min read")
- Link preview on hover (overlay with first paragraphs)
- Social share buttons beyond "Copy link"
- Substack / Medium / Ghost blandness
- NYT Magazine editorial loudness
- Academic paper dryness
- Stripe-style gradient landing
- SaaS dashboard feeling
- Neumorphism

---

## ⚠️ Open Design Questions (§13)

To be resolved during development, not blocking V1:

1. **"Read / in progress" markers** on TOC chapters — worth doing without accounts (client-side state)?
2. **Gallery style** — horizontal scroll vs grid vs lightbox. Need prototype on demo chapter.
3. **Per-book accent color** — one accent for all books or per-book? Leaning unified.
4. **Callout blocks** — optional, for "Operational consequences" in synthesis chapters.
5. **Diagrams/schemas** — same treatment as images, or separate style for Job Graph diagrams?
