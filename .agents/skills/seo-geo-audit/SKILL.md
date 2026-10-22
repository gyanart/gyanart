---
name: seo-geo-audit
description: Run an evidence-based website SEO and GEO audit, including crawlability, indexing, on-page quality, schema, AI-search readability and prioritized actions. Use for SEO audits, GEO checks, technical SEO or search visibility diagnostics.
---

# Reusable SEO + GEO audit workflow

This skill can be copied to another website repository. **Always follow the target project's instructions first**; do not copy GyanArt business facts, languages, URLs or deployment rules into unrelated projects.

1. Read the target repo's `AGENTS.md`, business profile (`.agents/product-marketing.md` when present), SEO backlog, keyword/page map and existing validation scripts. For GyanArt specifically, use issue #39 and `docs/seo-phase1-prioritized-backlog.md`.
2. Establish business objective, priority customers, location, approved pages, lead goals, source-of-truth domain, and available performance data. Never assume a local ranking or citation.
3. Prefer existing free, read-only validators over adding duplicate software. In GyanArt, start with `npm run build` and `python3 scripts/seo_full_site_qa.py`. For other projects, discover available build/test commands and ask before adding dependencies.
4. Check live HTTP and Search Console evidence where accessible, then crawl rules, sitemap, canonical/noindex, redirects, mobile performance, language alternates (when applicable), titles/descriptions/headings, internal links, readable service information and factual JSON-LD.
5. GEO audit: verify important answers are available in human-readable HTML, written for real questions, consistent with verified business facts, supported with genuine evidence and accessible to relevant crawlers. Do not fabricate proof or treat an arbitrary readiness score as a ranking predictor.
6. For each finding, capture URL/path, dated source, state (OBSERVED / INFERRED / NEEDS LIVE CHECK / NOT TESTED), importance, specific action, owner and acceptance criteria. Failed tool access is not proof of website failure.
7. Only recommend markup eligible under current Google documentation. A site's `llms.txt` is not a documented special requirement for Google AI features.
8. Make changes only after review, on a dedicated branch and PR. **Never merge or deploy without the project's required approval.** Verify live behavior separately and compare equal-length Search Console periods and actual leads.

Reference: https://developers.google.com/search/docs/appearance/ai-features
