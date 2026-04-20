# SEO Reference — cybernest-website

**Purpose:** single source of truth for SEO-facing text. When editing copy, meta, schema, or brand strings, cross-check here first so titles, descriptions, canonical URLs, and brand voice stay consistent across routes, social shares, and search results.

**Last synced:** 2026-04-20
**Companion doc:** `SEO-todo.md` (audit + remediation tracker)

---

## 1. Canonical Identity

| Field | Value | Notes |
|---|---|---|
| Brand (full) | `Cybernest Solutions` | Use in titles, OG site_name, Schema `name`, footer |
| Brand (short) | `Cybernest` | OK in body copy, casual mentions, `short_name` in manifest |
| Canonical domain | `https://www.cybernestsolution.com` | **singular** — not `cybernestsolutions.com` |
| HTML lang | `en-PH` | Set in `index.html:2` |
| OG locale | `en_PH` | Set in `Seo.tsx:68` |
| Primary email | `cns@cybernestsolution.com` | Used in Organization schema |
| Secondary email | `cybernestsolutionph@gmail.com` | Legacy — phase out where possible |
| Support phone | `+63-976-179-1990` | Organization ContactPoint (customer support) |
| Sales phone | `+63-928-901-0072` | Organization ContactPoint (sales) |
| Facebook | `https://www.facebook.com/CybernestSolutions` | Note handle is **plural** — kept as-is; Organization `sameAs` |
| Theme color | `#DC3D50` | `manifest.json` |
| Background | `#FFFFFF` | `manifest.json` |

