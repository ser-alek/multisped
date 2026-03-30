# MultiSped Landing Page — Build Progress

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (CSS-based config via `@theme inline` in `app/globals.css`)
- **Components**: shadcn/ui (button, card, input, textarea, label, badge)
- **i18n**: next-intl v4 — locales: `mk` (default), `en`
- **Animations**: Framer Motion
- **Icons**: lucide-react
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Map**: d3 + topojson-client (installed, not yet used)
- **Font**: Inter (loaded via next/font/google)

## Project Structure

```
app/
  layout.tsx              — pass-through, delegates to [locale]/layout.tsx
  globals.css             — all CSS variables (light + dark), Tailwind v4 theme
  [locale]/
    layout.tsx            — HTML shell, Inter font, theme script, NextIntlClientProvider
    page.tsx              — wires all sections in order
components/
  layout/Navbar.tsx       — COMPLETE
  layout/Footer.tsx       — scaffold (empty div)
  sections/Hero.tsx       — COMPLETE
  sections/About.tsx      — COMPLETE
  sections/Services.tsx   — COMPLETE
  sections/ServiceItems.tsx — COMPLETE
  sections/Sectors.tsx    — scaffold (empty div)
  sections/Map.tsx        — scaffold (empty div)
  sections/Contact.tsx    — scaffold (empty div)
  ui/                     — shadcn components
i18n/
  routing.ts              — locales config, localeDetection: false
  request.ts              — getRequestConfig for message loading
  navigation.ts           — locale-aware Link, redirect, usePathname, useRouter
messages/
  mk.json                 — all translation keys (Macedonian)
  en.json                 — all translation keys (English)
proxy.ts                  — next-intl middleware (Next.js 16 uses proxy.ts, not middleware.ts)
tokens-ms.json            — design token source of truth
InteractiveMap.html       — reference for Map section D3 implementation
.cursorrules              — architecture, component, and code rules
```

## Completed Sections

### 1. Navbar (`components/layout/Navbar.tsx`)
- Fixed position, blur backdrop, scroll-triggered border/shadow
- Text logo ("Multi" in brand, "Sped" in heading color)
- Desktop: centered nav links, language toggle (MK|EN), theme toggle (Sun/Moon), CTA button
- Mobile: hamburger menu → full-screen overlay with links, toggles, CTA
- **IntersectionObserver** tracks which section is in view → active nav link uses `var(--nav-link-active)`
- Hover on links: `var(--nav-link-hover)`, 150ms ease transitions
- Theme toggle: writes `data-theme` to `<html>`, persists to `localStorage("ms-theme")`

