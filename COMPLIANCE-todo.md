# Compliance Audit & Todo — cybernest-website

**Audit date:** 2026-04-21
**Scope:** Philippines-based SaaS targeting local businesses + government offices. Data collected via `src/pages/Contact.tsx` + `src/components/BookingModal.tsx` (name, email, phone, address, company, free-text notes). Analytics via GA4.
**Primary laws in play:** RA 10173 (Data Privacy Act of 2012 + IRR), NPC Circulars 16-01 / 16-02 / 16-03 / 17-01, RA 8792 (E-Commerce Act), RA 10175 (Cybercrime Prevention Act), BP 344 (accessibility), GDPR (only if EU visitors transact).
**Stance:** startup-scale — satisfy the NPC-enforceable floor first, then build the artefacts govt sales asks for. Skip ISO/SOC-2 until a real RFP demands it.

Legend: **C0** legal blocker · **C1** sales blocker · **C2** hygiene · **C3** polish

> Companion to `SECURITY-todo.md`. Security = attacker can't get in. Compliance = regulator / procurement officer can't bounce you. Both needed; neither substitutes for the other.

---

## Executive Summary

Five items are enforceable gaps the **moment the booking form actually submits somewhere** (today it doesn't — `Contact.tsx:73` just flips local state). Until then, you're in a grace window. Once real data starts flowing:

1. **No Privacy Notice** on site → RA 10173 §16 violation the first time you collect PII.
2. **No consent capture** on the booking / contact form → no lawful basis under §12.
3. **No Data Protection Officer designated + published** → NPC Circular 16-01 violation regardless of size.
4. **No NPC registration tracking** → you must register when you cross any of: 1,000 records / 250 employees / any sensitive PI. Track it before you cross it.
5. **Analytics runs pre-consent** → GA4 drops identifiers before the user has agreed, documented, or been told.

Government sales (your stated market) require a second tier: DPA template, PIA, data-residency statement, accessibility statement. None of these need certifications — they need written artefacts on your domain.

Everything else (ToS, retention schedule, breach runbook, SEC disclosure) is cheap paperwork you'll regret not having when the first incident or RFP lands.

---

## C0 — Legal Blockers (do before the booking form ships)

### 1. Publish a Privacy Notice at `/privacy`
- **Obligation:** RA 10173 §16 (right to be informed) + IRR §34(a). Must exist **before or at** the point of collection.
- **Minimum contents:**
  - Identity of the PIC (Cybernest Solutions) + registered address + DPO contact email.
  - Exact data collected (name, email, phone, address, company, notes; GA4 client ID + IP).
  - Purpose per data point (booking fulfilment; analytics; support comms).
  - Lawful basis (§12 consent for booking; §12(f) legitimate interest for analytics — weak, prefer consent).
  - Third-party processors named (Google Analytics, Azure, Vercel) + their locations.
  - Retention period (see C2 #13).
  - Data-subject rights listed (§16–§18: access, rectification, erasure, objection, portability, damages, complaint to NPC).
  - Complaint channel: `privacy@cybernestsolution.com` **and** NPC at `complaints@privacy.gov.ph`.
- **Action:** create `src/pages/Privacy.tsx`, add route in `src/App.jsx`, link from `Footer.jsx`. Template boilerplate is fine — the legal requirement is **existence + accessibility + accuracy**, not originality.

### 2. Consent tickbox on every PII-collecting form — **CLIENT DONE 2026-04-21; SERVER LOGGING PENDING**
- **Obligation:** RA 10173 §3(b) + §12(a) — consent must be **freely given, specific, informed, and evidence of it must be demonstrable**. Pre-ticked boxes fail §3(b).
- **UI spec:**
  - Unchecked checkbox above the Submit button: *"I've read the [Privacy Notice](/privacy) and consent to Cybernest processing my data for this booking."*
  - Submit stays disabled until checked.
  - Server records: `consented_at` (ISO timestamp), `privacy_notice_version` (hash or semver of the notice in force), `ip`, `user_agent`.
- **Why evidence matters:** NPC enforcement actions routinely demand proof-of-consent logs. No log = no consent.
- **Action:** wire into `BookingModal.tsx` form state and `Contact.tsx` form state. Server-side: add `consent_log` table to the backend.
- **Client status:** unchecked consent checkbox added to both `BookingModal.tsx` (Summary panel, line ~851) and `Contact.tsx`. Submit buttons are `disabled` until `consented === true`. On booking submit, `consentedAt` (ISO timestamp) + `privacyNoticeVersion` (`"2026-04-21"` from `src/pages/Privacy.tsx` `PRIVACY_NOTICE_VERSION`) are added to the `createAppointment` payload.
- **Still open (server-side):** backend must persist `consentedAt`, `privacyNoticeVersion`, `ip`, `user_agent` in a `consent_log` row alongside the booking. Contact form is still not POSTing anywhere — when that wires up (P1 #6 in SECURITY-todo), thread the same four fields.

### 3. Designate a DPO + publish the contact — **PAGE/LINKS DONE 2026-04-21; MAILBOX PENDING**
- **Obligation:** RA 10173 §21 + NPC Circular 16-01. Applies **regardless of company size or record count**.
- **For a small team:** the founder/CEO can serve as DPO — the law doesn't require a separate hire, it requires a named person with published contact and "sufficient expertise" (which NPC interprets loosely for micro-enterprises).
- **Action:**
  - Set `privacy@cybernestsolution.com` → forwards to you.
  - Publish in: `/privacy` page, `Footer.jsx`, `SECURITY.md` (once created), and in your email signature on any customer thread.
  - Update `index.html:67` Organization JSON-LD to include `"email": "privacy@cybernestsolution.com"` as a second contactPoint with `contactType: "privacy"` — helps Google surface it and demonstrates due diligence.
- **Done 2026-04-21:**
  - ~~`/privacy` DPO section~~ (Section 12) — live.
  - ~~`Footer.jsx` DPO link~~ — "Data Protection Officer" link in new Legal column (`mailto:privacy@cybernestsolution.com`).
  - ~~`SECURITY.md` report channel~~ — present.
  - ~~`index.html` JSON-LD contactPoint~~ — third contactPoint with `contactType: "privacy"` + `email: "privacy@cybernestsolution.com"`.
- **Still open:** provision the `privacy@cybernestsolution.com` mailbox/alias. Without it the DPO channel is cosmetic.

### 4. Track record count for NPC registration threshold
- **Obligation:** NPC Circular 17-01. Registration of the **Data Processing System (DPS)** is mandatory if any of:
  - Processes PI of ≥1,000 individuals (likely your first trigger).
  - Has ≥250 employees.
  - Processes sensitive PI (health, finances, offenses, gov IDs).
  - Is part of the public sector (N/A unless you become a gov contractor processing citizen data — then mandatory regardless of count).
- **Penalty for non-registration:** administrative fines up to **₱5,000,000 per violation** under NPC Circular 2022-01.
- **Action:**
  - Add a one-row "active-contacts count" query to the admin dashboard (doesn't need to be accurate, just ballpark).
  - At 700 records: start the registration paperwork (NPC Online Registration System — takes 2–4 weeks).
  - At 1,000 records: registration must be complete or processing must pause.

### 5. Cookie / analytics disclosure + pre-consent posture
- **Obligation:** PH doesn't have a standalone cookie law, but NPC's interpretation of RA 10173 treats **persistent identifiers (GA4 client ID) as personal information** when combined with IP. Disclosure is required; explicit banner-style consent is best practice, not mandatory — yet.
- **GDPR overlay:** if a single EU visitor books, GDPR Art. 7 + ePrivacy apply → **banner with reject-all option becomes mandatory**.
- **Action (minimum):**
  - List GA4 + its processor (Google LLC) in the Privacy Notice (C0 #1).
  - Enable GA4's "IP Anonymization" (default-on for GA4 but verify in property settings).
  - Disable Google Signals + Ad Features in GA4 admin — reduces your disclosure surface and the consent argument.
- **Action (defensive, if EU traffic appears):** drop in a lightweight consent solution (`cookieconsent` library or Cloudflare's free Zaraz consent) that gates the `gtag('config', ...)` call in `index.html:21` until accepted.

---

## C1 — Government-Sales Readiness (artefacts RFPs require)

### 6. Draft a Data Processing Agreement (DPA) template
- **Obligation:** NPC Circular 16-02 §3. Every govt agency (LGU, DOST, BIR, DTI, LTO, etc.) will require a signed DPA before production access. Must cover: scope of processing, purpose limitation, subcontractor list, security measures, breach-notification SLA, audit rights, termination + data-return clauses.
- **Action:** generate a 3–4 page DPA template from the NPC-published model agreement, keep it in `/docs/dpa-template.pdf` on your site. Turnaround on a sales call: send the PDF, adjust procurement's redlines, sign. Without this artefact you lose a week per deal to template churn.

### 7. Privacy Impact Assessment (PIA) per product
- **Obligation:** NPC Advisory 2017-03. Required for systems processing government-citizen data; strongly recommended even for pure-B2B if PI is involved.
- **Format:** NPC publishes a 10-section template (nature of processing, data flow, risks, mitigations, residual risk, sign-off). 3–6 pages per product is typical at startup-scale.
- **Action:** produce one PIA for the **booking system** first (since it's the live data flow). Store as `/docs/pia-booking-v1.pdf`. Refresh yearly or per major change.

### 8. Data-residency statement — **DONE 2026-04-21**
- **Your stack:** backend on Azure Container Apps `southeastasia` (Singapore); frontend on Vercel (multi-region edge, primary egress likely Hong Kong / Tokyo for PH traffic).
- **Problem:** some LGU/gov RFPs post-2024 require PH-resident data. Without a written residency statement you can't answer the procurement checkbox.
- **Action:** add a one-paragraph "Data Locations" section to `/privacy` listing the regions + the transfer safeguards (Azure's intra-APAC SCCs, Vercel's DPA). When a PH-residency customer appears, quote them a price to migrate to Azure Philippines East (once GA — currently preview) or a PH colo.
- **Done 2026-04-21:** Section 6 "Where your data is stored" in `src/pages/Privacy.tsx` lists Azure Container Apps (Southeast Asia/Singapore), Vercel edge, Google Analytics (US); notes SCCs + DPA coverage; invites PH-resident deployment requests. Answers the RFP checkbox without committing to residency we don't offer yet.

### 9. Accessibility statement + WCAG posture
- **Obligation:** BP 344 (Accessibility Law, 1983) + DICT MC 2024-001 push govt-facing sites toward **WCAG 2.1 Level AA**.
- **Current state:** the SPA already does reasonable things (landmarks, alt text, focus styles, aria-labels in `BookingModal.tsx`). Close to AA, not audited.
- **Action:**
  - Create `/accessibility` page stating the target (WCAG 2.1 AA), the last audit date, the known gaps (be honest — missing gaps = liability), and a feedback email.
  - Run `axe` or `pa11y-ci` once per release; track outstanding issues. (Low effort, high signal.)

### 10. ISO 27001 / SOC-2 — control-mapping only, no cert yet
- **Obligation:** none, until an RFP forces it.
- **Right answer now:** maintain a 1-page `controls.md` mapping your actual practices to ISO 27001 Annex A clauses you already satisfy (access control, encryption in transit, backup, incident response). When the RFP asks, you hand over the map + say *"certification in progress"* — acceptable for early-stage vendors.
- **When to pursue cert:** first deal ≥ ₱3M/year that requires it. Until then, cert cost (~₱500k–1M + auditor retainer) isn't justified.

---

## C2 — Corporate / Commercial Hygiene

### 11. Publish Terms of Service at `/terms`
- **Obligation:** RA 8792 (E-Commerce Act) §6–§8 treat clickwrap / browsewrap as enforceable. Without ToS, contract formation falls back to the Civil Code defaults — you lose limitation-of-liability, IP retention, indemnity, and venue-selection clauses.
- **Must-include:** service description, payment terms (once you charge), IP ownership (Cybernest retains), user obligations, warranty disclaimer, liability cap, governing law (Republic of the Philippines), venue (your HQ city's RTC), modification clause.
- **Action:** draft or buy a template ToS (~₱15–30k for a lawyer-reviewed starter). Link from footer + reference in the booking form's consent text.

### 12. SEC / DTI / BIR disclosure in footer + invoices
- **Obligation:** DTI Administrative Order 15-03-2016 + BIR RR 10-2015 require registered business name + TIN + BIR-registered address on **commercial documents** (invoices, ORs). Not strictly mandated on the website itself, but expected for B2G trust.
- **Action:** add to `Footer.jsx`:
  - `Cybernest Solutions` (registered name as on SEC/DTI)
  - `Reg. No. / SEC CS…` or `DTI BN…`
  - `TIN: XXX-XXX-XXX-XXX`
  - Registered office address.

### 13. Data-retention schedule (written + enforced)
- **Obligation:** RA 10173 §11(e) requires retention only "for as long as necessary". NPC expects a written schedule.
- **Pragmatic schedule:**
  - Booking records: **5 years** after appointment date (commercial statute-of-limitation buffer), then hard-delete.
  - Contact-form messages: **2 years** from last interaction.
  - GA4 data: **14 months** (GA4 default, set explicitly in admin).
  - Consent logs: **lifetime of the relationship + 5 years** (needed as evidence).
- **Action:** document in `/privacy` + add a weekly cron on the backend that purges past-retention rows. Cron matters: unenforced schedule is worse than none (admits awareness without action).

### 14. Breach-notification runbook
- **Obligation:** NPC Circular 16-03. Notification to **NPC within 72 hours** of discovery + notification to affected subjects "without undue delay" for breaches likely to cause serious harm.
- **Runbook contents** (1 page is enough):
  - Who declares an incident (you).
  - Containment checklist (rotate keys, revoke tokens, disable affected endpoint).
  - NPC notification template (NPC publishes the form).
  - Affected-subject email template (what was leaked, when, remediation).
  - Post-mortem owner + deadline (14 days).
- **Why now:** breaches don't wait for you to be ready. A founder-only team discovers a breach Friday night and loses 48h of the 72h window figuring out the form.

---

## C3 — Polish / Future-Proofing

### 15. Employment compliance for when you hire #2
- BIR employer registration, SSS/PhilHealth/Pag-IBIG, DOLE RKS — not website-scope but becomes C0 the day you hire.

### 16. IP assignment agreements for contractors
- Any freelancer touching code without a **signed IP assignment + confidentiality agreement** = your IP is legally theirs. Templatize before the next contractor engagement.

### 17. Trademark the "Cybernest" wordmark
- IPOPHL filing ~₱2,500 + legal fees. Prevents copycats in the govt-tech niche.

### 18. Cybersecurity Act posture (RA 10175 / DICT frameworks)
- If you ever process govt CII (critical info infrastructure) data → DICT cybersecurity baselines apply. Document now that you're not CII so future you doesn't forget.

### 19. PhilGEPS registration (once you pursue gov deals)
- All govt procurements go through PhilGEPS. Registration is free + takes ~2 weeks. Do it before your first RFP.

### 20. E-invoicing readiness (BIR EIS mandate)
- BIR's EIS (Electronic Invoicing System) is rolling out. Not mandatory for you yet (covers large taxpayers + e-commerce ≥ ₱500M), but the architecture for invoice generation should assume EIS-compatible output.

---

## What compliance does **not** require (yet)

- **ISO 27001 / SOC-2 certification** — premature.
- **HIPAA** — you don't touch PHI.
- **PCI-DSS** — you're not processing cards yourself (use Paymongo / Xendit / Stripe and inherit their compliance).
- **NPC registration** — only after crossing the threshold (see C0 #4).
- **CISO / dedicated privacy team** — one founder-DPO is legally sufficient.
- **Annual third-party audit** — NPC doesn't require this for non-CII businesses.

---

## Suggested order of execution

1. **This week:** C0 #1 Privacy Notice + C0 #3 DPO contact + C0 #5 GA4 settings tweak.
2. **This week:** C0 #2 consent tickbox wired to booking + contact forms (before they actually POST).
3. **Next 2 weeks:** C2 #11 ToS + C2 #12 business disclosure in footer.
4. **Before first govt pitch:** C1 #6 DPA template + C1 #7 PIA + C1 #9 accessibility statement.
5. **Before first booking stored:** C2 #13 retention schedule coded + C2 #14 breach runbook written.
6. **Ongoing:** C0 #4 record count tracked; C1 #10 control map updated quarterly.
