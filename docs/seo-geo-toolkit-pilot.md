# GyanArt SEO + GEO skills — single-repository pilot

**Updated:** 22 October 2026  
**Decision:** Keep the reusable skills inside `gyanart/gyanart`; **no separate toolkit repository is necessary**.  
**Scope:** Documentation and agent guidance only; no changes to live pages or indexing.

## How this works, in plain language

An *AI-agent skill* is a set of written instructions that a compatible coding agent can read when handling a relevant task. It is not an SEO plugin, guaranteed traffic service, paid subscription or automatic background monitor.

Two reusable skills live in this repo:

- `.agents/skills/seo-geo-audit/SKILL.md`: how to audit technical SEO, on-page quality and AI-search readability.
- `.agents/skills/local-seo-geo/SKILL.md`: how to review local business content, evidence, page intent and structured data.

The business-specific instructions live in `AGENTS.md` and `.agents/product-marketing.md`. Keeping generic skills separate from GyanArt-specific instructions makes later reuse easier.

**Using ChatGPT:** Say “Use the SEO/GEO workflow in my `gyanart/gyanart` GitHub repository to review [URL/page]. Read the project instructions and skills first. Report issues and a plan before editing; create a PR only if I authorize it.” The skills are not automatically installed as permanent abilities in normal ChatGPT chats.

**Using a compatible coding agent:** Open the repository in that agent; it can discover `AGENTS.md` and potentially `.agents/skills/` depending on product support. No third-party installation is needed for these Markdown instructions. Follow the agent's documentation rather than assuming every agent reads them automatically.

## Free GyanArt workflow

1. Read existing SEO [issue #39](https://github.com/gyanart/gyanart/issues/39), [prioritized backlog](seo-phase1-prioritized-backlog.md), and [keyword/page map](seo-keyword-page-map.md). Do not repeat completed work or manufacture baseline data.
2. Run existing free checks on a local clone: `npm run build`, then `python3 scripts/seo_full_site_qa.py`. Review existing GitHub Actions reports as appropriate; those tests do not establish live Google indexing or crawl success.
3. Use the free Google Search Console website, browser URL checks, [PageSpeed Insights](https://pagespeed.web.dev/), [Rich Results Test](https://search.google.com/test/rich-results), and [Schema.org Validator](https://validator.schema.org/) when relevant.
4. Label findings OBSERVED / INFERRED / NEEDS LIVE CHECK / NOT TESTED. Show business impact, evidence and acceptance criteria. Prioritize qualified website-design enquiries.
5. Propose only narrow website edits in a separate branch/PR with tests. **Don't merge or deploy without explicit approval.** `main` triggers cPanel/FTP deployment even for a documentation-only merge.
6. Verify deployed changes with actual live HTTP/browser inspection and compare equal, nonoverlapping GSC periods. GA4 key-event counts are not automatically unique leads.

## GyanArt-specific guardrails

- Scope: website design, local SEO and GBP optimization. Logo design belongs to Logoex, UX consulting to UXGyan. Don't remove legacy pages without a separate business decision.
- Preserve English/Hindi/Kannada structures and intentionally noindexed experiment pages.
- Reuse existing robots/sitemap generation and `llms.txt` / `llms-full.txt`; do not create duplicates for a vendor GEO score.
- No paid SaaS, licensed SEO APIs, direct publishing, unverified testimonials or fabricated results.

## Reuse for future client projects (later, not now)

No new central GitHub repository is needed. When a new site is ready:

1. Create/use **that client's own website repository**.
2. Copy only the **two generic `SKILL.md` folders** from GyanArt's `.agents/skills/` into the new project's `.agents/skills/`.
3. Fill out `docs/templates/seo-geo-project-profile.md` for that business; create/update its own `AGENTS.md` with project-specific instructions.
4. Check the new project's build, CMS, languages, deployment and testing systems. **Do not copy GyanArt's actual site-specific scripts or marketing facts** without adaptation.
5. Start with a read-only audit. Any content or code changes need a separate review and approval.

This is a reusable method, not a promise of AI citation or search rankings.

References: https://developers.google.com/search/docs/appearance/ai-features ; https://developers.google.com/search/docs/appearance/structured-data/sd-policies
