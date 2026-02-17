# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 e-commerce frontend for "Muebles Latina" — a Spanish-language furniture catalog. Connected to a WooCommerce backend at the URL in `NEXT_PUBLIC_WC_URL` (`.env.local`). Early development stage: layout/navigation is in place but product listing, cart, and checkout are not yet implemented.

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint (next/core-web-vitals + TypeScript)
```

No test runner is configured yet.

## Tech Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript 5**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Google Fonts**: Cormorant Garamond (`--font-serif`), Plus Jakarta Sans (`--font-sans`), JetBrains Mono (`--font-mono`)
- **Model Viewer** (v3.4.0) loaded globally for 3D furniture previews

## Architecture

**App Router structure** — all routes under `app/`. Root layout (`app/layout.tsx`) wraps every page with `<Header>` and `<Footer>`.

**Routes:**
- `/` — Home
- `/asientos` — Seating category
- `/dormitorio` — Bedroom category
- `/sala-de-estar` — Living room category

**Component organization:**
- `components/layout/header/` — Header + AnnouncementBar (hides on scroll)
- `components/layout/footer/` — Footer with newsletter signup
- `components/Product/` — CategoryHeader (reusable hero section for category pages)

**Theme system** (`lib/theme.ts` + `hooks/useTheme.ts`):
Centralized color palettes exported as typed objects (`ThemeColors` interface). The active theme is set by reassigning `export const theme = ...` in `lib/theme.ts`. Two palettes are defined: `minimalistGrayTheme` (active) and `professionalGreenTheme`. Components consume colors via the `useTheme` hook or by importing `theme`/`colors` directly.

**Path alias:** `@/*` maps to project root (configured in `tsconfig.json`).

## Language

All UI text, comments, and component names use **Spanish**. Keep this convention when adding new code.
