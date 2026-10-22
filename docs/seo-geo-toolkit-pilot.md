# GyanArt pilot — reusable SEO/GEO agent skills

**Created:** 22 October 2026  
**Scope:** Agent instructions, not a new SEO campaign or a live-site content change.

## Why this exists

A consistent read-only-to-PR workflow helps reuse SEO and generative-engine-optimization (GEO) quality checks across GyanArt and future client sites without paying for SEO software or API licenses. This pilot contains original, tailored skill instructions rather than automatically importing or executing third-party packages.

## Installed in this proposal branch

- `AGENTS.md`: project-specific positioning, safeguards, review and deployment gates.
- `.agents/skills/seo-geo-audit/SKILL.md`: audit and evidence playbook.
- `.agents/skills/local-seo-geo/SKILL.md`: local business content review playbook.
- `.agents/product-marketing.md`: stable business context consumed by the skills.

Agents that support the Agent Skills format can discover the skills. Ordinary ChatGPT chats do **not** automatically install these as account-wide executable skills; refer to this repository or the standalone toolkit when requesting future work.

## Free execution sequence

1. Check existing issue [#39](https://github.com/gyanart/gyanart/issues/39) and [prioritized backlog](seo-phase1-prioritized-backlog.md); don't duplicate completed work.
2. For code checks, run `npm run build` and `python3 scripts/seo_full_site_qa.py` in the GyanArt checkout. This site already has extensive SEO and multilingual QA. Optional generic offline auditor in the standalone toolkit only adds a portable fallback for future sites.
3. Inspect Search Console using its free web interface (dated data), live URLs in a browser, and [PageSpeed Insights](https://pagespeed.web.dev/) as needed. Validate schema with [Rich Results Test](https://search.google.com/test/rich-results) or [Schema.org Validator](https://validator.schema.org/).
4. Record evidence with statuses OBSERVED/INFERRED/NEEDS LIVE CHECK. Prioritize qualified website-design enquiries, not vanity GEO scores.
5. Propose narrowly scoped website changes in later separate PRs; don't merge the pilot PR or claim it is deployed without explicit approval.
6. Compare equal-length, nonoverlapping GSC reporting windows; distinguish GA4 key events from unique real enquiries.

## GyanArt-specific exclusions

- Keep targeting to website design, local SEO and GBP optimization (not Logoex/UXGyan services).
- Keep English/Hindi/Kannada structure intact.
- Existing robots/sitemap and `llms.txt` files already exist; don't regenerate them just for a third-party score.
- A GitHub build is not proof of live HTTP status, indexing or results. The FTP deployment is triggered by pushes to main, so leave this pull request unmerged pending review.

## Future client sites

The standalone `seo-geo-toolkit` starter ZIP contains general skills, a dependency-free static HTML audit script with tests, measurement templates, and a project profile. A separate GitHub repository can host it after repository creation is made available. Each client then gets its own project profile without carrying GyanArt-specific rules.

Sources: https://developers.google.com/search/docs/appearance/ai-features ; https://developers.google.com/search/docs/appearance/structured-data/sd-policies .
