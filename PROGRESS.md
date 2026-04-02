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
- **Map**: d3 + topojson-client
- **Font**: Inter (loaded via next/font/google)

## Project Structure

```
app/
  layout.tsx              — pass-through, delegates to [locale]/layout.tsx
  globals.css             — all CSS variables (light + dark), Tailwind v4 theme, global button/social styles
  [locale]/
    layout.tsx            — HTML shell, Inter font, theme script, NextIntlClientProvider
    page.tsx              — wires all sections in order
components/
  layout/Navbar.tsx       — COMPLETE
  layout/Footer.tsx       — COMPLETE
  sections/Hero.tsx       — COMPLETE (211-frame scroll animation)
  sections/About.tsx      — COMPLETE
  sections/MissionVision.tsx — COMPLETE (canvas route animation)
  sections/Services.tsx   — COMPLETE
  sections/ServiceItems.tsx — COMPLETE
  sections/Sectors.tsx    — COMPLETE
  sections/Partners.tsx   — COMPLETE
  sections/Map.tsx        — COMPLETE (lazy-loaded via MapLoader.tsx)
  sections/MapLoader.tsx  — dynamic import wrapper, ssr: false
  sections/Contact.tsx    — COMPLETE
  ui/                     — shadcn components
i18n/
  routing.ts              — locales config, localeDetection: false
  request.ts              — getRequestConfig for message loading
  navigation.ts           — locale-aware Link, redirect, usePathname, useRouter
lib/
  validations/contact.ts  — Zod schema for contact form (name, email, title, company, message)
messages/
  mk.json                 — all translation keys (Macedonian)
  en.json                 — all translation keys (English)
proxy.ts                  — next-intl middleware (Next.js 16 uses proxy.ts, not middleware.ts)
tokens-ms.json            — design token source of truth
InteractiveMap.html       — reference for Map section D3 implementation (ported)
mission-vision-preview.html — reference for MissionVision canvas animation (ported)
.cursorrules              — architecture, component, and code rules
```

## Section Order (in page.tsx)

1. Hero
2. About
3. **MissionVision** ← new
4. Services
5. ServiceItems
6. Sectors
7. Partners
8. MapLoader (→ Map)
9. Contact

## Completed Sections

