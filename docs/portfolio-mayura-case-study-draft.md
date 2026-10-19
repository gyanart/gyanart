# Mayura Cafe and Food Court — Designing a clearer journey from discovery to visit

**A genuine local-business website design project by GyanArt**  
**Status:** Public design preview; project in progress, final owner sign-off and official launch pending  
**Location:** Nagarbhavi, Bengaluru  
**Project period:** October 2026–ongoing  
**Preview:** https://mayuracafe.gyanart.com/ (publicly accessible design preview; not yet the final official launch)

> **Publication note for GyanArt:** This is draft editorial copy. Do not describe the work as a completed client launch, award, measured SEO success or demonstrated increase in restaurant visitors. Confirm permissions for every published photograph. The 12 menu photographs sourced from Google Maps are research references only and must never be embedded in this case study.

## Project at a glance

Mayura Cafe and Food Court is a neighbourhood restaurant near the BDA Complex in Nagarbhavi, Bengaluru. The restaurant's owner participated in the website project and permitted the project to be showcased by GyanArt. The work began as a fresh approach, despite an earlier concept design having existed.

**Business objective:** Help someone who discovers Mayura online find the correct restaurant and confidently visit in person.

**Primary website action:** Get Directions. Menu discovery supports that goal, rather than competing with it.

**GyanArt's role in this project:** Stakeholder-led discovery, customer-journey framing, information architecture, content structure, mobile-first and desktop design direction, iterative visual prototyping, front-end implementation and deployment coordination. AI-assisted prototyping and image generation were used in parts of the workflow; final visuals and copy require human/owner review.

## 1. The design challenge

A visitor considering a restaurant visit needs practical answers fast: Is this the right place? What food can I expect? Where exactly is it? When can I visit? How do I get there?

The project question became:

**How might we make it easy to recognise Mayura, check accurate visit details and open directions, while still making a broad food offering easy to explore on a phone?**

This is a *design hypothesis*, not a conclusion from conducted customer interviews.

## 2. Discovery grounded in stakeholder input

The design inputs were established and documented through seven decisions rather than filled with assumptions:

| Decision | Stakeholder-supplied input | Design consequence |
|---|---|---|
| D01 | Help customers find Mayura and visit in person | Get Directions is the primary CTA |
| D02 | Confirmed Google Maps destination | Every directions action uses the same verified link |
| D03 | Landmark: near BDA Complex, Nagarbhavi | Prominent nearby landmark increases recognition |
| D04 | Full business address confirmed | Address is readable and copyable in the visit section |
| D05 | Open Monday–Sunday, 7:30 AM–9:30 PM | Accurate regular hours visible near key decisions |
| D06 | Extensive physical/photographed menu supplied for research only | Reorganise menu content into accessible text categories; do not publish copied images |
| D07 | Provisional menu names and visible prices acceptable for a design draft | Keep the menu maintainable; avoid claiming outdated prices and GST details are final |

**Confirmed visit information**

Mayura Cafe and Food Court, 7, 3rd Block, BDA Layout, 2nd Stage, Nagarbhavi, Bengaluru, Karnataka 560072. Near BDA Complex. Open Monday–Sunday, 7:30 AM–9:30 PM.

## 3. Proposed customer journey

**Discover Mayura → Recognise the restaurant and food → Check location and hours → Open Get Directions → Navigate to the café.**

The experience was therefore designed around three needs:

1. **Location confidence:** Show the genuine restaurant name, storefront and precise Maps destination.
2. **Visit readiness:** Make address and opening hours easy to locate, with a repeatable Get Directions action.
3. **Food exploration:** Let visitors browse food categories and provisional prices without forcing them through unreadable menu-board screenshots.

This journey is not yet validated with independent users.

## 4. Information architecture

The design separates visits and menu browsing into clear, scannable sections:

- **Homepage:** Identity, food imagery, highlights, directions and visit details.
- **Menu exploration:** Categories such as South Indian tiffin, dosa and rotti, quick bites, pizza and sandwiches, drinks and shakes, and starters. Only supported menu entries and provisional prices are shown.
- **Visit information:** Full address, landmark, hours and one correct Maps destination.
- **Restaurant context:** Real storefront and permissible restaurant images, with contact information only where verified.

Menus were kept as editable text so pricing and availability can change without rebuilding graphic assets. Any further About, Menu or Visit subpages must follow the same content and image rules when updated.

