# SEO Audit & Todo — cybernest-website

**Audit date:** 2026-04-20
**Scope:** `index.html`, React SPA (Vite), routes `/`, `/products`, `/about`
**Canonical domain (from markup):** `https://www.cybernestsolution.com/`

Legend: **P0** blocker · **P1** high · **P2** medium · **P3** low/polish

---

## Executive Summary

The site ships useful meta tags but has structural SEO problems that will **actively hurt ranking and social sharing**:

1. **Referenced files don't exist** — `sitemap.xml` and `manifest.json` are linked in `<head>` but missing from `public/`. These return 404 and look broken to Google/Bing.
2. **Preload hints point to dev-only paths** — `/src/assets/images/*.png` resolves in Vite dev but not in the production build (assets are hashed into `dist/assets/`). Every preload 404s in prod → wasted bytes + warnings.
3. **SPA with a single static `<head>`** — `/products` and `/about` inherit the homepage title, description, canonical, and OG image. `<link rel="canonical" href="...cybernestsolution.com/">` on every route will **de-index sub-pages**.
4. **No structured data** — placeholder comment, no Organization / LocalBusiness / Product / BreadcrumbList JSON-LD.
5. **No SSR / no react-helmet** — social crawlers (Facebook, LinkedIn, Slack) don't execute JS. All shares look identical regardless of route.

---

## P0 — Fix Immediately

