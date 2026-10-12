# GyanArt AI-assisted editorial workflow

This folder is the private working area for content planning and review. Files here are **not part of the website build** and cannot be published by the normal static-site build.

## Repeatable workflow

1. **Choose a business problem** — prioritise questions asked by local service businesses, especially Bangalore home-service businesses, and topics connected to GyanArt services.
2. **Research** — use current search results and primary sources. Record source URLs, what each source supports, date checked, and any uncertainty. Do not invent search volumes, ranking data, statistics, customer results, quotes, or case studies.
3. **Prepare a brief** — define the audience, intent, primary question, useful answer, unique angle, target keyword, related terms, and the service page that the article should support.
4. **Draft with AI** — use `templates/ai-prompts.md`. Give the model the brief and verified source notes; do not ask it to make up research.
5. **Fact-check and edit** — open every source; verify names, claims, numbers, dates, recommendations, and links. Add original judgement, examples, screenshots or a checklist where possible.
6. **SEO and UX review** — use `checklists/pre-publish.md`. Write for the reader, not a keyword-density target. Add relevant internal links to real GyanArt pages.
7. **Run automated checks** — GitHub Actions validates article metadata and basic readiness. A passing check is not factual approval.
8. **Request approval** — set status to `review`, commit to a branch, and open a pull request. Review the article and changes before approving.
9. **Publish deliberately** — only after explicit approval, create the production article under `src/pages/`, register it in `src/data/pages.json`, add it to `src/pages/insights.html`, and update `src/sitemap.xml` with the canonical URL. Check links and metadata in the generated build. Do not merge/publish unless Gyaneshwar explicitly approves.
10. **Measure and refresh** — after publication, record the URL and publish date; review Search Console and analytics after indexing and periodically update outdated material.

## Where files go

- `editorial-calendar.csv`: initial topic backlog.
- `templates/article-brief.md`: research and planning.
- `templates/ai-prompts.md`: reusable prompts for research, drafting and audits.
- `checklists/pre-publish.md`: manual editorial, SEO, UX and approval checks.
- `articles/*.md`: working drafts and review-ready articles. This folder is not included in the website build.

## Article states

- `idea`: a possible topic, not researched.
- `research`: gather sources and evidence.
- `draft`: first draft, not ready to publish.
- `review`: author believes it is ready for human review.
- `approved`: explicit human approval recorded; publication still requires a separate deliberate change to the website source.

## Suggested cadence

Start with two substantial articles per week. Do not publish filler to meet a quota. A useful, well-evidenced article is better than several generic AI rewrites.

## Safety and publishing boundaries

- Do not put credentials, private customer data, or confidential information into AI prompts.
- Do not claim that a business improved rankings, leads, or revenue without evidence and permission.
- Label concepts as examples; never present them as client case studies.
- Do not auto-publish content from an AI output.
- Production must remain untouched during development. Website changes should go through the established preview workflow and be reviewed before any separate go-live decision.