## 5. Visual design evolution

### V1 — Clarity first

The first green-and-cream homepage concept prioritised the name, area, opening hours and Get Directions action. It established the mobile content hierarchy and a functional text-first menu preview.

**What we learnt from review:** The direction was functional but could make better use of food visuals to communicate the breadth of the menu. This is stakeholder/design review feedback, not a measured user-test finding.

### V2 — Richer food-led storytelling

The next concept introduced stronger food imagery, richer colours, highlighted dish cards and image-backed menu categories, while keeping the same visit-first CTA hierarchy. Generated dish visuals were kept illustrative and were **not** presented as verified photographs of meals served at Mayura.

### V2.1 — Interactive, responsive prototype

The design became an HTML/CSS/JavaScript prototype with menu-category interactions, mobile navigation, prominent directions actions, and a reusable content structure. Responsive checks covered desktop, tablet and narrow mobile widths. A script-order problem in the standalone prototype was discovered and corrected before review.

### V2.2 — Refining the visit section

Following review, the storefront photograph at the **Come Dine With Us** section received a soft forest-green fade instead of an abrupt vertical edge. The desktop treatment fades horizontally into the green content panel; the stacked mobile layout uses a gentler vertical transition. The user reviewed the live result and approved this visual refinement.

**Visual evidence to add to GyanArt:** A clean homepage screenshot, a mobile screen, a close-up of the visit section before/after, and one menu-category interaction. Use screenshots of our design and cleared/approved underlying visual assets, never the copied Google Maps menu photos.

## 6. Implementation and checks actually completed

The current homepage was built with responsive HTML, CSS and vanilla JavaScript. The design includes repeatable Get Directions links to the owner-confirmed Google Maps listing, accurate regular opening hours, accessible text in menu items, reduced-motion consideration and visible interactive controls.

The new homepage was merged into the dedicated `gyanart/mayuracafe` repository's `main` branch and deployed through GitHub Actions over FTPS to `mayuracafe.gyanart.com`.

**Verified technical evidence:** The deployment workflow succeeded; a separate GitHub-hosted live HTTPS check returned HTTP 200 with valid TLS and confirmed Mayura identity, opening-hour text and correct directions URL. A later check confirmed the new CSS blend was present in the deployed HTML. Browser checks for the prototype tested responsive overflow, image loading, JavaScript errors and selected menu/navigation interactions.

**Important boundary:** These checks establish successful deployment and specific technical behaviours. They do not establish usability success with real diners, improved search rankings, increased direction clicks or additional restaurant footfall.

## 7. Outcome and honest status

**Delivered so far:** An owner-involved, publicly accessible website **design preview** with a distinct visual direction, clear visit-focused customer journey, functional responsive homepage, structured menu draft and repeatable GitHub-to-FTP deployment. The project has an auditable trail from brief to iterations and live technical verification.

**Not yet confirmed:** Final restaurant-owner content and image sign-off, current GST treatment and prices, complete alignment of legacy Menu/About/Visit subpages, independent user testing, analytics collection of direction clicks, official website launch and any measurable business outcome.

The current design preview is intentionally marked **in progress** and has a `noindex` directive until its launch requirements are met.

## 8. What happens next

1. Obtain explicit sign-off on the case-study wording and any published storefront/food images; do not use the 12 Google Maps menu references.
2. Gather current pricing/GST, final logo/photos, and decide whether any separate restaurant pages need updating.
3. Conduct lightweight task testing with real participants: locate opening hours, copy the address and open the correct Maps pin on mobile. Record **real observations**, not assumed time savings.
4. Capture date-stamped owner feedback and iteration screenshots.
5. Decide when the restaurant preview becomes the officially accepted website; only then update its preview/banner and indexing posture.
6. If analytics is added, measure direction clicks as *intent*, not verified on-site visits.

## What this demonstrates for a GyanArt buyer

The project illustrates a practical approach to website design for a Bangalore local business: start with the business goal, structure the experience around its customers' next action, use authentic business information, iterate the interface, and verify what is deployed. The value shown here is **the documented design and development process**, not an invented increase in sales.

**Explore the live design preview:** https://mayuracafe.gyanart.com/  
**Discuss a business website with GyanArt:** https://www.gyanart.com/website-design.html

---

**Editorial status:** Draft v1, 19 October 2026. Not published on GyanArt. All performance and business-result statements require new, verified evidence before being added.