# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 e-commerce frontend for "Muebles Latina" — a Spanish-language furniture catalog. Intended to connect to a WooCommerce backend at the URL in `NEXT_PUBLIC_WC_URL` (`.env.local`), but currently uses **mock data** from `lib/data/productos.ts` (32 products). The product catalog and detail pages for the "Asientos" category are fully implemented. Cart, checkout, WooCommerce integration, and remaining category pages are pending.

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
- **Model Viewer** (v3.4.0) loaded globally — imported but not yet used in any page

## Architecture

**App Router structure** — all routes under `app/`. Root layout (`app/layout.tsx`) wraps every page with `<Header>` and `<Footer>`.

**Routes:**
- `/` — Home (placeholder, minimal content)
- `/asientos` — Seating category (fully implemented: 4 subcategory sections with ProductGrid)
- `/dormitorio` — Bedroom category (stub)
- `/sala-de-estar` — Living room category (stub)
- `/producto/[slug]` — Dynamic product detail page (static generation via `generateStaticParams`, 32 products pre-rendered)

**Component organization:**
- `components/layout/header/` — `Header`, `AnnouncementBar` (auto-hides on scroll), `SearchBar` (debounced, filters mock data), `SubcategoryNav` (sticky, Intersection Observer)
- `components/layout/footer/` — `Footer` (newsletter form + links, form non-functional)
- `components/Product/` — all product UI components (see Data & Components section below)

**Theme system** (`lib/theme.ts` + `hooks/useTheme.ts`):
Centralized color palettes exported as typed objects (`ThemeColors` interface). The active theme is set by reassigning `export const theme = ...` in `lib/theme.ts`. Two palettes are defined: `minimalistGrayTheme` (active) and `professionalGreenTheme`. Components consume colors via the `useTheme` hook or by importing `theme`/`colors` directly.

**Path alias:** `@/*` maps to project root (configured in `tsconfig.json`).

## Data Layer

**`lib/data/productos.ts`** — central mock database (32 products across 4 subcategories):
- `sofas`: Malmö, Estocolmo, Oslo Compacto
- `sillones`: Bergen, Reykjavik, Turku Reclinable
- `sillas`: Copenhague, Aarhus, Tampere, and others
- `bancos`: Helsinki, Gotemburgo

Helper functions:
```typescript
getProductoPorSlug(slug)          // Returns ProductoDetalle | undefined
getProductosRelacionados(slug, subcategory)  // Returns 4 related ProductoDetalle[]
getTodosLosProductos()            // Returns all products flat
```

**`lib/types/producto.ts`** — TypeScript interfaces:
- `ProductVariant` — `{ color, hex, image, hoverImage? }`
- `ProductCardProps` — base product fields for grid display
- `ProductoDetalle extends ProductCardProps` — full detail fields (descripcion, caracteristicas, dimensiones, material, imagenes, categorySlug, subcategory)

When WooCommerce integration is added, these helper functions are the abstraction boundary to replace.

## Components

### Product components (`components/Product/`)

| Component | Type | Purpose |
|---|---|---|
| `ProductCard` | client | Grid card with hover image swap, color swatches, discount badge |
| `ProductGrid` | server | Responsive 1→2→4 col grid; mixes `ProductCard` + `CategoryCard` |
| `CategoryCard` | server | Large showcase card for collections, spans 2 cols |
| `CategoryHeader` | server | Hero section with background image, title, CTA, animated zoom |
| `ProductoDetalleVista` | client | Full detail view: image gallery, sticky info panel, variant selector |
| `ProductosRelacionados` | server | Shows 4 products from same subcategory using `ProductCard` |
| `Breadcrumbs` | server | Navigation breadcrumb trail |

### Layout components

| Component | Type | Purpose |
|---|---|---|
| `Header` | client | Desktop nav with dropdowns, mobile hamburger, search/account/cart icons |
| `AnnouncementBar` | client | Rotating promo messages (4s interval), fades out on scroll > 20px |
| `SearchBar` | client | 300ms debounce search over mock data, closes on outside click |
| `SubcategoryNav` | client | Sticky nav using Intersection Observer, smooth scroll to sections |
| `Footer` | client | Newsletter form (non-functional) + navigation links + contact info |

## Animations

`app/globals.css` defines 15+ keyframe animations used across components:
- Announcement bar slide/fade
- Product card lift + scale on hover
- Color swatch pop
- Nav link bounce + active pulse
- Dropdown entrance with scale
- Hero image zoom on load
- Scroll indicator bounce
- Product detail fade-in
- Button pulse on hover

## Implementation Status

**Done:**
- Full header navigation (dropdowns, mobile menu, active route detection)
- `/asientos` category page with 4 subcategory sections (Sofás, Sillones, Sillas, Bancos)
- `/producto/[slug]` dynamic detail pages for all 32 mock products (SSG)
- Product search over mock data
- Product variant selection (color swatches with image swap)
- Responsive design (mobile-first, Tailwind breakpoints)
- Theme system (two palettes, switchable)

**Pending:**
- `/dormitorio` and `/sala-de-estar` category pages (stubs only)
- Home page (`/`) content
- Shopping cart (state + UI + persistence)
- Checkout flow
- User authentication / account page
- WooCommerce API integration (replace mock data)
- Newsletter signup functionality
- 3D model viewer usage (library loaded but unused)
- Product reviews / ratings

## Language

All UI text, comments, and component names use **Spanish**. Keep this convention when adding new code.
