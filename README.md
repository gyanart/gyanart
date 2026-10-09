# GyanArt

Founder-led digital growth consultancy website.

## Source structure

- `src/pages/`: the nine primary pages
- `src/experiments/`: four clearly labelled concept projects
- `src/components/`: shared header and footer
- `src/data/site.json`: site-wide settings
- `src/data/pages.json`: page registry, SEO title/description and output path
- `src/styles/site.css`: shared responsive styles
- `src/scripts/main.js`: shared interactions
- `build.js`: generates the static site in `dist/`

## Build locally

Requires Node.js 20 or newer. No third-party packages are required.

```sh
npm run build
```

Then open `dist/index.html` or serve the `dist/` directory with a local static server.

## GitHub build

Every push to `main` runs the GitHub Actions build and stores a `gyanart-static-site` artifact for 14 days. Download and inspect that artifact before uploading it to cPanel. This workflow does **not** deploy to the live site automatically.

## Before public launch

- Replace the placeholder WhatsApp number in `src/data/site.json` and any page links.
- Add real founder photography.
- Replace placeholder social profile URLs.
- Create real Privacy and Terms pages.
- Replace email-based forms with a tested form handler.
- Confirm the canonical domain and update the sitemap.
- Review all page links, metadata, mobile behaviour and performance.
- Review the generated build before publishing.