### 1. Navbar (`components/layout/Navbar.tsx`)
- Fixed position, blur backdrop, scroll-triggered border/shadow
- Logo via `next/image` from `/images/logo.png`, height 32px, width auto
- Desktop: centered nav links, language toggle (MK|EN), theme toggle (Sun/Moon), CTA button ("Контакт"/"Contact" → scrolls to #contact)
- Mobile: hamburger menu → full-screen overlay with links, toggles, CTA
- **Nav links**: За нас, Мисија и Визија, Услуги, Сектори, Партнери, Контакт (6 links)
- **Scroll-driven active state**: IntersectionObserver watches all section elements (`hero`, `about`, `mission-vision`, `services`, `service-items`, `sectors`, `partners`, `map`, `contact`) with multiple thresholds. A `SECTION_TO_NAV` mapping translates section IDs to nav link keys. The most-visible section's corresponding nav link gets an underline indicator (`h-0.5`, `var(--nav-link-hover)` color, opacity fade transition). When hero is in view, no nav link is highlighted.
- Hover on links: `var(--nav-link-hover)`, 150ms ease transitions
- Theme toggle: writes `data-theme` to `<html>`, persists to `localStorage("ms-theme")`

### 2. Hero (`components/sections/Hero.tsx`)
- Scroll-driven canvas animation: 211 JPEG frames (`public/hero-frames/frame-0001.jpg` through `frame-0211.jpg`)
- `TOTAL_FRAMES = 211`, batch preloading (20 at a time), frame 1 loaded first
- 250vh container with 100vh sticky inner — scroll position maps to frame index via `requestAnimationFrame`
- Gradient overlay: `linear-gradient(to bottom, rgba(2,12,27,0.50) 0%, rgba(2,12,27,0.10) 40%, rgba(2,12,27,0.75) 100%)`
- Text layer: left-aligned, overline + H1 heading + subheading + CTA (scrolls to #contact)
- Framer Motion scroll-linked fade/slide animations (staggered per element)
- Bouncing ChevronDown scroll indicator that fades out on scroll
- Debounced canvas resize handler

### 3. About (`components/sections/About.tsx`)
- Full-width background image (`/images/about-team.jpg`) with dark blurred gradient overlay
- Two columns desktop (text left, stats right), single column mobile
- **Text colors hardcoded** to dark-mode equivalents (heading `#FAFBFC`, body `rgba(176,186,196,0.80)`, secondary `rgba(176,186,196,0.55)`, overline `#7FA8FF`) because the dark overlay makes light-mode variables illegible
- 3 stat blocks with custom `useCountUp` hook: IntersectionObserver triggers once, animates 0→target over 2000ms easeOut at 60fps via requestAnimationFrame
- Stats: 250,000+ (tons), 24ч (surveillance), 18 (licenses)
- Framer Motion `whileInView` fade-in + slide-up, `once: true`

### 4. MissionVision (`components/sections/MissionVision.tsx`)
- **Section ID**: `mission-vision` (smooth-scroll target from Navbar)
- **Background**: `var(--bg-page)` — responds to theme toggle normally (not permanently dark)
- **Layout**: Two columns on desktop (`md:grid-cols-2`, gap 80px), single column on mobile (<768px, gap 48px). Vertical divider between columns on desktop only (`hidden md:block`).
- **Padding**: `var(--section-y)` vertical, `var(--section-x)` horizontal, `max-width: 1280px` centered
- **Left column**: overline label "Мисија" + H2 "Нов стандард за квалитет" + mission body paragraph
- **Right column**: overline label "Визија" + H2 "Синоним за квалитетна услуга" + vision body paragraph
- **Overline style**: 11px, font-weight 700, tracking 0.13em, uppercase, `var(--text-brand)`, with 18×2px bar before text
- **Canvas animation**: Full port from `mission-vision-preview.html`. All functions (`buildRoutes`, `samplePath`, `drawRP`, `initAnimRoutes`, `draw`, `ease`) live inside a single `useEffect` with `useRef` for canvas and section elements. `initedRef` guards against re-initialisation.
- **Canvas route logic**: 4 animated routes on desktop (TL, TR, BL, BR), 3 on mobile (no BR). Routes constrained to safe zones — `safeH = 16%` of section height desktop / `13%` mobile, `safeX = 18%` of width desktop / `28%` mobile. Each route has its own duration (3600–4400ms) and staggered delay.
- **Canvas colors**: Reads `--mv-line`, `--mv-brand`, `--mv-glow` CSS variables at runtime via `getComputedStyle(document.documentElement).getPropertyValue()`. These are defined in `globals.css` for both `:root` and `[data-theme="dark"]`.
- **Route rendering**: Base route line (thin, muted), animated branded trail with glow shadow, rounded-rectangle "head" that follows the path and rotates to match direction. Eased progress (quadratic ease-in-out). Pause at end of each route, then restart loop.
- **Resize handling**: `window.addEventListener("resize", onResize)` recalculates canvas dimensions and rebuilds routes. Cleanup via `cancelAnimationFrame` + `removeEventListener` on unmount.
- Framer Motion `whileInView` fade-in + slide-up, `once: true`

### 5. Services (`components/sections/Services.tsx`)
- **Always dark background**: section bg `#0A1628`
- 3 cards in a row (desktop), 1 column (mobile) — Truck, Maritime, Rail
- Card states (all hardcoded hex, not CSS vars — intentional for this always-dark section):
  - **Resting**: bg `#0A1628`, border `1px solid #E6EEFF`
  - **Hover**: bg `#0E1C34`, border unchanged
  - **Active/expanded**: bg `#FAFBFC`, text inverts to dark, heading `#2529D8`
- Only one card expandable at a time (AnimatePresence height animation)
- Cards have fixed 420px height (desktop) with `line-clamp-3` on body text
- Images reference `/images/truck.jpg`, `/images/maritime.jpg`, `/images/rail.jpg`
- Framer Motion staggered fade-in on viewport entry

### 6. ServiceItems (`components/sections/ServiceItems.tsx`)
- **Diagonal split background**: dark `#0A1628` top ~55% via `clip-path`, `var(--bg-page)` bottom
- Header: H2 heading (white, hardcoded) left, subheading (muted, hardcoded) right — always on dark portion
- 2 rows × 3 cards, equal-height via `auto-rows-fr` + flex stretch
- Cards use **CSS variables** for dark mode support: `var(--card-bg)`, `var(--card-border)`, `var(--card-heading)`, `var(--card-body)`
- Top row: no shadow (sits on dark bg). Bottom row: subtle shadow
- Icon container: 48×48, `rgba(37,41,216,0.10)` bg, `1px solid var(--icon-brand)` border
- Icon: 24px, `var(--icon-brand)` — `#2529D8` light / `#4A6FEF` dark
- Icons: FileCheck, Truck, Zap, Globe, Package, Warehouse
- Framer Motion staggered card entrance

### 7. Sectors (`components/sections/Sectors.tsx`)
- Alternating image/text layout: 3 sectors (Логистика, Комерцијала, Финансии)
- First and third sectors: image left, text right. Second sector: text left, image right.
- Image side: `next/image` with `object-fit cover`, 400px height, `border-radius var(--radius-card)`, `onError` fallback to `var(--bg-subtle)` placeholder
- Text side: overline in `var(--text-overline)`, H3 heading in `var(--text-heading)`, body in `var(--text-secondary)`
- 96px vertical gap between rows
- Background: `var(--bg-page)`, fully theme-responsive via CSS variables
- Framer Motion: each row fades in + slides up 24px `whileInView`, staggered 150ms, `once: true`
- Images: `/images/logistics.jpg`, `/images/commercial.jpg`, `/images/finance.jpg`

### 8. Partners (`components/sections/Partners.tsx`)
- **Background**: hardcoded `#D3D9E0` (light neutral gray, not theme-responsive)
- Centered heading + subheading, heading hardcoded `#020c1b`, subheading `#606D7A`
- 12 partner logos in a responsive grid: 3 cols mobile, 4 cols `sm`, 6 cols `md`
- Logos loaded from `/images/partners/{name}.png` (120×48, `object-contain`)
- Partner list: liberty-steel, mm-militzer, makstil, mbm-port, european-plants, fakom, ats, makpetrol, dith, madame-coco, esm, zeleznici-mk

### 9. Map (`components/sections/Map.tsx` via `MapLoader.tsx`)
- Lazy-loaded via `next/dynamic` with `ssr: false` (D3 requires browser APIs)
- 1:1 port of `InteractiveMap.html` into a React client component
- D3 world map with country fills, flag overlays on hover, animated arc routes, traveling particle dots, HQ pulse animation on North Macedonia
- Zoom controls: zoom in, zoom out, reset view (re-centers on North Macedonia)
- Tooltip on country hover
- **Responsive sizing**: 100vh desktop, 75vh tablet (768–1024px), 60vh mobile (<768px) — via CSS media queries + debounced D3 resize handler that recalculates projection and re-centers
- Background always `#020c1b`
- `useEffect` with `useRef`, guard against re-initialization, cleanup on unmount

### 10. Contact (`components/sections/Contact.tsx`)
- Two-column layout: dark info card left, white form card right. Stacked on mobile.
- **Left card** (always dark, bg `#0e1c34`):
  - H3 title, 3 contact rows with circular brand-colored icon buttons (Mail, Phone, MapPin)
  - Email: `multisped2001@multisped.com.mk` (mailto link)
  - Phone: `+389 2 2447441 | +389 2 2447442`
  - Address: `Ул. 34 бр. 12 Илинден 1000 Скопје, Р.Македонија`
  - Social icons: Facebook + LinkedIn with official SVG logos
  - Social icon states: resting bg `#202E43`, hover Facebook `#1877F2`, hover LinkedIn `#0077B5`, icon white always, 150ms ease (via `.ms-social-btn` CSS classes)
- **Right form card** (theme-responsive: `var(--card-bg)`, `var(--card-border)`):
  - 5 fields: Name + Email (same row), Title, Company, Message textarea
  - Validation: Zod schema in `lib/validations/contact.ts`, all required, email format check
  - Submit: `mailto:` action pre-fills email client with form data
  - Inline success message on submission
  - Submit button uses `.ms-btn-primary` class for interactive states

### 11. Footer (`components/layout/Footer.tsx`)
- Background always `#0a1628`
- **Top row** — 3 columns (30% / 35% / 35%):
  - Left: logo via `next/image` with `fill` + `object-contain object-left` in a fixed 120×28px wrapper. Tagline below in `rgba(176,186,196,0.65)`.
  - Middle: 2-column nav links grid (Дома, За Нас, Транспортни Услуги, Сервисни Услуги, Контакт). Two states only: resting `rgba(176,186,196,0.65)`, hover `#7FA8FF`. No active state.
  - Right: email and address in `rgba(176,186,196,0.65)`
- **Bottom row**: divider `1px solid #1e3a6a`, social icons left (same styling as Contact section), copyright right in `rgba(176,186,196,0.45)`

## Fixes Applied

1. **Navbar active underline**: IntersectionObserver-driven active link indicator with opacity transition
2. **Button hover/pressed states**: `.ms-btn-primary` class with hover `#4A6FEF` and active `#1C1FB8` in `globals.css`
3. **Social icon colors**: `.ms-social-btn` CSS classes with platform-specific hover colors (Facebook `#1877F2`, LinkedIn `#0077B5`)
4. **Logo in Navbar and Footer**: `next/image` from `/images/logo.png` with proper sizing
5. **Responsive hero canvas**: Debounced resize handler recalculates canvas dimensions
6. **Partner logo paths**: Updated to `/images/partners/{name}.png` pattern
7. **Font consistency**: Inter loaded via `next/font/google`, applied globally via `font-sans` variable
8. **Overline labels updated**: Section overlines use `var(--text-overline)` / `var(--text-brand)` consistently
9. **Brand name МултиШпед in Macedonian**: Used throughout `mk.json` translations

## Global Interactive Styles (`app/globals.css`)

### Primary Buttons (`.ms-btn-primary`)
- Default: `var(--btn-primary-bg)` (`#2529D8` / brand 500)
- Hover: `#4A6FEF` (brand 400)
- Active/pressed: `#1C1FB8` (brand 600)
- Transition: `150ms ease`
- Applied to: Navbar CTA, Contact form submit, Hero CTA

### Social Icon Buttons (`.ms-social-btn`)
- Default: bg `#202E43`, border none, icon white
- Facebook hover/active: bg `#1877F2`
- LinkedIn hover/active: bg `#0077B5`
- Transition: `150ms ease`
- Applied to: Contact section social links, Footer social links

### MissionVision Canvas Variables
- `:root` (light): `--mv-line: rgba(176,186,196,0.35)`, `--mv-brand: #2529D8`, `--mv-glow: rgba(37,41,216,0.45)`
- `[data-theme="dark"]`: `--mv-line: rgba(74,111,239,0.15)`, `--mv-brand: #4A6FEF`, `--mv-glow: rgba(74,111,239,0.55)`

## Known Issues & Missing Assets

1. **Missing images**: The following files are referenced but may not exist yet:
   - `/images/logo.png` (Navbar + Footer logo)
   - `/images/truck.jpg` (Services card)
   - `/images/maritime.jpg` (Services card)
   - `/images/rail.jpg` (Services card)
   - `/images/about-team.jpg` (About section background)
   - `/images/logistics.jpg` (Sectors)
   - `/images/commercial.jpg` (Sectors)
   - `/images/finance.jpg` (Sectors)
   - `/images/partners/*.png` (12 partner logos)
2. **Hero frames**: 211 JPEG frames expected in `public/hero-frames/frame-0001.jpg` through `frame-0211.jpg`.

## Key Architecture Decisions

- **`proxy.ts` not `middleware.ts`**: Next.js 16 deprecated the `middleware` file convention. The project uses `proxy.ts` with `createMiddleware` from `next-intl`.
- **`localeDetection: false`**: Set in `i18n/routing.ts` to prevent browser `Accept-Language` from overriding the default `mk` locale.
- **`app/layout.tsx` is a pass-through**: Returns `{children}` only. All HTML structure, font loading, theme script, and `NextIntlClientProvider` live in `app/[locale]/layout.tsx`.
- **Theme before paint**: A blocking `<script>` in `<head>` reads `localStorage("ms-theme")` and sets `data-theme` on `<html>` before React hydrates, preventing flash.
- **Tailwind v4 CSS config**: No `tailwind.config.ts`. All theme extensions are in `app/globals.css` via `@theme inline` and `@custom-variant dark`.
- **Dark mode via `data-theme` attribute**: Not class-based. The custom variant `@custom-variant dark (&:is([data-theme="dark"] *))` enables Tailwind's `dark:` prefix.
- **Always-dark sections**: Services uses hardcoded hex values (always dark regardless of theme). ServiceItems header area is hardcoded dark; card area uses CSS variables for theme response.
- **About section text**: Hardcoded to dark-mode text colors because the background image + overlay is always dark.
- **MissionVision canvas colors isolated**: Uses dedicated `--mv-line`, `--mv-brand`, `--mv-glow` variables instead of shared `--brand`/`--line`/`--glow` to avoid conflicts with other sections.
- **Navbar scroll-driven active state**: IntersectionObserver watches all 9 sections and maps them to 6 nav links via `SECTION_TO_NAV`. Sections without a direct nav link (hero, service-items, map) map to adjacent nav keys or none.
- **Footer nav — no active state**: All links have only resting and hover states. No `usePathname` detection.
- **Map lazy-loaded**: `MapLoader.tsx` uses `next/dynamic` with `ssr: false` because D3 requires browser APIs.

## Design Token Flow

`tokens-ms.json` → CSS variables in `app/globals.css` (`:root` for light, `[data-theme="dark"]` for dark) → referenced in components via `var(--token-name)`.

Never use raw hex in components unless the section has a forced color scheme (Services, About overlay, ServiceItems header, Partners).

## Translation Keys

Both `mk.json` and `en.json` contain keys for: `nav`, `hero`, `about`, `missionVision`, `services`, `serviceItems`, `sectors`, `partners`, `map`, `contact`, `footer`, `theme`, `locale`.

## Next Steps

1. **Add missing images**: Place all required images in `public/images/` (logo, truck, maritime, rail, about-team, logistics, commercial, finance, partner logos).
2. **Final responsive QA**: Test at 375px, 768px, and 1280px breakpoints.
3. **Final build verification**: Ensure `npm run build` stays at zero errors.
