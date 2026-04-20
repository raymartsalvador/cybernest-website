# Security Audit & Todo — cybernest-website

**Audit date:** 2026-04-21
**Scope:** repo root, `index.html`, React SPA (`src/`), booking API client (`src/services/bookingService.ts`), `vercel.json`, build + deploy surface
**Stance:** startup-scale — fix what blocks launch or leaks secrets first; defer hardening that needs infra you don't have yet (WAF, SIEM, SOC-2 controls).
**Repo:** `https://github.com/raymartsalvador/cybernest-website` — **public**

Legend: **P0** blocker · **P1** high · **P2** medium · **P3** low/polish

---

## Executive Summary

Five findings gate launch or are already leaking:

1. **`.env` committed to a PUBLIC repo, not in `.gitignore`** — `VITE_API_URL` + `VITE_X_API_KEY` exposed to the world. The key has been in git history since commit `4ecdc18`. Rotate and purge.
2. **`VITE_X_API_KEY` was never a real secret anyway.** Anything prefixed `VITE_` is inlined into the client JS bundle at build time (`dist/assets/*.js`), so every visitor sees it in DevTools. Treating a client-bundled value as an auth secret is a design bug, not a leak bug.
3. **JWT stored in `localStorage`** (`BookingModal.tsx:185`). Any XSS anywhere on the origin steals the session. HttpOnly cookies are the correct store for auth.
4. **No Content-Security-Policy.** `vercel.json` sets HSTS + XFO + nosniff but no `Content-Security-Policy`, no `Cross-Origin-Opener-Policy`. With inline `gtag` + Google Fonts + external booking API, a CSP is your cheapest XSS mitigation.
5. **`npm audit`: 13 vulnerabilities (7 high)** including `react-router` (open-redirect XSS, SSR XSS, CSRF), `vite` (path-traversal, arb-file-read via dev WS), `node-tar`, `picomatch`, `minimatch`. Most are dev-only but `react-router@7` is production.

Everything below assumes a single-founder startup: cheap, high-leverage fixes first; no security-team ceremony.

---

## P0 — Fix Immediately

### 1. Leaked API key + backend URL in public git history — **DONE 2026-04-21**
- The leaked `VITE_X_API_KEY` is **attached to nothing** — no active backend route accepts it, so the exposed value grants no access. Effective status: inert credential.
- ~~`.env` is tracked in `HEAD:.env`~~ → removed from working tree + staged for deletion.
- ~~`.gitignore` missing `.env`~~ → now blocks `.env`, `.env.local`, `.env.*.local`, `.env.production`, `.env.development` with `!.env.example` carve-out.
- ~~Create `.env.example`~~ → added with placeholder values + explicit `VITE_`-is-not-secret warning.
- Not doing `git filter-repo` / BFG — key is inert, scrubbing history is theatre.
- **Still open:** enable **GitHub Secret Scanning + Push Protection** on the repo (free for public repos) to block the next accidental commit at `git push`.

### 2. `VITE_X_API_KEY` is client-bundled, not a secret — **CODE DONE 2026-04-21; CONFIG PENDING**
- Chose model **(b) Serverless proxy**. Client now calls same-origin `/api/book/*` (see `bookingService.ts:7-12` `BASE = VITE_API_URL || "/api/book"`). No backend URL or key reaches the bundle when `VITE_API_URL` is unset.
- Proxy lives at `api/book/[...path].ts`. Path-allowlist enforced: only `:company/slots`, `:company/slots/book`, `:company/appointments`. `GET`/`POST` only. Forwards `Authorization`, `X-Idempotency-Key`, `X-Client-TZ` headers; injects `X-API-Key` from `BOOKING_API_KEY` server-side if set.
- **Required config before `VITE_BOOKING_ENABLED=true`:**
  1. In Vercel prod + preview env vars: set `BOOKING_API_URL=https://appointment-api.wittycliff-8233775f.southeastasia.azurecontainerapps.io/api` (server-side only, no `VITE_` prefix).
  2. **Unset `VITE_API_URL` in Vercel** (or set to `/api/book`) — otherwise the client keeps hitting Azure directly and the proxy is bypassed. Confirm by running a prod build and grepping `dist/assets/*.js` for `azurecontainerapps` — should return nothing.
  3. Leave `BOOKING_API_KEY` unset until Azure enforces a key (currently inert per 2026-04-21 confirmation).
