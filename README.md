MultiSped Design System
Design tokens for the MultiSped logistics landing page.
This repo is the single source of truth for colours, typography, spacing, and all other design decisions — consumed by Figma (via Tokens Studio) and Cursor (as a reference for code generation).

What's in this repo
multisped-design-system/
├── tokens.json   ← everything lives here
└── README.md
That's it for now. The project codebase lives in a separate repo. This one stays lean — just the design system.

Token Structure
Tokens are split into two layers:
primitive — the raw palette. Every possible value in the system: the full blue scale, neutrals, amber, success, error, warning, all spacing steps, font sizes, etc. You don't apply these directly in designs — they're the foundation.
semantic — the meaningful layer. Tokens like background.brand, text.heading-on-dark, or action.primary-background that reference primitives and carry intent. These are what you use in Figma components and in code.

Brand Colour
The primary brand colour is #2529D8 — mapped to primitive.color.blue.500.
The full blue scale runs from blue.100 (near-white tint) to blue.1000 (#020c1b), which doubles as the dark page/hero background — the same deep navy used in the interactive Europe map.
A dedicated semantic.color.map group mirrors the exact colour values from the interactive map component, keeping the map and surrounding UI visually unified without hardcoded magic numbers.

Theming
Every semantic token has both a light and dark value defined via the $extensions.dark field. The site's primary look is dark (deep navy hero, map background), with light surfaces appearing in content sections further down the page.

Figma Setup

Install the Tokens Studio for Figma plugin
In the plugin → Sync → choose GitHub
Point it at this repo, file path: tokens.json, branch: main
Enable both the primitive and semantic token sets
Use semantic as your active theme layer when building components

After any token change: merge to main → pull in Tokens Studio → update components.

Cursor / Code Notes

Reference semantic tokens in all component styles — never hardcode hex values
The semantic.color.map.* tokens correspond 1:1 with the CSS variables in InteractiveMap.html (--bg, --land, --border, --arc)
Recommended stack: Next.js + Tailwind CSS, mapping semantic token values into tailwind.config.js under theme.extend


Roadmap

 Colour tokens (brand, neutral, status, map)
 Typography scale
 Spacing, sizing, border radius
 Semantic action/button tokens
 Shadow definitions
 Motion / easing tokens (for scroll-driven hero animation)
 Component-level tokens (nav, card, badge)
