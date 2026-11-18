# Anita Jewellery — GitHub Pages site

Public shop site for **Anita Jewellery** (readymade gold-plated / imitation jewellery).

- **Showcase:** products load live from the Google Sheet via the shop's Apps Script
  (`?action=products`). Out-of-stock products are hidden automatically.
- **Bookings:** every product has a *Book on WhatsApp* button to +91 8014998953 (manual, no automation).
- **Staff Desk** (bottom-right button, device PIN): add products (photo uploads to the
  Drive folder, row added to the Products tab), mark products in/out of stock,
  and generate receipts (print / WhatsApp; syncs to the Receipts tab). No GST.
- **Installable:** on Android, open in Chrome → menu → *Add to Home screen* to use it like an app.

## Files
- `index.html` — the whole site (showcase + staff desk)
- `manifest.webmanifest`, `sw.js`, `icon.svg` — PWA install support
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Hosting
This repo is `anitajewellery/anitajewellery.github.io`, so GitHub Pages serves it at
https://anitajewellery.github.io with no extra configuration.