- Update `.env.example` (manual — file is in a write-protected path). Add the server-side vars documented in `api/book/[...path].ts` (`BOOKING_API_URL`, optional `BOOKING_API_KEY`) and note that `VITE_API_URL` is now optional (defaults to `/api/book`).

### 3. Session token in `localStorage` — **PARTIAL 2026-04-21**
- ~~Dead `localStorage.getItem("cybernest_jwt")` fallback~~ → removed from `BookingModal.tsx`; `bearer` now resolves from the `authToken` prop only. Grep-verified: no `cybernest_jwt` / `localStorage` references remain in `src/`.
- **Still open:** when auth actually ships, issue an **HttpOnly + Secure + SameSite=Lax cookie** from the backend (or the `/api/book` proxy). The current codebase has no login UI, so this is cheap to do correctly on the first cut.

### 4. Add a minimum viable Content-Security-Policy — **DONE 2026-04-21**
- Starter CSP + `Cross-Origin-Opener-Policy: same-origin` landed in `vercel.json` `headers[0].headers`. Also added `object-src 'none'` to the CSP as a cheap extra.
- **Still open (follow-up):** eliminate `'unsafe-inline'` in `script-src` by moving the gtag bootstrap from `index.html` into a `/gtag.js` file and using a CSP nonce. Current `'unsafe-inline'` version is ~90% of the value; the nonce is the remaining 10%.
- **Verify after next prod deploy:** hit `curl -sI https://www.cybernestsolution.com | grep -i 'content-security-policy\|cross-origin-opener'` and confirm both headers are served. Then run the site through [securityheaders.com](https://securityheaders.com) for a sanity score.

### 5. Fix high-severity production deps — **DONE 2026-04-21**
- `react-router-dom` now at `7.14.1`, `vite` at `6.4.2` — both prior CVEs resolved via routine minor bumps.
- Remaining 9 audit findings (6 high) were all transitive deps under devDep `@vercel/node@5.7.12` (`path-to-regexp`, `undici`, `minimatch`, `smol-toml`, `ajv`). Resolved via `overrides` block in `package.json` pinning each to the patched in-major version. `npm install` clean; `npm run build:only` clean; `npm audit` now reports **0 vulnerabilities** (prod + dev).
- Dependabot added at `.github/dependabot.yml` — weekly Monday 08:00 Asia/Manila, grouped minor/patch, separate group for security updates, GitHub Actions also covered. Commit prefix `chore`.

---

## P1 — High

### 6. Contact form is a decorative UI, not a form
- `src/pages/Contact.tsx:73` — `handleSubmit` just flips `submitted` state. No network call. The help text admits it: _"Form submission handler pending."_
- Security-relevant when it does ship: you'll collect name + email + open-text → needs (a) Turnstile/hCaptcha to stop bot PII harvesters, (b) backend rate-limit per IP, (c) length caps on each field server-side (don't trust client-side `required`), (d) store or forward only — never render back untrusted input via `dangerouslySetInnerHTML`.
- Ship the form through the same `/api/*` Vercel function pattern as P0 #2 — one auth model, one place to rate-limit.

