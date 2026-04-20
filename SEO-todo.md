# SEO Audit & Todo — cybernest-website

**Audit date:** 2026-04-20
**Scope:** `index.html`, React SPA (Vite), routes `/`, `/products`, `/about`
**Canonical domain (from markup):** `https://www.cybernestsolution.com/`

Legend: **P0** blocker · **P1** high · **P2** medium · **P3** low/polish

---

## Deployment Status — 2026-04-21

All SEO work is deployed to production on Vercel. Live verification:

```
https://www.cybernestsolution.com/          → 200
https://www.cybernestsolution.com/products  → 200
https://www.cybernestsolution.com/about     → 200
https://www.cybernestsolution.com/contact   → 200
```

**Commits shipped:**
- `d4b236f` feat(seo): deploy prerender pipeline, per-route canonical, Contact route
- `0626dcd` fix(seo): simplify Vercel SPA rewrite pattern (first attempt, didn't fix)
- `70fca45` fix(seo): use idiomatic `:path*` rewrite and drop cleanUrls (this fixed 404s)
- `4258ed0` fix(seo): add offers + switch Product to SoftwareApplication schema

**Known trade-off (prerender disabled on Vercel):** `scripts/prerender.mjs:19-22` intentionally skips on Vercel (`process.env.VERCEL`) to avoid flaky puppeteer-in-CI. Consequence: all routes serve `dist/index.html` (homepage raw HTML), and React Helmet injects per-route title/canonical/JSON-LD **client-side**.
- **Googlebot** executes JS → correctly picks up per-route meta + schema (confirmed: GSC detected `PointFlow+` and `Certify+` Product schemas on `/products`).
- **Social crawlers** (Facebook, LinkedIn, Slack, Discord) don't execute JS → share previews show homepage OG tags for all routes. Acceptable trade-off to unblock indexing; revisit when social sharing becomes a priority.

**Vercel config gotcha (learned the hard way):**
- Negative-lookahead regex `/((?!api|assets|_next).*)` **does not match** in Vercel's path-to-regexp — all sub-routes 404.
- Canonical pattern `/(.*)` combined with `cleanUrls: true` also 404s.
- The working pattern is `{ "source": "/:path*", "destination": "/index.html" }` with `cleanUrls` removed.

**Search Console status (2026-04-21):** `/products` crawled successfully. Rich Results Test flagged 2 Product warnings (missing offers) — resolved in commit `4258ed0` by switching to `SoftwareApplication` with `offers` block.

**Next actions (you):**
- In GSC, re-run URL Inspection + Live Test on `/products`, `/about`, `/contact` → request indexing.
- Verify Rich Results warnings cleared after the `4258ed0` deploy.
- Set `www.cybernestsolution.com` as primary in Vercel project settings; redirect apex `cybernestsolution.com` → `www`.

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

### 7. No SSR / prerendering → social crawlers see stale meta — **DONE 2026-04-20**
- Added `scripts/prerender.mjs` — vendor-agnostic post-build step using `puppeteer` + `vite preview`. Snapshots pristine `dist/index.html`, then renders each route in headless Chromium, waits for react-helmet-async to inject per-route canonical, and writes `dist/<route>/index.html`.
- `package.json` `build` script now runs `vite build && node scripts/prerender.mjs`. Also added `build:only` (vite-only) and `prerender` (prerender-only) scripts for debugging.
- Verified: `dist/index.html`, `dist/products/index.html`, `dist/about/index.html` each contain their own `<title>`, `<meta description>`, `<link rel="canonical">`, OG, Twitter, and JSON-LD tags. Social crawlers without JS now see per-route meta.
- **Follow-ups:**
  - Duplicate `<title>` tags appear (helmet's + default from `index.html`). Browsers/Googlebot use the first (helmet's) — cosmetic only. Can strip the default in the prerender script later.
  - Add hosting-level config (Vercel `vercel.json` / Netlify `_redirects`) so unknown routes still fall back to `dist/index.html`.
  - Wire prerender into CI so every deploy regenerates static HTML.

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

### 14. Missing image dimensions → CLS risk — **DONE 2026-04-20**
- Added `width`, `height`, and `decoding="async"` (plus `loading="lazy"` below the fold) to all active-route `<img>` tags across:
  - `Hero.tsx` (hero LCP image — `fetchPriority="high"`, alt text also rewritten for keyword relevance, resolving P2 #21 for hero)
  - `Navbar.jsx`, `Footer.jsx`
  - `FeaturedProduct.tsx`
  - `Partners.tsx` (all partner logos, also improved alt to `"{name} logo"`)
  - `Products.tsx` (carousel images + service tiles)
  - `CertifiedExcellence.tsx`
  - `AboutUs.jsx` (all 10 img blocks in both mobile + desktop layouts)
- Skipped: `Team.tsx` and `Contact.tsx` — not currently routed.
- Build + prerender verified passing after changes.
- Also resolves part of **P2 #18** (lazy-loading below the fold) and part of **P2 #21** (hero alt text).

### 15. No Google Search Console / Bing verification — **PENDING USER ACTION**
- No `<meta name="google-site-verification">` tag.
- **User action:** register domain at https://search.google.com/search-console + Bing Webmaster Tools. Then paste the verification token and I'll add `<meta name="google-site-verification" content="...">` + `<meta name="msvalidate.01" content="...">` to `index.html`.
- DNS verification also works (TXT record at domain registrar) and is more durable — prefer that if you have DNS access.

---

## P2 — Medium Priority

### 16. Preconnect to GTM / GA without the script — **DONE 2026-04-20** (GA4 installed)
- Installed GA4 in `index.html` with measurement ID `G-Z6PMNMXP7W`:
  - Re-added `preconnect` hints to `googletagmanager.com` and `google-analytics.com` (crossorigin).
  - Added async `gtag.js` script + `dataLayer` + `gtag('config', 'G-Z6PMNMXP7W')` initialization.
- **Follow-ups:**
  - Verify in GA4 Realtime dashboard after first deploy that hits are flowing.
  - Consider adding consent mode / cookie banner if targeting EU / EEA traffic.
  - Optional: move to GTM later if non-GA tags (Meta Pixel, LinkedIn Insight) are added.

### 17. Hero image not responsive — **DONE 2026-04-20**
- ~~`Hero.tsx:77-82` — single PNG, no `srcset` / `sizes`, no modern format.~~
- Generated 5 responsive WebP variants from `hero-asset2.webp` (original 3000×2004, 844 KB) via `scripts/one_off_seo_images.py`:
  - 600w / 900w / 1200w / 1600w / 2000w (35 KB → 242 KB). Original kept as 3000w fallback.
- `Hero.tsx` now renders `<img>` with `srcSet` covering all six widths and `sizes="(max-width: 640px) 500px, (max-width: 768px) 700px, (max-width: 1024px) 900px, 1200px"` mapping to the Tailwind breakpoints already on the `className`.
- `fetchPriority="high"` retained on the hero (LCP element). Build + prerender verified passing.
- **Follow-up:** consider AVIF variants for another ~20–30% savings; current WebP set is already a ~65% LCP byte reduction for mobile.

### 18. No `loading="lazy"` on below-fold images
- Partner logos, milestone images, service tiles — all eager-load.
- Add `loading="lazy"` + `decoding="async"` to everything below the fold.

### 19. Footer social "links" are plain text — **DONE 2026-04-20**
- ~~`Footer.jsx:41` rendered `facebook.com/CybernestSolutions` as text, not `<a>`.~~
- Converted all contact entries in `Footer.jsx` to real anchors: `mailto:` for both emails, `tel:` for both phones, and the Facebook link with `target="_blank" rel="noopener noreferrer"`.
- Organization JSON-LD `sameAs` now has crawler-confirmable linkage.

### 20. `Contact.tsx` exists but isn't routed — **DONE 2026-04-20**
- ~~`App.jsx` had no `/contact` route. Booking was modal-only.~~
- Rewrote `Contact.tsx` into a full page: NavBar + Footer + Seo + Breadcrumbs + placeholder form + BookingModal CTA.
- Added `ContactPage` + `ContactPoint` JSON-LD (support + sales phones, email, PH language coverage).
- Wired `/contact` route in `App.jsx`, added Contact link to `Navbar.jsx` desktop + mobile nav.
- Added `/contact` entry to `public/sitemap.xml` (priority 0.8, monthly).
- Added `/contact` to `scripts/prerender.mjs` `ROUTES` array.
- **Caveats / follow-ups:**
  - Form has no submit handler yet — currently shows a confirmation state on client-side submit only. Wire to Formspree / Resend / email endpoint when decided.
  - No street address yet — page shows "Philippines · serving businesses and government offices nationwide". Replace with real NAP once public. Needed for `LocalBusiness` schema upgrade (P1 #8 follow-up).
  - ~~**`src/assets/images/Contact.webp` is 11 MB** — huge for a hero image. Must be compressed / resized before production.~~ **DONE 2026-04-20** — recompressed via `scripts/one_off_seo_images.py` from 5600×3733 / 10.76 MB to 1920×1280 / 404 KB @ q=82 (96.3% saved). Bundled output is now 414 KB.

### 21. Hero image alt text is weak — **DONE 2026-04-20** (resolved via P1 #14)
- `Hero.tsx` hero alt is now `"Cybernest workflow automation dashboard with queueing and appointment UI"` — matches the recommended outcome-focused copy.

### 22. Favicon set is incomplete — **DONE 2026-04-20**
- Generated full favicon set from `public/cybernest.png` via `scripts/one_off_seo_images.py`:
  - `favicon.ico` (multi-size 16/32/48, 5.3 KB)
  - `favicon-16x16.png`, `favicon-32x32.png`
  - `cybernest-apple-touch.png` (180×180, previously 404 — link in `index.html` was broken)
  - `cybernest-192.png`, `cybernest-512.png` (PWA)
- `index.html` updated to link `favicon.ico` + 16×16 + 32×32 + 180×180 apple-touch.
- `public/manifest.json` icons now point at the proper 192 and 512 PNGs (were both pointing at the same `/cybernest.png`).
- **Follow-up:** consider generating a dedicated maskable-safe icon with padding so Android's adaptive-icon mask doesn't clip the logo.

### 23. Meta description contains unverified claim — **DONE 2026-04-20**
- ~~"Reduce wait times by 40%" — regulators (PH DTI Fair Advertising) + trust signals at risk.~~
- Audited current copy: claim is **not present** in any live route's title, description, OG text, or hero/product copy (it was already removed when per-route meta was rewritten under P1 #5 / #10). Only stale reference was in audit docs.
- **Follow-up:** if the 40% stat returns (e.g., in a case study page), back it with a linked source or soften to qualitative language.

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

### 26. No breadcrumbs — **DONE 2026-04-20**
- `BreadcrumbList` schema was already emitted via `Seo.tsx` under P1 #8.
- Added UI counterpart: new `src/components/Breadcrumbs.tsx` — accessible `<nav aria-label="Breadcrumb">` with `aria-current="page"` on the last item.
- Wired into `/products`, `/about`, and new `/contact` routes using the same breadcrumb array passed to `Seo`.

---

## P3 — Polish

### 27. `meta keywords` tag — **DONE 2026-04-20**
- Confirmed: `index.html` no longer contains a `<meta name="keywords">` tag (already removed when per-route meta was introduced in P1 #5).

### 28. HTML lang subtag
- `en-PH` is valid but rare. Confirm intent; `en` is broader, `en-PH` signals geo to some crawlers.

### 29. Duplicate case-sensitive routes — **DONE 2026-04-20**
- ~~`App.jsx` registered both `/Products` + `/products` and `/About` + `/about`.~~
- Removed capitalized variants from `App.jsx`. Routes are now lowercase-only: `/`, `/products`, `/about`, `/contact`.
- Added `vercel.json` with 301 redirects `/Products → /products`, `/About → /about`, `/Contact → /contact` + SPA rewrite fallback.

### 30. Fonts: only Montserrat, loaded via print-swap trick
- Good for perf, but make sure `font-display: swap` is set (Google Fonts `&display=swap` URL already does this — OK).
- Consider self-hosting for privacy + slightly faster first paint.

### 31. No security/trust headers — **DONE 2026-04-20** (via `vercel.json`)
- Added in `vercel.json` `headers` for `/(.*)`:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Asset cache: `/assets/(.*)` gets `Cache-Control: public, max-age=31536000, immutable`.
- **Follow-up:** add a `Content-Security-Policy` once GA4/GTM/embedded fonts/iframes are finalized. CSP is easy to misconfigure — leave for a dedicated pass.

### 32. Domain confusion
- Site uses `cybernestsolution.com` (singular). Emails use `cybernestsolution.com` **and** `cybernestsolutionph@gmail.com`. Facebook handle is `CybernestSolutions` (plural).
- Decide canonical brand string ("Cybernest Solutions" vs "Cybernest") and align across title, OG, footer, Schema, social.
- Make sure `cybernestsolutions.com` (plural) either redirects to singular, or register it defensively.

### 33. Non-www / HTTP redirects — **PARTIAL 2026-04-20**
- `vercel.json` now carries 301 redirects for `/Products`, `/About`, `/Contact` case variants + SPA fallback rewrite.
- **Still needed at DNS / Vercel project level:**
  - Set `www.cybernestsolution.com` as production domain in Vercel project settings.
  - Add `cybernestsolution.com` (apex) as alias that **permanently redirects** to `www.cybernestsolution.com`.
  - Verify `http://` variants auto-301 to `https://` (Vercel does this by default once the domain is attached).
- Verification (post-deploy): `curl -I http://cybernestsolution.com/` should return 301 → `https://www.cybernestsolution.com/`.

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
