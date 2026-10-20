# GyanArt

Founder-led digital growth consultancy website.

## Source structure

- `src/pages/`: static website page content
- `src/experiments/`: clearly labelled concept projects
- `src/components/`: shared header and footer
- `src/data/site.json`: site-wide settings
- `src/data/pages.json`: page registry, SEO title/description and output path
- `src/styles/site.css`: shared responsive styles
- `src/scripts/main.js`: shared interactions
- `build.js`: generates the static site in `dist/`
- `content/`: AI-assisted editorial workflow, topic backlog, prompts, checklists and unpublished Markdown drafts

## Build locally

Requires Node.js 20 or newer. No third-party packages are required.

```sh
npm run build
npm run check:content
```

Then open `dist/index.html` or serve the `dist/` directory with a local static server.

## AI-assisted content workflow

Read [content/README.md](content/README.md). Drafts in `content/articles/` are not included in the website build. The GitHub Actions editorial check validates required metadata and basic readiness; it does not fact-check articles or approve publication. Every article requires explicit human approval before it is moved into `src/pages/` and registered for publication.

## GitHub deployment boundary

The current FTP workflow is configured to upload the preview build to the restricted cPanel account mapped to `public_html/gyanart_v1/`. Production root must remain untouched. Do not change deployment targets or merge website publishing changes without explicit go-live approval.

## Before public launch

- Replace the placeholder WhatsApp number in `src/data/site.json` and any page links.
- Add real founder photography.
- Replace placeholder social profile URLs.
- Review legal pages, contact forms and data handling.
- Confirm the canonical domain and update the sitemap.
- Review all page links, metadata, mobile behaviour and performance.
- Review the generated build before publishing.
