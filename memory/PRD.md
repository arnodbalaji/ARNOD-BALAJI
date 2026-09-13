# PRD — Shri Sankat Haran Balaji Maharaj Mandir Website

## Original Problem Statement
Premium, modern techy-spiritual website for **Shri Sankat Haran Balaji Maharaj Mandir, Arnod, Pratapgarh District, Rajasthan**. Ancient Hindu spirituality redesigned for the modern digital world: saffron/maroon/gold/ivory/charcoal palette, Devanagari + modern English typography, divine particles, mandala patterns, real user-provided murti + sant photos (never AI-replaced), live Panchang, festival calendar, Live Darshan via Instagram, configurable Seva/Donation (no fake payment info), Google Maps directions, contact sevaks, fully responsive, SEO-ready, one central config file.

## User Personas
- Local devotees checking aarti/darshan timings and panchang on mobile
- Out-of-town visitors needing directions to Arnod
- Devotees watching live aarti on Instagram / YouTube
- Donors wanting official seva/payment details
- Temple committee member editing content via one config file

## Architecture
- **Frontend**: React 19 (CRA/craco), Tailwind, framer-motion (masked hero reveals, scroll reveals), lenis smooth scrolling, canvas divine-ember particles, custom mandala SVG.
- **Backend**: FastAPI + pyswisseph (Swiss Ephemeris, Lahiri ayanamsa) computing live Panchang server-side (no external API key, no downtime risk). Endpoints: `GET /api/panchang?date=`, `GET /api/panchang/month?year=&month=`.
- **Central config**: `/app/frontend/src/config/mandirConfig.js` — names, address, Maps/Instagram/YouTube URLs, live toggle, schedule times, festivals, explore chapters, sant names/photos, contacts, bank/UPI/QR fields.
- Design blueprint: `/app/design_guidelines.json`.

## Core Requirements (static)
1. Immersive hero with REAL murti photo as centerpiece + divine glow (done)
2. Sticky nav + mobile hamburger + Live Darshan button (done)
3. Explore Mandir numbered chapters, editable placeholder content (done)
4. Mandir Schedule timeline, times from config (done)
5. Live Panchang (tithi/nakshatra/yoga/karana/paksha/month/samvat/sunrise/sunset/rahukaal/choghadiya) + navigable Hindu calendar with Purnima/Amavasya/Ekadashi highlights (done)
6. Upcoming festivals cards + View All (done)
7. Live Darshan status card w/ configurable isLive toggle → Instagram link (done)
8. YouTube channel card (done)
9. Instagram connect section (done)
10. Seva/Donation with QR-coming-soon + configurable bank fields + security note (done)
11. Get Directions (configurable Maps URL, no invented coordinates) (done)
12. संतों का आशीर्वाद — two real sant portrait cards with golden frames (done)
13. Contact — Kush Soni 7023526965, Rishabh Jain 9352772101, call + WhatsApp (done)
14. Premium dark footer with links + जय श्री बालाजी महाराज (done)
15. Responsive (verified desktop 1920 + mobile 390) (done)
16. SEO meta/OG tags (done)

## Implemented (with dates)
- 2026-09-10: Full v1 site — all 16 core requirements, live Swiss-Ephemeris panchang engine, lenis + framer-motion motion system, real photos integrated, verified end-to-end (curl + screenshots desktop/mobile).
- 2026-09-11: Real IG/YT links, sant 2 name (Swami Avdheshanand Giri Ji), real aarti timings, history chapter, sants moved below hero, 8 music/streaming platform cards with brand icons + footer icon row, real-time festival dates API (`/api/festivals/upcoming`, tithi-matched from panchang engine), Sant Darshan nav tab.
- 2026-09-13: 140-sant gallery (पूज्य संत परंपरा, expandable); **Sanatan Gyan Mitra chatbot** — floating ॐ button, GPT-5.4 via EMERGENT_LLM_KEY, SSE streaming, Mongo chat history, persona: Vedas/Upanishads/Puranas/Gita scholar, Hindi-first.
- 2026-09-13: **Shloka of the Day** (AI-generated daily, cached in Mongo per date, Gita/Hanuman Chalisa rotation, static fallback) below hero marquee. **Owner login** at /admin (JWT + bcrypt, seeded owner, 5-attempt lockout) with Seva/UPI settings panel → published instantly to public Seva section (GET /api/seva merged over config). QR file upload via Emergent object storage (`POST /api/admin/qr-upload`, public `GET /api/files/...` for QR paths only), in-panel change-password with seed marker so panel passwords survive restarts. Owner password rotated to SankatHaran@Seva#108. **Owner CMS**: GET/PUT `/api/settings` (live toggle, links IG/YT/Maps, aarti schedule times, pinnedVideos) consumed site-wide via `useSettings` hook. YouTube live playlists via public RSS (`/api/media/youtube`, both channels, 30-min cache) with on-site click-to-play modal + pinned videos first. Chatbot voice input (browser SpeechRecognition, hi-IN).

## Pending User Inputs (P0)
- Instagram profile URL ✅ (2026-09-10: instagram.com/srisankatharanbalajimaharaj), YouTube channel URL ✅ (youtube.com/@sankatharanbalaji)
- Official Google Maps share link (currently a maps search link in `mandirConfig.js`)
- Name & title of the second (younger) sant — photo has no text; currently "पूज्य संत श्री" placeholder
- Sant photos ✅ (2026-09-13: 140 sant/bhakt images in पूज्य संत परंपरा gallery, names from user's filenames, served from /public/sants)
- Actual aarti timings ✅ (6 AM darshan, 7 AM aarti, all-day open, 8 PM shayan)
- Official UPI QR image + bank details (empty by design)
- Google Maps exact share link (search link in use)

## Backlog
- P1: Instagram reels embeds — send reel links to populate `instagramReels` in config (section ready, shows CTA until then)
- ~~P1: Temple history section~~ ✅ DONE 2026-09-11 (स्वयंभू बालाजी, संत जगन्नाथ जी आगमन, चमत्कारों की आस्था, आस्था का पवित्र धाम)
- P1: Festival dates auto-derived from panchang engine (currently editable static list)
- P2: Photo gallery of mandir events
- P2: Hindi/English language toggle
- P2: Sitemap.xml + robots.txt for SEO

## Next Tasks
1. Paste real Instagram/YouTube/Maps links → update config
2. Provide sant 2 name/title + schedule times
3. Provide official QR/bank details when ready
