# Plan: Re-theme HackIEEE as *Dune* (Arrakis)

Status: proposal — nothing implemented yet, nothing committed.

---

## 0. Legal guardrail (read first)

*Dune* (2021/2024) is a Legendary/Warner Bros. property; the novels are Herbert Properties LLC.
For a public, sponsor-facing event site:

- **Do not ship** movie stills, frame grabs, posters, key art, the film's logotype, character
  likenesses, or the House Atreides/Harkonnen crests.
- **Do ship** an *original* desert-brutalist aesthetic that reads as Arrakis: ochre dunes,
  monolithic silhouettes, spice-blue glow, wide-tracked display type, heat haze, sand drift.
  Name things with generic in-world language ("the deep desert", "spice", "the gathering")
  rather than trademarked house names.

Everything below is built to be evocative, not derivative. If a sponsor's legal team ever
asks, every asset in `public/` should be one you generated, shot, or licensed.

---

## 1. Where the site stands today

**Stack.** Next.js 16.3.4 (App Router), React 19, Tailwind v4 (CSS-first `@theme inline`),
GSAP 3 + `@gsap/react`, Supabase, Resend, Zod. TypeScript throughout.

**Routes.**
- `/` — `app/page.tsx`: inlined hero (two huge hand-authored SVG bar backgrounds, desktop
  and mobile, GSAP-animated) then `<About/> <Tracks/> <Timeline/> <Footer/>`.
- `/sponsorship` — `app/sponsorship/page.tsx`: video background, copy, `<SponsorshipForm/>`, `<Footer/>`.

**Design system.** `app/globals.css` (546 lines) defines a "Neon Rise" token set —
`--ink-blue #05060F`, `--storm-blue`, `--hanada #4C5BE0`, `--plum #B387E8`,
`--pink-plum #F86AC8`, `--sappan #FF4E63` — exposed to Tailwind via `@theme inline`, plus
glass cards, glow utilities, gradient buttons and keyframes.

**Fonts.** Lexend (body), Orbitron, Sora — all loaded via `next/font/google` in
`app/layout.tsx`, *and* redundantly re-imported through a raw `@import url(...)` in a
`<style>` tag in `<head>`. Material Symbols is loaded as a third-party stylesheet.

**Assets.** ~64 MB in `public/`: four MP4s (10–18 MB each), `tracks-bg.png` 2.5 MB,
`tracks-bg-mobile.png` **4.7 MB** (the mobile asset is nearly 2x the desktop one),
`OG-Tag.png` 1.4 MB, `footer-bg.png` 1.3 MB.

### Problems worth fixing while we re-theme

1. **All four videos are `<link rel="preload">`ed in `layout.tsx`** — every visitor to every
   route downloads ~55 MB of video up front, including the two they will never see. Delete
   those preloads; let each `<video>` lazy-load with a poster.
2. **`tracks-bg-mobile.png` (4.7 MB) is larger than desktop (2.5 MB)** — a straight
   regression on the phones that can least afford it.
3. **Dead code:** `app/components/Hero.tsx` and `app/components/VideoHero.tsx` are imported
   by nothing. `VideoHero` even points at `/videos/madder-dusk-web.mp4`, which does not exist.
4. **Hardcoded colors everywhere.** `Tracks.tsx` hardcodes five hex values, `Navbar.tsx`
   hardcodes `#ccff00`, `page.tsx` hardcodes `#0a0a0f` and ~140 inline SVG gradient stops.
   Re-theming is only cheap if these become tokens first.
5. **Colour-contrast risk** on `/sponsorship`: black text over a bright video with no scrim.
6. `metadata` has no `metadataBase`, so OG image URLs resolve relatively.

The single highest-leverage move: **tokenise first, re-skin second.** If step 1 lands
properly, the whole palette swap is a ~40-line diff in `globals.css`.

---

## 2. The Arrakis design language

### 2.1 Palette

Replace the Neon Rise tokens 1:1 so nothing downstream breaks.