### 7. No CSRF strategy for the booking API — **COMMENT DONE 2026-04-21; BACKEND CONFIRM PENDING**
- `createAppointment()` in `src/services/bookingService.ts` now calls the same-origin `/api/book/*` proxy (see P0 #2).
- ~~Document the model in `bookingService.ts`~~ → `// AUTH MODEL:` + `// CSRF POSTURE:` block added at top of file (lines 7-15). Calls out: Bearer header + no cookies; do NOT reintroduce cookie sessions without a CSRF token or Origin allowlist.
- **Still open:** confirm with the Azure backend that:
  - Cookie auth is disabled for `/appointments`, OR a CSRF token is required when the cookie is present.
  - `Origin` header is validated against an allowlist including `https://www.cybernestsolution.com`.

### 8. No rate-limiting on any public endpoint
- The booking API is called directly from the browser with a client-visible key (see P0 #2). A bored attacker can enumerate `/slots?date=…` for every day for a year in minutes, or spam `/appointments` to fill your calendar with junk bookings.
- **Action (startup-minimum):**
  - Cloudflare Turnstile (free) on the Confirm button of `BookingModal.tsx` — token posted to `/appointments`, verified server-side.
  - Rate-limit per IP at the Azure Container App ingress (or add a `/api/book` Vercel function that checks Turnstile + applies `@vercel/edge`'s IP rate-limit).
- Zero-auth-required bookings without at least one of the above **will** get abused the day your first customer shares the link publicly.

### 9. No Subresource Integrity on third-party scripts
- `index.html:16` loads `googletagmanager.com/gtag/js` without SRI. A Google-pipeline compromise (hypothetical but has happened before at smaller CDNs) runs arbitrary JS on your origin.
- Google doesn't serve stable hashes for `gtag.js` (it rotates), so SRI isn't possible — accept this and mitigate via CSP `script-src` allowlist (P0 #4, already covers it) + **not** running any other third-party script on this origin until truly needed.

### 10. `deploy.log`, `mcp_audit.log`, `mcp_docker.log` in the working tree
- Untracked but sitting in the repo root. Your `.gitignore` has `*.log` so they won't commit — good. But `mcp_audit.log` is 871 KB and `mcp_docker.log` is 37 KB; if either contains tokens from MCP auth flows, leave them out of any screen-share or backup archive.
- **Action:** `rm deploy.log mcp_audit.log mcp_docker.log` when you don't need them — they're local telemetry, not artifacts.

---

## P2 — Medium

### 11. Add `SECURITY.md` for responsible disclosure — **DONE 2026-04-21**
- `SECURITY.md` added at repo root. Covers report channel (`security@cybernestsolution.com`), 3-business-day response SLA, in/out-of-scope list, safe-harbor clause. GitHub will auto-link it in the Security tab on the next push.

### 12. Enable GitHub branch protection on `main`
- Public repo, solo maintainer, direct-to-main. That's fine for velocity, but once a second person joins: require PR + 1 review + status checks passing (Vercel preview + `npm audit --audit-level=high`) before merge.
- Also: "Require signed commits" once you set up SSH signing — prevents an attacker with a stolen laptop from impersonating commits.

### 13. Cookie-less analytics / PH data-privacy posture — **PAGE DONE 2026-04-21**
- Site collects PII via the booking form (name, email, phone, address, company) → triggers **Republic Act 10173 (Data Privacy Act of 2012)** obligations: privacy notice, lawful basis, retention policy, a DPO contact.
- ~~Ship `/privacy` page~~ → `src/pages/Privacy.tsx` shipped, route wired in `App.jsx`, linked from `Footer.jsx`, added to `public/sitemap.xml` and prerender route list. Covers all 11 RA 10173 boxes (who/what/why/lawful-basis/sharing/retention/security/rights/cookies/changes/DPO).
- **Still open:** provision `privacy@cybernestsolution.com` mailbox (or alias to `cns@`) so the DPO contact route is live before flipping `VITE_BOOKING_ENABLED=true`.
- **Still open:** GA4 — disable Google Signals / advertising features you don't need; confirm IP anonymization is on. Reduces consent-banner surface.

### 14. `noreferrer` is set on external links — keep it that way
- Verified: `target="_blank"` occurrences in `Contact.tsx:149`, `Team.tsx:30`, `Footer.jsx:55` all have `rel="noopener noreferrer"`. Good. No action — documenting so it doesn't regress.

### 15. Replace `X-Frame-Options` with CSP `frame-ancestors`
- `vercel.json` sets `X-Frame-Options: SAMEORIGIN`. Modern equivalent is `Content-Security-Policy: frame-ancestors 'self'` — already included in the P0 #4 starter CSP. Once CSP ships you can drop XFO (or keep it as belt+suspenders for old crawlers).

### 16. Validate + cap booking-form input server-side
- Client regex in `BookingModal.tsx:313–319` is fine as UX hint, worthless as security. When the backend is yours (or when you introduce the `/api/book` proxy from P0 #2):
  - Cap `clientName` ≤ 120 chars, `email` ≤ 254, `phone` ≤ 32, `address` ≤ 500, `notes` ≤ 2000.
  - Reject non-printable chars in `name`, `address`.
  - `email` — use a real validator (`validator.js` or `zod.email()`), not a regex.
- Backend refusing oversized payloads saves you from a cheap DoS (a single 5 MB `notes` field × 100 bots).

### 17. Prerender step runs Puppeteer — not a prod risk, but lock it down
- `scripts/prerender.mjs` skips on Vercel (line 19). Good — Puppeteer downloads Chromium and would bloat deploy. Confirmed safe.
- Local-dev risk: Puppeteer's bundled Chromium lags upstream Chrome patches. Run `npm update puppeteer` when you see it's pinned to `^24.42.0` (current).

### 18. The `submitBooking` pre-reserve swallows errors silently
- `BookingModal.tsx:445` — `catch {}` on the pre-reserve. Not a direct security bug, but silent failures mask adversarial responses (e.g., a backend returning 429 because someone's spamming — you'd never know). Log to a telemetry sink (Sentry/Vercel Analytics) even if the UI continues.

### 19. `scripts/one_off_seo_images.py` — check before running
- Untracked script in repo root. Review its contents once before executing — a "one off" script lineage is the #1 place where a junior dev sneaks in a `requests.get(...).content` from an unverified URL. Low probability here since it's your own, but habit to form.

---

## P3 — Low / Polish

### 20. `.env.example` for onboarding
- Drop a `.env.example` at repo root so new contributors don't reinvent the variable names and accidentally commit `.env` (the root cause of P0 #1).

### 21. `README.md` security section — **DONE 2026-04-21**
- `README.md` now has a "Security & configuration" section explaining `VITE_*` is non-secret + client-bundled, real secrets live in Vercel + `/api/*`, and never commit `.env`. Points readers at `SECURITY.md` for the reporting channel and `SECURITY-todo.md` for the booking flag context.

### 22. Log-rotation of `deploy.log`
- If you come to rely on `deploy.log` locally, cap it — otherwise it's another PII sink (booking payloads in request logs? → RA 10173 retention obligation).

### 23. Consider HSTS preload enrollment
- `vercel.json` already sets `max-age=63072000; includeSubDomains; preload` — the `preload` directive is a pledge. Submit the apex + `www` to [hstspreload.org](https://hstspreload.org/) once DNS is stable. One-way decision (un-preloading takes months), so wait until infra is settled.

### 24. Booking infra — SHIPPING. Flag-gated interim; finish the real fix.
- Booking is a real launch feature (confirmed 2026-04-21). `BookingModal` + `AppointmentCalendar` **stay** in the bundle.
- Interim: `VITE_BOOKING_ENABLED=false` default (`BookingModal.tsx:23`) prevents network calls from the browser to the Azure backend while P0 #2 is in flight.
- **Before flipping the flag to `true`**, these items must land (in any order):
  - P0 #2 — `/api/book` Vercel serverless proxy (or rename to `VITE_X_PUBLIC_ID` + backend origin-allowlist).
  - P0 #3 — HttpOnly cookie auth; remove `localStorage.getItem("cybernest_jwt")`.
  - P1 #7 — confirm CSRF posture with Azure (Origin allowlist or CSRF token).
  - P1 #8 — Cloudflare Turnstile on Confirm button + IP rate-limit at ingress.
  - P2 #13 — `/privacy` page (RA 10173 gate — booking collects name/email/phone/address). **DONE 2026-04-21** — remaining sub-task: provision `privacy@cybernestsolution.com` mailbox/alias.
- Once all five land, flip `VITE_BOOKING_ENABLED=true` in Vercel prod env. Keep the flag in code as an emergency kill-switch.

### 25. Favicon / manifest files are untracked
- `public/cybernest-192.png`, `public/cybernest-512.png`, `public/cybernest-apple-touch.png`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/favicon.ico` — untracked per `git status`. Not a security issue, but commit them so Vercel builds match local. (SEO-todo already tracks the icon-set work.)

---

## Out of Scope (intentionally)

- **WAF / DDoS** — Vercel's edge already absorbs trivial DDoS. No action until traffic warrants.
- **SOC-2 / ISO 27001** — premature for a pre-revenue startup. Revisit when you chase enterprise gov customers.
- **Pentest engagement** — do items P0 + P1 first; a $15k pentest on a codebase that still commits `.env` is wasted spend.
- **SIEM / log aggregation** — Vercel logs + an Azure Log Analytics workspace on the backend is enough for year 1.

---

## Suggested order of execution (one session each)

1. **Tonight:** rotate the Azure API key, `git rm --cached .env`, enable GitHub Push Protection. (P0 #1)
2. **This week:** add `/api/book` Vercel function, move the key server-side, add Turnstile. (P0 #2, P1 #8)
3. **This week:** `npm audit fix`, add Dependabot config. (P0 #5)
4. **Next week:** add CSP + COOP headers, add `SECURITY.md`, `.env.example`. (P0 #4, P2 #11, P3 #20)
5. **Before first paying customer:** `/privacy` page, backend input caps, confirm CSRF posture with Azure backend. (P2 #13, P2 #16, P1 #7)
