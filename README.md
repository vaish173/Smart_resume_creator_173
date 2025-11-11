# VanConnect (VTS) - React + Vite PWA scaffold

This project provides a minimal React + Vite scaffold that wraps your existing static frontend and adds basic PWA and Supabase wiring.

Quick start

1. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Install dependencies:

```powershell
cd "c:\Users\Vaishnavi.V\OneDrive\Desktop\VTS"
npm install
```

3. Run dev server:

```powershell
npm run dev
```

Notes

- This scaffold includes a simple Supabase client at `src/supabaseClient.js` and example pages under `src/pages` created from your existing HTML.
- Add your Supabase project keys to `.env.local` and replace any placeholder content.
- For a full production PWA experience you can replace the simple service worker with `vite-plugin-pwa` later.