| Token           | Hex       | Role                                                      |
| --------------- | --------- | --------------------------------------------------------- |
| `--basalt`      | `#0B0A08` | Page ground. Near-black, warm — replaces `#05060F`.        |
| `--night-sand`  | `#1A140E` | Raised surfaces, cards.                                    |
| `--dune-shadow` | `#3D2B1A` | Dune silhouette mid-tone.                                  |
| `--sand`        | `#C8A272` | Primary sand, borders, muted text.                         |
| `--bone`        | `#EDE3D2` | Primary text on dark. Warm off-white, never pure `#fff`.   |
| `--spice`       | `#D97A22` | Primary accent — burnt spice orange.                       |
| `--spice-hot`   | `#F2A33C` | Hover/highlight, sun flare.                                |
| `--ibad-blue`   | `#4FC9E8` | Secondary accent — the spice-blue eye glow. Use sparingly. |
| `--ibad-deep`   | `#1B6C86` | Darker blue for gradients and glows.                       |
| `--harkonnen`   | `#F5F5F5` | Cold monochrome accent, for one high-contrast surface.     |

Ratios that keep it *Dune* and not *generic-orange-startup*: **~70% warm dark neutrals,
~25% sand/ochre, ~5% spice-orange or ibad-blue as pure accent.** The blue is a jewel — if
everything glows blue it stops meaning anything.

Contrast, checked before merge: `--bone` on `--basalt` ≈ 14:1 (fine). `--spice` on
`--basalt` ≈ 6.4:1 (fine for text ≥16px). `--sand` on `--night-sand` ≈ 7:1 (fine). Do
**not** put `--spice-hot` text on `--sand`.

### 2.2 Typography

The film's title treatment is a very wide, thin, monoline geometric sans with enormous
letter-spacing. Closest free approximations, in order of preference:

1. **Archivo** (variable, has a width axis) — headings at `font-stretch: 125%`,
   `font-weight: 300–400`, `letter-spacing: 0.22em`, uppercase.
2. **Michroma** — fixed-width sci-fi geometric, instantly reads Dune-adjacent, one weight only.
3. **Saira** — if you want more range across condensed/expanded siblings.

Keep **Lexend** for body copy — legible, already loaded, and the contrast between a wide
display face and a neutral body face *is* the Dune typographic signature.

**Drop Orbitron and Sora** — neither is used meaningfully and both cost a font download.
Also delete the duplicate `@import url(...)` `<style>` block in `layout.tsx`; `next/font`
already self-hosts these.

Display type rules:
- Headings: uppercase, `letter-spacing: 0.18em`–`0.25em`, weight 300–400 (thin, not bold).
- Never centre a paragraph under a wide display heading longer than three words.
- Body stays sentence case, weight 400–500, `line-height: 1.7`.

### 2.3 Motion

Dune's visual grammar is **slow, heavy, and vast**. The current animations (4.5s
`sine.inOut` rising bars, 6s float, 12–15s blobs) are already correctly paced — keep the
durations, change the subjects.

- Sand drift: slow horizontal parallax of a grain texture, 40–60s loop.
- Heat shimmer: subtle SVG `feTurbulence` displacement on the hero horizon band only.
- Spice glow: replace `pulse-glow` with a slower, dimmer amber breathe (6s, opacity 0.25→0.45).
- Worm sign: the timeline progress line becomes a sand-trail that ripples ahead of scroll.
- Respect `prefers-reduced-motion` — nothing currently does. Add a global guard.

### 2.4 Shape and texture

- Kill the glassmorphism. Dune is **matte**. Replace `.glass-card` blur with flat
  `--night-sand` surfaces, 1px `--sand`/20% hairline borders, low-opacity grain overlay.
- Corner radius down from `20px` to `2–4px`, or zero. Brutalist, carved, ornithopter-panel.
- Add a repeating grain/noise texture over the whole page at 4–6% opacity. This one asset
  does more for the "film" feel than anything else on this list.

---

## 3. Assets to produce

All original. Generate (Midjourney / SDXL / Firefly) or license (Unsplash desert photography
is free and excellent for this). Budgets are hard limits — the site is already too heavy.

