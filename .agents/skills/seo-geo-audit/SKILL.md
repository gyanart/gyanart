---
name: seo-geo-audit
description: Audit GyanArt technical SEO and AI-search readiness, source/CI validation, real-world indexing gaps, and prioritization. Use for SEO audit, GEO audit, crawler access, structured data, and search quality checks.
---

# GyanArt SEO + GEO audit workflow

1. Read `AGENTS.md`, `docs/seo-phase1-prioritized-backlog.md`, `docs/seo-keyword-page-map.md`, issue #39 and existing source QA scripts.
2. Preserve the scope: website design, local SEO and GBP optimization for Bengaluru small-business leads; avoid creating pages that compete for identical keyword intent.
3. Use read-only source inspection and `npm run build`, then `python3 scripts/seo_full_site_qa.py`; other existing scripts should be used when relevant. Their report is build evidence, not live website evidence.
4. Audit in priority order: GSC indexing and HTTP reachability; robots/sitemap; canonicals/noindex; mobile and performance; en/hi/kn hreflang; titles/descriptions/H1; internal links; valid truthful JSON-LD; content quality.
5. An error requires a URL or source path, collection date, source, status (OBSERVED/INFERRED/NEEDS LIVE CHECK), business impact, recommended fix, and acceptance criteria. Don't assume a server issue from a failed tool request.
6. GEO review: check whether service explanations clearly answer likely local buyer questions, cite only reliable factual proof, and make contact easy. No artificial “AI-optimized” keyword stuffing or universal GEO score claims.
7. Confirm current eligibility of Google rich results in official docs; `llms.txt` is not a documented special Google AI Search requirement.
8. Propose focused fixes through a branch/PR. Never merge or claim deployment without approval. After a deployment, collect independent live HTTP checks and comparable GSC/GA4/verified enquiry evidence.

Reference: https://developers.google.com/search/docs/appearance/ai-features
