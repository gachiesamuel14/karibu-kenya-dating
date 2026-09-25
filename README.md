# Karibu — Location-based matchmaking for Kenya

Karibu is a web app that helps people in Kenya find each other by **distance and county**, not just photos.

Live (Netlify): https://karibu-kenya-dating.netlify.app  
Repo: https://github.com/gachiesamuel14/karibu-kenya-dating

## What this MVP includes

- Registration / login (demo accounts stored in the browser)
- Profile setup: photos, age, bio, interests, county, tribe, religion, lifestyle mode
- Browser GPS + county fallback
- Nearby ranking with the Haversine formula
- Swipe / like / pass + mutual matches
- Filters: county, distance, age, tribe, religion, interests, Student / Professional / Church modes
- In-app chat (local, instant)
- Report & block
- Premium + mock M-Pesa checkout (KSh)

This is a **frontend MVP**. Auth, chat, photos, and matches persist in `localStorage` so you can demo the full flow without a server.

## Deploy on Netlify from GitHub

1. Import `gachiesamuel14/karibu-kenya-dating` in Netlify
2. Publish directory: `.`
3. Deploy

Site ID: `785ed823-83a5-42cf-bd39-7d816f144138`