### 1. Missing `public/sitemap.xml` — **DONE 2026-04-20**
- ~~`index.html:83` references `/sitemap.xml` but no file exists.~~
- ~~Create sitemap covering `/`, `/products`, `/about` (and `/contact` once wired).~~
- Created `public/sitemap.xml` with `/`, `/products`, `/about` (priority 1.0 / 0.9 / 0.7).
- **Follow-up:** submit to Google Search Console + Bing Webmaster Tools after deploy; add `/contact` entry when that route is wired (see P2 #20).

### 2. Missing `public/robots.txt` — **DONE 2026-04-20**
- ~~No `robots.txt` at all. Crawlers fall back to defaults.~~
- Created `public/robots.txt` with `User-agent: *` / `Allow: /` and sitemap reference.
- **Follow-up:** if a staging env gets deployed later, serve a separate `robots.txt` there with `Disallow: /` to keep it out of Google's index.

### 3. Missing `public/manifest.json` — **DONE 2026-04-20**
- ~~`index.html:89` references `/manifest.json` — 404 in prod.~~
- Created minimal `public/manifest.json` (name, short_name, theme_color `#DC3D50`, background `#FFFFFF`, `/cybernest.png` at 192 + 512).
- **Follow-up:** generate proper 192×192 and 512×512 icons (current `cybernest.png` is reused for both — should be the real dimensions for mobile "Add to Home Screen" clarity). See also P2 #22 favicon set.

### 4. Preload paths broken in production build — **DONE 2026-04-20**
- ~~`index.html:69-80` preloads `/src/assets/images/*.png`. In the Vite prod build these are bundled into `dist/assets/*-[hash].png`; the `/src/...` URLs 404.~~
- Removed all 10 `<link rel="preload">` tags from `index.html`. Vite auto-injects modulepreload/image hints based on bundled output.
- **Follow-up:** after P2 #17 (responsive hero images), re-add a single `fetchpriority="high"` preload for the LCP hero — but use the bundled hashed URL via a Vite plugin or the `<img fetchpriority="high">` attribute directly on the `<img>` in `Hero.tsx`.

### 5. Canonical de-indexes sub-pages — **DONE 2026-04-20**
- ~~`index.html:24` hardcodes `<link rel="canonical" href="https://www.cybernestsolution.com/">`.~~
- Installed `react-helmet-async`, wrapped app in `HelmetProvider` (`src/main.jsx`), created `src/components/Seo.tsx`, and emitted per-route meta in Home (`src/App.jsx`), Products (`src/pages/Products.tsx`), and About (`src/pages/About.tsx`).
- Each route now emits its own `<title>`, `<meta description>`, `<link rel="canonical">`, OG tags, Twitter tags, and `og:locale="en_PH"`.
- Stripped hardcoded title/description/canonical/OG/Twitter from `index.html` — left only a sensible default `<title>` and `<meta description>` as fallback.
- Production build succeeds (`npm run build` ✓).
- **Caveat:** meta is still injected client-side. Social crawlers (Facebook, LinkedIn, Slack) without JS execution will only see the `index.html` default. Fixed fully by P1 #7 (prerendering).

---

## P1 — High Priority

### 6. No per-route `<title>` / `<meta description>` — **DONE 2026-04-20** (resolved via P0 #5)
- Titles now set per route via `Seo` component:
  - `/` — `Cybernest Solutions — Workflow Automation & Digital Transformation`
  - `/products` — `Products — Certify+, PointFlow+ & Flow | Cybernest Solutions`
  - `/about` — `About Cybernest — Our Story, Milestones & Certifications`

### 7. No SSR / prerendering → social crawlers see stale meta
- Facebook, LinkedIn, Slack, Discord, and many others do **not** run JS. react-helmet-async alone is not enough.
- Add one of:
  - `vite-plugin-ssr` / `vike`, or
  - `react-snap` / `vite-plugin-prerender` for static prerendering of known routes, or
  - Migrate to Next.js / Remix if this becomes a growth channel.

### 8. No structured data (JSON-LD) — **DONE 2026-04-20**
- Added `Organization` + `WebSite` `@graph` schema as a static `<script type="application/ld+json">` in `index.html` (includes phone ContactPoints, Facebook `sameAs`, and `inLanguage: en-PH`).
- Extended `src/components/Seo.tsx` to accept `breadcrumbs` and `jsonLd` props and emit them as per-route JSON-LD.
- `/products` now emits `Product` schema for Certify+ and PointFlow+ plus a `BreadcrumbList`.
- `/about` emits a `BreadcrumbList`.
- **Follow-up:** add `LocalBusiness` once a PH street address is public; add `Product` for Flow once it gets its own entry.

### 9. `og:locale` vs `<html lang>` mismatch — **DONE 2026-04-20** (resolved via P0 #5)
- `Seo` component now emits `og:locale="en_PH"` on every route, aligned with `<html lang="en-PH">`.

### 10. Homepage title is weak for search — **DONE 2026-04-20** (resolved via P0 #5)
- Homepage `<title>` is now `Cybernest Solutions — Workflow Automation & Digital Transformation` (64 chars).

### 11. Twitter card title is just "Cybernest" — **DONE 2026-04-20** (resolved via P0 #5)
- `twitter:title` now mirrors the per-route OG title via the `Seo` component.

### 12. OG image file confusion — **DONE 2026-04-20**
- Kept `public/og-cybernest-banner.png` (612 KB) and deleted `public/cybernest_banner.jpg` (1.25 MB).
- `Seo.tsx` default updated to `/og-cybernest-banner.png`.
- **Follow-up:** verify PNG is actually 1200×630 on next render check; regenerate from brand assets if not.

### 13. No `<h1>` on sub-pages — **DONE 2026-04-20**
- `Products.tsx:320` already had an H1 ("Other Products").
- `AboutUs.jsx:19` promoted from `<h2>` to `<h1>` ("About Us"). Styling preserved.

### 14. Missing image dimensions → CLS risk
- `<img>` tags across Hero, FeaturedProduct, etc. have no `width`/`height` attributes.
- Add intrinsic dimensions to prevent layout shift (affects Core Web Vitals → ranking signal).

### 15. No Google Search Console / Bing verification
- No `<meta name="google-site-verification">` tag.
- Register the domain in GSC and add the verification tag (or verify via DNS).

---

## P2 — Medium Priority

### 16. Preconnect to GTM / GA without the script
- `index.html:98-99` preconnects to `googletagmanager.com` and `google-analytics.com` but no GA/GTM tag is actually embedded. Wasted handshake + no analytics data.
- Either install GA4 / GTM properly, or remove the preconnect hints.

### 17. Hero image not responsive
- `Hero.tsx:77-82` — single PNG, no `srcset` / `sizes`, no modern format.
- Export WebP/AVIF versions and use `<picture>` or `srcset`. Largest hero asset should be the LCP element.

### 18. No `loading="lazy"` on below-fold images
- Partner logos, milestone images, service tiles — all eager-load.
- Add `loading="lazy"` + `decoding="async"` to everything below the fold.

### 19. Footer social "links" are plain text
- `Footer.jsx:41` renders `facebook.com/CybernestSolutions` as text, not `<a>`.
- Make them real `<a href>` with `rel="noopener"`, so crawlers can follow them and Organization JSON-LD `sameAs` has confirmation.

### 20. `Contact.tsx` exists but isn't routed
- `App.jsx` has no `/contact` route. Booking is modal-only.
- Add a real `/contact` page with NAP info, embedded form, and JSON-LD `ContactPoint`. Improves local SEO and gives a deep-linkable conversion target.

### 21. Hero image alt text is weak
- `Hero.tsx:79` — `alt="Cybernest hero — woman with floating UI cards"`.
- Should describe the business outcome, not the visual: e.g.
  `"Cybernest workflow automation dashboard with queueing and appointment UI"`.

### 22. Favicon set is incomplete
- Only `/cybernest.png` + Apple touch. Missing `favicon.ico`, 16×16, 32×32, 192, 512, and manifest-linked PWA icons.
- Generate a full set (realfavicongenerator.net) and drop into `public/`.

### 23. Meta description contains unverified claim
- "Reduce wait times by 40%" — make sure there is a case study / data source backing this, or soften the claim. Regulators (PH DTI Fair Advertising Rules) and trust signals both matter.

### 24. Keyword cluster misalignment
- Homepage targets "workflow automation" but also "Queue Management System", "Appointment Booking System", "Kiosk", "POS", "Government Tech", "Clinic Software" in meta keywords.
- Pick **2–3 primary keywords per page**, map:
  - `/` → workflow automation, digital transformation (PH)
  - `/products` → queue management system, appointment booking system, certificate generator
  - `/about` → brand/trust queries
- `meta keywords` is ignored by Google — can leave or remove, but stop relying on it.

### 25. Thin content on homepage
- Hero + stats + featured product + footer = <300 words indexable copy.
- Add an "Industries we serve" / "How it works" / "Why Cybernest" section with keyword-rich prose (~600-800 words total on `/`).

### 26. No breadcrumbs
- Sub-pages have no breadcrumb UI or `BreadcrumbList` schema.
- Add both — improves SERP appearance.

---

## P3 — Polish

### 27. `meta keywords` tag
- Ignored by Google since 2009. Can remove to reduce noise, or keep minimal.

### 28. HTML lang subtag
- `en-PH` is valid but rare. Confirm intent; `en` is broader, `en-PH` signals geo to some crawlers.

### 29. Duplicate case-sensitive routes
- `App.jsx:50-53` registers both `/Products` and `/products`, `/About` and `/about`. Creates duplicate-content risk if both get linked externally.
- Keep lowercase only and redirect capitalized variants at the hosting layer (Vercel/Netlify `_redirects` or `vercel.json`).

### 30. Fonts: only Montserrat, loaded via print-swap trick
- Good for perf, but make sure `font-display: swap` is set (Google Fonts `&display=swap` URL already does this — OK).
- Consider self-hosting for privacy + slightly faster first paint.

### 31. No security/trust headers
- Not directly SEO, but HSTS, CSP, `X-Content-Type-Options` boost trust signals and HTTPS quality scoring. Configure at host.

### 32. Domain confusion
- Site uses `cybernestsolution.com` (singular). Emails use `cybernestsolution.com` **and** `cybernestsolutionph@gmail.com`. Facebook handle is `CybernestSolutions` (plural).
- Decide canonical brand string ("Cybernest Solutions" vs "Cybernest") and align across title, OG, footer, Schema, social.
- Make sure `cybernestsolutions.com` (plural) either redirects to singular, or register it defensively.

### 33. Non-www / HTTP redirects
- Verify `http://` and non-`www` variants 301 to `https://www.cybernestsolution.com/`. Canonical only works if server agrees.

### 34. AOS animations & `data-aos` on critical content
- AOS gates visibility via CSS until scripted in. Crawlers see the HTML so ranking isn't hurt, but LCP on the stats banner might suffer. Audit LCP element in Lighthouse.

### 35. Consider adding `/sitemap.xml` auto-generation
- Wire a Vite plugin (e.g. `vite-plugin-sitemap`) so the sitemap updates when routes change, instead of hand-maintaining.

---

## Suggested Execution Order

1. **Same-day fixes (P0):** create `robots.txt`, `sitemap.xml`, `manifest.json`; remove/fix broken preload paths; stop canonical from pinning every route to `/`.
2. **This week (P1):** install `react-helmet-async`, emit per-route meta + canonical; add JSON-LD Organization + Product; decide on prerendering approach; fix `og:locale`; tighten title.
3. **This month (P2):** GA4/GTM hookup, responsive hero images, `/contact` route, image alts, favicon set, content expansion, breadcrumbs.
4. **Later (P3):** redirects, domain consolidation, security headers, sitemap automation, SSR migration decision.

---

## Files Referenced in This Audit

- `index.html` (lines 2, 12, 24, 39, 43, 49, 69–83, 89, 91, 98–99)
- `src/App.jsx:48-55` (routes)
- `src/main.jsx` (no helmet provider)
- `src/pages/Hero.tsx:24, 77-82` (H1 + hero image)
- `src/pages/FeaturedProduct.tsx` (H2 only)
- `src/pages/Products.tsx` (no H1, no per-route meta)
- `src/pages/About.tsx` (no H1, no per-route meta)
- `src/components/Footer.jsx:40-43` (contact info, text not links)
- `public/` (missing sitemap.xml, robots.txt, manifest.json)
- `package.json` (no `react-helmet-async`, no prerender plugin, no analytics)