**Domain rule:** all external links, canonicals, OG URLs, and schema `@id`s must use `https://www.cybernestsolution.com` with **www** and **https**. Non-www / http variants should 301 → canonical (P3 #33 todo).

---

## 2. Per-Route Meta (current live values)

### `/` — Home
- **File:** `src/App.jsx:29-30`
- **Title:** `Cybernest Solutions — Workflow Automation & Digital Transformation` (64 chars)
- **Description:** `Cybernest streamlines traditional workflows with AI-powered queueing, appointment, and certification systems for Philippine businesses and government offices.` (159 chars)
- **Primary keywords:** workflow automation, digital transformation (PH)
- **Canonical:** `https://www.cybernestsolution.com/`

### `/products` — Products
- **File:** `src/pages/Products.tsx:341-342`
- **Title:** `Products — Certify+, PointFlow+ & Flow | Cybernest Solutions`
- **Description:** `Explore Cybernest's workflow automation products: Certify+ for bulk certificate generation, PointFlow+ for queue & appointment management, and Flow for end-to-end digital transformation.`
- **Primary keywords:** queue management system, appointment booking system, certificate generator
- **Canonical:** `https://www.cybernestsolution.com/products`
- **Extra schema:** `Product` (Certify+, PointFlow+) + `BreadcrumbList`

### `/about` — About
- **File:** `src/pages/About.tsx:20-21`
- **Title:** `About Cybernest — Our Story, Milestones & Certifications`
- **Description:** `Cybernest Solutions is a Philippine technology company building workflow automation and digital transformation products. Meet the team, milestones, and certifications behind our work.`
- **Primary keywords:** brand/trust queries, "Cybernest Solutions Philippines"
- **Canonical:** `https://www.cybernestsolution.com/about`
- **Extra schema:** `BreadcrumbList`

### `index.html` fallback (used by social crawlers before prerender, or for unknown routes)
- **Title:** `Cybernest Solutions — Workflow Automation & Digital Transformation`
- **Description:** `Cybernest builds workflow automation, queueing, and digital transformation solutions for Philippine businesses and government offices.`

---

## 3. Product Nomenclature

| Product | Canonical spelling | Tagline | Notes |
|---|---|---|---|
| Certify+ | `Certify+` (capital C, plus sign, no space) | Bulk certificate generation | `Product` schema on `/products` |
| PointFlow+ | `PointFlow+` (camel + plus) | Queue & appointment management | `Product` schema on `/products` |
| Flow | `Flow` | End-to-end digital transformation | **Todo:** dedicated `Product` schema (P1 #8 follow-up) |

**Rule:** always use the `+` character (not " Plus" or "Plus"). Never split capitalization (`Certify +`, `certify+`, `pointflow+` are wrong).

---

## 4. Title & Description Style Guide

**Titles**
- Pattern: `<Page topic> — <descriptor> | Cybernest Solutions` OR `<Brand> — <value prop>`
- Length: aim 50–60 chars; hard cap at ~65 before Google truncates
- Always include a keyword and the brand (brand can be after `|` or `—`)
- Use em dash `—` as primary separator; reserve `|` for brand suffix

**Descriptions**
- Length: 140–165 chars (Google ~160 truncation)
- Lead with value + product, then audience (PH businesses / government / clinics)
- Avoid unverified numeric claims ("40% faster") unless sourced — see P2 #23
- Active voice, Philippine English spelling if it differs (practice → practice, not practise — US English dominates)

---

## 5. Image Assets for Social / SEO

| Asset | Path | Use | Dimensions required |
|---|---|---|---|
| OG / Twitter card | `/og-cybernest-banner.png` | Default for all routes via `Seo.tsx:4` | 1200 × 630 (verify — P1 #12 follow-up) |
| Logo (Schema) | `/cybernest.png` | Organization `logo`, manifest icon | Any square; real PWA icons pending (P0 #3 + P2 #22) |
| Apple touch | `/cybernest-apple-touch.png` | iOS home screen | 180 × 180 |

**Route-specific OG image:** pass `image="/your-image.png"` to `<Seo />`. Otherwise falls back to banner.

---

## 6. Structured Data Inventory

| Schema | Location | Scope |
|---|---|---|
| `Organization` | `index.html:47-73` (static `@graph`) | Global — all pages |
| `WebSite` | `index.html:74-81` (static `@graph`) | Global |
| `BreadcrumbList` | `Seo.tsx:21-32` helper | Per route (Products, About currently) |
| `Product` (Certify+, PointFlow+) | `Products.tsx` via `jsonLd` prop | `/products` only |

**Pending:** `LocalBusiness` (needs public PH address), `Product` for Flow, `ContactPoint` page schema for `/contact` when that route ships.

**Rule:** when adding a new route, always pass `breadcrumbs` to `<Seo />`. Add `jsonLd` for any Product/Service/Article on that page.

---

## 7. File Map

| File | Role |
|---|---|
| `index.html` | Default `<title>`, description, Organization + WebSite JSON-LD, OG image dimensions, favicon, manifest/sitemap refs |
| `src/components/Seo.tsx` | Per-route `<Helmet>` — title, description, canonical, OG, Twitter, BreadcrumbList, custom JSON-LD |
| `src/App.jsx` | Home route — invokes `<Seo />` |
| `src/pages/Products.tsx` | `/products` — `<Seo />` + Product JSON-LD |
| `src/pages/About.tsx` | `/about` — `<Seo />` |
| `public/sitemap.xml` | Routes for Googlebot/Bing |
| `public/robots.txt` | Crawl rules + sitemap pointer |
| `public/manifest.json` | PWA — name, theme, icons |
| `scripts/prerender.mjs` | Post-build: renders each route to static HTML for social crawlers |
| `package.json` `build` | `vite build && node scripts/prerender.mjs` |

---

## 8. When Editing — Cross-Check Order

When changing any user-facing SEO text, update in this order to keep things consistent:

1. **Brand / domain / contact change** → `index.html` Organization schema + `Seo.tsx` `SITE_URL` + `public/manifest.json` + `public/sitemap.xml` + Footer
2. **Homepage title/description** → `src/App.jsx:29-30` AND `index.html:12-16` (fallback)
3. **Product rename** → `Products.tsx` title/description + Product JSON-LD `name` + sitemap + any internal links / nav copy
4. **New route** → add `<Seo />` + entry in `public/sitemap.xml` + breadcrumbs + consider JSON-LD
5. **OG image swap** → upload to `public/` + update `Seo.tsx:4` (or pass `image` prop per-route) + verify 1200×630
6. **After ANY change above** → `npm run build` (runs prerender) + spot-check `dist/<route>/index.html` for correct meta

---

## 9. Claims & Copy That Need Fact-Checking

Before editing marketing copy, verify these are still defensible:
- "40% wait time reduction" (P2 #23) — need case study / client data source on file
- "AI-powered" — only use where an actual AI/ML model is in the product path
- Any client name, logo, or testimonial — confirm written consent in `CertifiedExcellence` / `Partners` / `Testimonials`

---

## 10. Outstanding Alignment Work (from `SEO-todo.md`)

Cross-reference these when editing — they affect terms/consistency:
- **P3 #32** — domain/brand singular-vs-plural reconciliation (Cybernest Solutions vs Cybernest, singular URL vs plural Facebook handle)
- **P2 #24** — keyword map per page (don't stuff all 7 keywords on every page)
- **P2 #23** — soften or source the "40%" claim
- **P1 #15** — add `<meta name="google-site-verification">` once GSC registered
