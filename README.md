# cybernest-website

Marketing site for [Cybernest Solutions](https://www.cybernestsolution.com)
— built with React + Vite, deployed on Vercel.

## Development

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build
npm run lint      # run ESLint
```

## Security & configuration

This project uses `VITE_*` environment variables for **non-secret**
configuration only. Anything prefixed `VITE_` is inlined into the client
JS bundle at build time and is visible to every visitor — treat it as
public. Real secrets (API keys, upstream credentials) live in Vercel
environment variables and are accessed server-side via the `/api/*`
Vercel serverless functions (see `api/book/[...path].ts` for the pattern).

**Never commit `.env`.** Copy `.env.example` to `.env.local` for local
development. The site's security policy and reporting channel are in
[`SECURITY.md`](./SECURITY.md).

## Notes

- React Router v7, TailwindCSS, react-helmet-async for SEO.
- The booking flow (`src/services/bookingService.ts`, `BookingModal`) is
  gated behind `VITE_BOOKING_ENABLED` while the secure booking path is
  being finalised — see `SECURITY-todo.md`.