### 2. Hero (`components/sections/Hero.tsx`)
- Scroll-driven canvas animation structure (250vh container, 100vh sticky inner)
- **Placeholder mode**: `TOTAL_FRAMES = 0`, solid `#020c1b` fill — ready for JPEG sequence in `public/hero-frames/frame-0001.jpg` etc.
- Full preload logic written (loads frame 1 first, rest in background)
- Scroll → frameIndex mapping via `requestAnimationFrame`, debounced resize
- Gradient overlay: `linear-gradient(to bottom, rgba(2,12,27,0.50) 0%, rgba(2,12,27,0.10) 40%, rgba(2,12,27,0.75) 100%)`
- Text layer: left-aligned, overline + H1 heading + subheading + CTA (scrolls to #contact)
- Framer Motion scroll-linked fade/slide animations (staggered per element)
- Bouncing ChevronDown scroll indicator that fades out on scroll

### 3. About (`components/sections/About.tsx`)
- Full-width background image (`/images/about-team.jpg`) with dark blurred gradient overlay
- Two columns desktop (text left, stats right), single column mobile
- **Text colors hardcoded** to dark-mode equivalents (heading `#FAFBFC`, body `rgba(176,186,196,0.80)`, secondary `rgba(176,186,196,0.55)`, overline `#7FA8FF`) because the dark overlay makes light-mode variables illegible
- 3 stat blocks with custom `useCountUp` hook: IntersectionObserver triggers once, animates 0→target over 2000ms easeOut at 60fps via requestAnimationFrame
- Stats: 250,000+ (tons), 24ч (surveillance), 18 (licenses)
- Framer Motion `whileInView` fade-in + slide-up, `once: true`

### 4. Services (`components/sections/Services.tsx`)
- **Always dark background**: section bg `#0A1628`
- 3 cards in a row (desktop), 1 column (mobile) — Truck, Maritime, Rail
- Card states (all hardcoded hex, not CSS vars — intentional for this always-dark section):
  - **Resting**: bg `#0A1628`, border `1px solid #E6EEFF`
  - **Hover**: bg `#0E1C34`, border unchanged
  - **Active/expanded**: bg `#FAFBFC`, text inverts to dark, heading `#2529D8`
- Only one card expandable at a time (AnimatePresence height animation)
- Cards have fixed 420px height (desktop) with `line-clamp-3` on body text
- Images reference `/images/truck.jpg`, `/images/maritime.jpg`, `/images/rail.jpg` — **files do NOT exist yet** (see Known Issues)
- Framer Motion staggered fade-in on viewport entry

### 5. ServiceItems (`components/sections/ServiceItems.tsx`)
- **Diagonal split background**: dark `#0A1628` top ~55% via `clip-path: polygon(0 0, 100% 0, 100% 45%, 0 55%)`, `var(--bg-page)` bottom
- Header: H2 heading (white, hardcoded) left, subheading (muted, hardcoded) right — always on dark portion
- 2 rows × 3 cards, equal-height via `auto-rows-fr` + flex stretch
- Cards use **CSS variables** for dark mode support: `var(--card-bg)`, `var(--card-border)`, `var(--card-heading)`, `var(--card-body)`
- Top row: no shadow (sits on dark bg). Bottom row: subtle shadow
- Icon container: 48×48, `rgba(37,41,216,0.10)` bg, `1px solid var(--icon-brand)` border
- Icon: 24px, `var(--icon-brand)` — `#2529D8` light / `#4A6FEF` dark
- Icons: FileCheck, Truck, Zap, Globe, Package, Warehouse
- Framer Motion staggered card entrance

## Scaffold-Only (Not Yet Built)

### 6. Sectors
- Alternating image + text layout, 3 sectors
- Figma node: `35-258` area (check Figma for exact node)
- Translation keys exist in `mk.json` / `en.json` under `sectors`

### 7. Map
- Must integrate D3 map from `InteractiveMap.html` as a React client component
- `useEffect` + `useRef`, replace hardcoded colors with CSS variables
- Background always `#020c1b`, guard against re-init on re-renders
- d3 and topojson-client already installed

### 8. Contact
- `react-hook-form` + `zod` validation
- Server action submit
- Inline success/error feedback, no page reload
- Translation keys exist

### 9. Footer
- Dark background, links, contact info, copyright
- Translation keys exist

## Known Issues & Missing Assets

1. **Missing images**: `public/images/` is empty. The following files are referenced but do not exist:
   - `/images/truck.jpg` (Services card)
   - `/images/maritime.jpg` (Services card)
   - `/images/rail.jpg` (Services card)
   - `/images/about-team.jpg` (About section background)
   - Sector images (not yet referenced, will be needed)
2. **Hero frames**: `public/hero-frames/` exists but is empty. `TOTAL_FRAMES = 0` placeholder is active. When frames are added, update the constant in `Hero.tsx`.
3. **shadcn form.tsx**: shadcn v4 doesn't ship a standalone `form.tsx`. Form primitives (Input, Label, Textarea) are available; `react-hook-form` integration will be manual in the Contact section.

## Key Architecture Decisions

- **`proxy.ts` not `middleware.ts`**: Next.js 16 deprecated the `middleware` file convention. The project uses `proxy.ts` with `createMiddleware` from `next-intl`.
- **`localeDetection: false`**: Set in `i18n/routing.ts` to prevent browser `Accept-Language` from overriding the default `mk` locale.
- **`app/layout.tsx` is a pass-through**: Returns `{children}` only. All HTML structure, font loading, theme script, and `NextIntlClientProvider` live in `app/[locale]/layout.tsx`.
- **Theme before paint**: A blocking `<script>` in `<head>` reads `localStorage("ms-theme")` and sets `data-theme` on `<html>` before React hydrates, preventing flash.
- **Tailwind v4 CSS config**: No `tailwind.config.ts`. All theme extensions are in `app/globals.css` via `@theme inline` and `@custom-variant dark`.
- **Dark mode via `data-theme` attribute**: Not class-based. The custom variant `@custom-variant dark (&:is([data-theme="dark"] *))` enables Tailwind's `dark:` prefix.
- **Always-dark sections**: Services uses hardcoded hex values (always dark regardless of theme). ServiceItems header area is hardcoded dark; card area uses CSS variables for theme response.
- **About section text**: Hardcoded to dark-mode text colors because the background image + overlay is always dark.

## Design Token Flow

`tokens-ms.json` → CSS variables in `app/globals.css` (`:root` for light, `[data-theme="dark"]` for dark) → referenced in components via `var(--token-name)`.

Never use raw hex in components unless the section has a forced color scheme (Services, About overlay, ServiceItems header).

## Next Steps

Build sections in this order, reading Figma design first for each:
1. **Sectors** — alternating image/text, 3 sectors
2. **Map** — D3 from InteractiveMap.html
3. **Contact** — form with validation
4. **Footer** — links, info, copyright

After all sections: final responsive QA at 375px, 768px, 1280px. Ensure `npm run build` stays at zero errors throughout.
