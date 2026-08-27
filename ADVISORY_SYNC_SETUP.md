# Fixing "Safety Advisory not visible to visitors" on Netlify

## Why it was broken
Advisories (and everything else) were saved only to `localStorage`,
which is private to a single browser on a single device. An admin
sending an advisory saved it to *their own browser*, never to
anything visitors on other devices could read. It only ever looked
like it worked when testing in two tabs of the same browser.

## What changed
- `netlify/functions/advisories.js` — a serverless function backed by
  **Netlify Blobs** (built into Netlify, no external account needed).
  It handles:
  - `GET /api/advisories` — returns the current list (public, read-only)
  - `POST /api/advisories` — adds a new advisory (requires the admin key)
  - `DELETE /api/advisories` — removes one (requires the admin key)
- `script.js` now calls this API instead of only using `localStorage`:
  - Every visitor's page polls `GET /api/advisories` every 15 seconds,
    so new advisories appear on all devices, not just the admin's.
  - `localStorage` is still used as a local cache so the page has
    something to show instantly before the first poll completes.
- The admin login modal now has an extra **"Advisory API Key"** field.
  This key is sent as a header (`x-admin-key`) on write requests and is
  checked against a Netlify environment variable — it is never shipped
  inside `script.js`, unlike the existing admin username/password.

## Deploy steps
1. Push these files to the repo Netlify builds from (the `netlify/
   functions/` folder and `netlify.toml` and `package.json` all need to
   be at the repo root alongside `index.html`).
2. In the Netlify dashboard for this site: **Site configuration →
   Environment variables** → add a variable:
   - Key: `ADMIN_API_KEY`
   - Value: any secret string you choose (e.g. a long random password)
3. Deploy (or trigger a new deploy so the env var takes effect and the
   function gets bundled — Netlify installs `@netlify/blobs` from
   `package.json` automatically).
4. Netlify Blobs requires no extra setup or account — it's automatically
   available to functions on any Netlify site.
5. When logging into the admin panel on the live site, enter the same
   value in "Advisory API Key" that you set as `ADMIN_API_KEY`. Only
   people who know that key can send or remove advisories; anyone can
   still read them (as intended — that's how visitors see them).

## Worth knowing
The existing admin username/password (`admin` / `12345`) are still
hardcoded in `script.js` and visible to anyone via "view source" on the
live site — that login only gates the UI, not the API. The new
`ADMIN_API_KEY` check is what actually protects the write endpoint. If
you want the login itself to be secure too (not just the broadcast
endpoint), that needs real server-side authentication, which is a
separate, bigger change from what was asked here.

## If you want zones/incidents to sync across devices too
The same `localStorage`-only pattern is used for monitored zones,
incident reports, and geofence events — they have the identical
cross-device limitation. This fix only covers advisories since that's
what was reported, but the same Blobs + Function approach would work
for those too if you want it.
