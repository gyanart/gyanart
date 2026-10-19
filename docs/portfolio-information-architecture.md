# GyanArt portfolio: information architecture and publication plan

**Status:** Proposed navigation and content architecture; no live page added yet.
**Parent tracker:** https://github.com/gyanart/gyanart/issues/46
**First featured project:** Mayura Cafe and Food Court (genuine owner-involved business website, public design preview, ongoing)

## Recommended navigation

Keep the difference between actual business work and hypothetical concepts obvious. Place a prominent **Our Work** link in the primary navigation, ideally replacing top-level **Growth Experiments** so the mobile/desktop navigation does not become crowded; preserve Growth Experiments under the relevant collection/footer, clearly labelled **fictional/concept**.

Suggested routes:
- `/portfolio.html` — portfolio index ("Our Work").
- `/case-studies/mayura-cafe.html` — detailed Mayura case study.
- `/website-design.html` — contextual link to Mayura as a concrete demonstration of the design process.
- `/` — a **Featured Project: Mayura Cafe and Food Court** teaser **before** the four fictional concept experiments.
- GyanArt footer — **Our Work** link.
- `/hi/portfolio.html`, `/kn/portfolio.html` and equivalent localized case-study content or clearly presented language fallbacks, avoiding misleading reciprocal hreflang.

## Portfolio index

Make `portfolio.html` useful from the first project instead of inventing multiple client projects:
- Title: **Website Design Work & Case Studies**.
- Intro: Real work on business goals, content structure, responsive design and measurable validation.
- Featured project: **Mayura Cafe and Food Court — Restaurant website design**.
- Status: **Live design preview / in progress**.
- Scope: Discovery, UX framing, IA, visual iterations, responsive front-end development, technical deployment checks.
- Link to detailed Mayura case study + clearly labelled external site preview.
- A *separate* row or link to **Growth Experiments (concepts, not clients)**.

## Detailed Mayura case-study page

Sections drawn from `docs/portfolio-mayura-case-study-draft.md`:
1. Hero — real business, role, location, scope, current in-progress status.
2. The problem — accurate visit-first customer journey from discovery to Maps navigation.
3. Stakeholder discovery and explicit evidence boundaries (D01–D07).
4. Proposed user journey and IA; list menu categories as text only.
5. Evolution V1 → V2 → V2.1 → V2.2 (including actual accepted photo-gradient revision), with own screenshots/rights-approved assets.
6. Implementation and authentic QA proof (Chromium responsive screens, GitHub/FTP, HTTPS 200 and deployed gradient).
7. Honest current outcome: live **design preview**, not the official restaurant launch or measured increased footfall.
8. Next tests / remaining approvals, link to live Mayura design preview and prominent GyanArt website-design enquiry CTA.

## Nonnegotiable editorial rules

- Show only genuine work; no invented reviews, clients, Google ranking lifts, restaurant footfall or conversion gains.
- User explicitly prohibited publishing any of **12 Google Maps menu screenshots**; use only menu dish/pricing facts in text, provisionally.
- Generated food graphics must be labelled illustrative, not presented as actual dishes photographed at Mayura. Recheck underlying rights of storefront/dosa photo files before publishing screenshots.
- The live Mayura site currently remains `noindex,nofollow`, and carries a visible preview banner; do not call it an official finished restaurant launch.
- Confirm owner permission specifically for the final portfolio screenshots and textual narrative. Prior reported permission to showcase is available, but final editorial sign-off remains outstanding.
- Fix inaccurate legacy text in preexisting Mayura secondary pages before claiming the entire site is completed.

## Implementation and QA gate

- Add generator `pages.json` entries and English/Hindi/Kannada equivalents intentionally; handle deep URL prefixes and breadcrumb labels in `build.js`.
- Add shared navigation/footer links, homepage feature, Website Design contextual CTA, and responsive CSS.
- Make schema and canonical values describe the actual page; include in sitemap only indexable published pages.
- Run `npm run build` and `scripts/seo_full_site_qa.py`, test EN/HI/KN switcher and mobile interaction, check imagery rights.
- Stage branch/PR → review actual screenshots → merge → FTP deploy → live HTTP/SEO verification.
- Check off Phase 2 Issue #46 Step 1 publication only once actual GyanArt URLs are live and verified.

**Approval state:** This document describes the proposed location and layout of the case study. It is not an announcement that GyanArt pages have been published.