| File                                  | What it is                                                    | Budget    |
| ------------------------------------- | ------------------------------------------------------------- | --------- |
| `public/textures/grain.avif`          | Tileable film-grain / sand-noise, 512x512                      | ≤ 8 KB    |
| `public/hero/dunes-desktop.avif`      | Wide dune ridgeline at dusk, low sun, 2560w                    | ≤ 300 KB  |
| `public/hero/dunes-mobile.avif`       | Same scene, 9:16 crop, 1080w                                   | ≤ 180 KB  |
| `public/hero/dunes-poster.avif`       | First frame, for the video poster                              | ≤ 40 KB   |
| `public/hero/sand-drift.webm`         | 8–12s seamless loop of drifting sand, muted, 1920w             | ≤ 2.5 MB  |
| `public/hero/sand-drift-mobile.webm`  | 9:16 crop of the same                                          | ≤ 1.5 MB  |
| `public/tracks/rock-wall.avif`        | Sietch rock face / carved stone, replaces `tracks-bg.png`      | ≤ 250 KB  |
| `public/tracks/rock-wall-mobile.avif` | 9:16 crop, replaces the 4.7 MB mobile PNG                      | ≤ 150 KB  |
| `public/footer/deep-desert.avif`      | Night dunes under stars, replaces `footer-bg.png`              | ≤ 200 KB  |
| `public/sponsorship/spice-field.avif` | Amber-lit sand, harvester silhouette optional                  | ≤ 250 KB  |
| `public/icons/*.svg`                  | Five custom line icons for the tracks (below)                  | ≤ 3 KB ea |
| `public/OG-Tag.avif` + `.png`         | New 1200x630 social card, re-themed                            | ≤ 200 KB  |
| `public/favicon.ico` + `icon.svg`     | Spice-mote / dune-ridge mark                                   | ≤ 15 KB   |

Prompt direction that produces this look: *"vast ochre sand dunes at golden hour, low
raking sunlight, sharp ridgeline shadows, atmospheric haze, anamorphic, 2.39:1, desaturated
warm palette, monolithic scale, no people, no text."*

**Icon set** — replace the Material Symbols dependency entirely (it is a render-blocking
third-party stylesheet). Five hand-drawn 24x24 line icons, 1.25px stroke, `--sand`:

| Track          | Current glyph       | Arrakis icon                             |
| -------------- | ------------------- | ---------------------------------------- |
| Cyber Security | `security`          | Crysknife / shield-sigil                 |
| Healthcare     | `health_and_safety` | Stillsuit water-ring                     |
| Sustainability | `eco`               | Windtrap / dew collector                 |
| Finance        | `account_balance`   | Spice mote cluster / CHOAM-style hexagon |
| Open Track     | `lightbulb`         | Twin suns over a ridge                   |

### Asset pipeline (non-negotiable)

```bash
npm i -D sharp
```

Every raster goes source → AVIF (quality 55–65) with a WebP fallback → served via
`next/image` with explicit `width`/`height` and `sizes`. Videos: `ffmpeg` to VP9/WebM at
CRF 34, no audio track, plus a poster frame. **Delete the old MP4s and PNGs in the same PR
that replaces them** — do not let 64 MB become 120 MB.

---

## 4. Copy pass

The theme only lands if the words move too. Evocative, never cryptic.

| Where               | Now                                                 | Arrakis                                                                  |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| Hero subhead        | "Build, stage and ship code that feels considered…"  | "Forty-eight hours in the deep desert. Build something that survives it." |
| Hero CTA 1          | "See our tracks"                                    | "Choose your path"                                                       |
| Hero CTA 2          | "Timeline"                                          | "The gathering"                                                          |
| About heading       | "What is HackIEEE?"                                 | keep — clarity wins over flavour here                                    |
| Tracks heading      | "Hackathon Tracks"                                  | "Five paths across the sand"                                             |
| Tracks subhead      | "Choose your arena…"                                | "Each path has its own trials and its own spoils."                       |
| Timeline heading    | —                                                   | "The long walk"                                                          |
| Timeline phases     | "Phase 0 / 1 / 2 / Finale"                          | "First sign / The crossing / The storm / The reckoning"                  |
| Sponsorship heading | "Sponsor HackIEEE"                                  | "Partner with the expedition"                                            |
| Footer tagline      | "Where innovation meets impact."                    | "The spice must flow. So must the code."                                 |

Hard rule: **event-critical information — dates, deadlines, registration rules, contact
email, sponsorship tiers — stays literal.** A participant must never have to decode in-world
language to learn when registration closes.

---

## 5. Implementation phases

Each phase is one branch and one PR, per `CONTRIBUTING.md`. Ordered so the site is never
broken between merges.

### Phase 1 — `chore/tokenise-theme` *(no visual change)*
Groundwork. Merge this before anything else.
- Add semantic aliases in `globals.css`: `--color-surface`, `--color-surface-raised`,
  `--color-accent`, `--color-accent-2`, `--color-text`, `--color-text-muted`, `--color-border`.
