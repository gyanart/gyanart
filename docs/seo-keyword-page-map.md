# GyanArt keyword-to-page map and landing-page optimisation

**Scope:** GyanArt focuses on website design, Local SEO and Google Business Profile optimization for small businesses in Bangalore. Logo design belongs to LogoEx and is excluded from GyanArt's primary SEO strategy.

## Evidence and limits

The 11–17 October 2026 Search Console baseline is a very small sample: `website designer bangalore` had **4 impressions**, **0 clicks**, and **average position 4.25**. The earlier 11–14 October snapshot had 3 impressions and average position 5.33; these overlapping snapshots should not be treated as a trend. The Pages export includes HTTP/HTTPS and tracking-parameter variants, so its counts should not be treated as clean canonical-page performance. Use this as an initial intent map, not as proof of search demand or a statistically meaningful ranking trend. Revisit it after more canonical HTTPS data accumulates.

**Positioning approved 18 October 2026:** Website Design is GyanArt’s primary service, with Local SEO and Google Business Profile as complementary services. The homepage is the main target for the local website-designer query cluster in all three languages. This is a strategic assignment, not proof of search volume or ranking outcomes.

## Primary keyword-to-page map

| Page | Primary intent / target phrase | Secondary themes | Page role and next action |
|---|---|---|---|
| `/`, `/hi/`, `/kn/` | **website designer Bangalore**; website design Bangalore (translated naturally on Hindi/Kannada homepages) | small-business website design; local SEO and Google Business Profile as complementary services | **Primary commercial homepage** for a Bangalore website designer. Point buyers to the detailed website-design service and audit. Do not copy this homepage primary intent unchanged into the service page. |
| `/website-design.html`, `/hi/website-design.html`, `/kn/website-design.html` | **small-business website design services and process** | what is included, mobile-friendly website design, redesign, enquiry paths, pricing | Detailed supporting service page for users evaluating delivery and scope, linked from the commercial homepage. Avoid duplicating the homepage’s exact target phrase as a separate competing landing page. |
| `/local-seo-services.html` | Local SEO services Bangalore | local search optimization, local business SEO, local search visibility | Main Local SEO landing page. Explain website/service-page signals and link to Google Business Profile optimization. |
| `/google-business-profile-optimization.html` | Google Business Profile optimization Bangalore | Google Maps optimization, Google Business Profile help, Google business listing | Main GBP landing page. Keep claims accurate; explain profile accuracy, services, photos, reviews and measurement without promising rankings. |
| `/pricing.html` | website design packages Bangalore; small business website cost Bangalore | website design price, website setup cost, monthly website support | Commercial comparison page. Make package scope and exclusions easy to compare; link to website design and FAQs. |
| `/faqs.html` | small business website cost; Local SEO FAQs; Google Business Profile FAQs | website project preparation, SEO timelines, website redesign | Informational support page. Answer real objections and route visitors to the matching service or pricing page. |
| `/growth-audit.html` | free website audit Bangalore; Google Business Profile audit | website improvement review, online presence audit | Conversion page, not the main ranking target for the service keywords. Keep the promise and deliverables specific. |
| `/dental-clinics.html` | website design and Local SEO for dental clinics Bangalore | dental clinic Google Business Profile, dental clinic appointment enquiries | Vertical campaign landing page. Keep it focused on website, Local SEO and GBP; distinguish illustrative claims from proven results. |

## Internal-link rules

1. Use descriptive anchors that match the destination naturally (for example, “website design for small businesses” to `website-design.html`, “Local SEO services” to `local-seo-services.html`, and “Google Business Profile optimization” to its service page).
2. From pricing and FAQs, link to the most relevant service page and to the growth audit when a visitor needs help choosing.
3. From each service page, provide a useful next step: pricing, a related core service, or the growth audit.
4. Avoid repeating exact-match anchors unnaturally or adding links solely to repeat keywords.
5. Keep concepts/experiments marked noindex unless a separate decision is made to publish them as substantive search landing pages.
6. GyanArt's core SEO scope excludes logo design; keep logo-design keywords and service promotion on LogoEx rather than the GyanArt FAQ or service funnel.

## Measurement plan

- In Search Console, compare canonical HTTPS URLs only and review query/page pairs over a rolling 28-day period; small daily samples are too noisy.
- Track impressions, clicks, CTR and average position for the target clusters above. Use GA4/lead tracking to assess qualified calls, WhatsApp messages and forms, not rankings alone.
- After publishing changes, inspect the deployed canonical URL and sitemap, then request indexing only for materially updated canonical pages. Do not repeatedly request indexing for unchanged pages.
- First priority for content iteration: the homepage for website-designer intent, the detailed website-design service, and the Local SEO and Google Business Profile pages. Use query data to refine headings and copy only when Search Console begins showing relevant impressions; do not infer demand from the current four impressions alone.


## Local SEO & Schema Implementation (October 2026)

### Verified Business Profile & Geocoordinates
- **Google Business Profile:** [Gyanart Web Design on Google Maps](https://maps.app.goo.gl/QYAzaKxRDyMyX7RA6)
- **Studio Address:** A107, Hilife Pearl Shell, Balagere Road, Varthur, Bengaluru, Karnataka 560087
- **Exact Coordinates:** Latitude `12.9395061`, Longitude `77.7299794`
- **Primary Direct WhatsApp:** `+91 98802 08870` (`919880208870`)

### Structured Data Architecture
- **Global Schema:** Upgraded from generic `Organization` to `ProfessionalService` (inherits from `LocalBusiness`), incorporating full NAP (Name, Address, Phone), precise coordinates, price range (`₹10,000 - ₹37,000`), map link, and multi-locality `areaServed` coverage (Varthur, Balagere, Marathahalli, Whitefield, HSR Layout, Koramangala, Indiranagar, BTM Layout, Bellandur).
- **FAQPage Schema:** Added to `website-design.html` and `faqs.html` to capture Google rich snippet accordions in SERPs.

### Mobile Lead-Capture Triggers
- Floating sticky WhatsApp button (`.whatsapp-float`) enabled across all viewport sizes with pre-filled enquiry text, configured so it never collides with `.back-to-top`.