- Replace every hardcoded hex in `Tracks.tsx`, `Navbar.tsx` (`#ccff00`), `Footer.tsx`,
  `page.tsx` (`#0a0a0f`, `#05060f`) with `var(--…)` / Tailwind token classes.
- Delete `app/components/Hero.tsx` and `app/components/VideoHero.tsx`.
- Delete the four `<link rel="preload" as="video">` tags and the duplicate font `@import`
  `<style>` block in `layout.tsx`.
- Add `metadataBase` to `metadata`.
- Add the global `prefers-reduced-motion` guard.
- **Acceptance:** site looks pixel-identical, `npm run build` passes, zero raw hex outside `globals.css`.

### Phase 2 — `style/arrakis-palette`
The palette and type swap. This is where it suddenly looks like Dune.
- Swap token *values* to §2.1. Because of Phase 1, this is a small diff.
- Swap fonts to Archivo (display) + Lexend (body); remove Orbitron and Sora.
- Flatten `.glass-card` to matte surfaces; radius 20px → 4px.
- Add the grain texture as a fixed overlay in `layout.tsx`.
- **Acceptance:** every page re-themed, contrast matches the numbers in §2.1, no layout shift.

### Phase 3 — `feat/dune-hero`
Replace the hand-authored neon SVG bars in `app/page.tsx`.
- Layered parallax: sky gradient → far dune ridge (SVG silhouette) → near dune (AVIF) →
  drifting sand (`sand-drift.webm`, with `poster`, `playsInline muted loop`) → grain.
- Two-suns motif as a soft radial light source, not a literal drawn circle.
- Title "HackIEEE" in Archivo, uppercase, `letter-spacing: 0.22em`, `--bone`, with a faint
  `--spice` backlight behind the ridgeline.
- Heat-shimmer `feTurbulence` on the horizon band only; disabled under reduced-motion.
- Deletes ~150 lines of inline SVG gradient stops.
- **Acceptance:** LCP ≤ 2.5s on a throttled 4G profile; hero assets ≤ 3 MB total.

### Phase 4 — `style/arrakis-sections`
`About`, `Tracks`, `Timeline`, `Footer`.
- `About`: replace `about-video.mp4` (10 MB) with the desert loop or a still plus parallax.
- `Tracks`: `rock-wall.avif` background, carved-stone cards on `--night-sand` (not white),
  custom SVG icons, Material Symbols removed from `layout.tsx`.
- `Timeline`: spine becomes a sand-trail; phase labels re-worded per §4; dots become spice motes.
- `Footer`: `deep-desert.avif` starfield, blobs become slow dust haze.
- **Acceptance:** no `material-symbols-outlined` class left anywhere; `public/` total < 15 MB.

### Phase 5 — `style/arrakis-sponsorship`
- `spice-field.avif` background with a proper scrim; fixes the black-text-on-bright-video
  contrast problem.
- Form surfaces re-themed dark; the ~180 lines of `.sponsor-form__*` CSS move onto tokens.
- Tier cards (`Award`/`Crown`/`Gem` from lucide) re-skinned in sand and spice.
- **Acceptance:** form still submits to Supabase and fires the Resend email; all inputs ≥ 4.5:1.

### Phase 6 — `chore/dune-polish`
- New favicon, `icon.svg`, OG card, `manifest.json`, `theme-color`.
- Lighthouse pass: target ≥ 90 performance, 100 accessibility.
- Cross-browser check: Safari (dropping `backdrop-filter` helps), Firefox, iOS Safari at 375px.

---

## 6. Risks

| Risk                                 | Mitigation                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| IP exposure from film assets         | §0 — original assets only, in-world language only, no crests or logotype                                      |
| `public/` balloons past 64 MB        | Hard per-asset budgets in §3; old asset deleted in the same PR as its replacement                             |
| Orange-on-dark contrast failures     | Contrast numbers pre-computed in §2.1; axe/Lighthouse gate in Phase 6                                         |
| Theme reads "generic desert startup" | The 70/25/5 ratio, wide-tracked thin display type, matte surfaces, and grain are what make it Dune — none optional |
| Phase 2 becomes a giant diff         | Phase 1 must merge first; it is the entire reason Phase 2 is small                                            |
| Event info lost to flavour text      | §4 hard rule — dates, deadlines, contact, tiers stay literal                                                  |
