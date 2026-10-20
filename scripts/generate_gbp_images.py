import os
from playwright.sync_api import sync_playwright

output_dir = 'C:/Users/gyana/projects/gyanart/gbp-posts'
os.makedirs(output_dir, exist_ok=True)

# Common HTML template wrapper
def create_card_html(eyebrow, title, content_html, footer_badge="Bangalore Local Businesses"):
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: 1200px;
    height: 900px;
    background: #F8F8F6;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1A202C;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px 70px;
    position: relative;
    overflow: hidden;
  }}
  /* Subtle geometric background accents */
  .bg-circle {{
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    pointer-events: none;
  }}
  .bg-1 {{
    width: 450px;
    height: 450px;
    background: rgba(234, 88, 12, 0.06);
    top: -100px;
    right: -100px;
  }}
  .bg-2 {{
    width: 400px;
    height: 400px;
    background: rgba(59, 130, 246, 0.05);
    bottom: -80px;
    left: -80px;
  }}
  .container {{
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }}
  header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .logo {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .logo-mark {{
    width: 42px;
    height: 42px;
    background: #1A202C;
    color: #FFFFFF;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -1px;
  }}
  .logo-text {{
    font-size: 26px;
    font-weight: 800;
    color: #1A202C;
    letter-spacing: -0.5px;
  }}
  .logo-sub {{
    font-size: 13px;
    font-weight: 600;
    color: #718096;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }}
  .eyebrow {{
    display: inline-block;
    padding: 6px 16px;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 700;
    color: #C2410C;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }}
  .title-section {{
    margin-top: 24px;
    margin-bottom: 24px;
  }}
  h1 {{
    font-size: 46px;
    line-height: 1.15;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -1px;
    max-width: 950px;
  }}
  .content-area {{
    flex: 1;
    display: flex;
    align-items: center;
  }}
  footer {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid #E2E8F0;
  }}
  .footer-left {{
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 16px;
    color: #64748B;
    font-weight: 600;
  }}
  .url-badge {{
    background: #0F172A;
    color: #FFFFFF;
    font-size: 15px;
    font-weight: 700;
    padding: 10px 22px;
    border-radius: 8px;
    letter-spacing: 0.2px;
  }}
</style>
</head>
<body>
  <div class="bg-circle bg-1"></div>
  <div class="bg-circle bg-2"></div>
  <div class="container">
    <header>
      <div class="logo">
        <div class="logo-mark">G</div>
        <div>
          <div class="logo-text">GyanArt</div>
          <div class="logo-sub">UX-Led Digital Growth</div>
        </div>
      </div>
      <div class="eyebrow">{eyebrow}</div>
    </header>

    <div class="title-section">
      <h1>{title}</h1>
    </div>

    <div class="content-area">
      {content_html}
    </div>

    <footer>
      <div class="footer-left">
        <span>📍 Bengaluru, Karnataka</span>
        <span>•</span>
        <span>Founder-Led by Gyaneshwar (20+ Yrs UX)</span>
        <span>•</span>
        <span>{footer_badge}</span>
      </div>
      <div class="url-badge">www.gyanart.com</div>
    </footer>
  </div>
</body>
</html>"""

# Posts Definitions
posts = [
    # Post 1: Transparent Pricing
    {
        "filename": "post1_transparent_pricing.png",
        "eyebrow": "Transparent Packages · No Hidden Costs",
        "title": "How Much Does a Small Business Website Cost in Bangalore?",
        "footer_badge": "Standard 2–3 Week Delivery",
        "content": """
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%;">
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size: 14px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Starter Scope</div>
            <div style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 8px 0;">Digital Foundation</div>
            <div style="font-size: 42px; font-weight: 900; color: #0F172A; margin-bottom: 16px;">₹10,000</div>
            <ul style="list-style: none; font-size: 15px; color: #475569; line-height: 1.6;">
              <li style="margin-bottom: 8px;">✓ Up to 5 responsive pages</li>
              <li style="margin-bottom: 8px;">✓ Click-to-call & WhatsApp</li>
              <li style="margin-bottom: 8px;">✓ Google Profile basics</li>
              <li>✓ Fast, mobile-first build</li>
            </ul>
          </div>
          <div style="background: #0F172A; color: #FFFFFF; border: 1px solid #0F172A; border-radius: 16px; padding: 32px 24px; box-shadow: 0 10px 24px rgba(15,23,42,0.12); position: relative;">
            <div style="position: absolute; top: -12px; right: 20px; background: #EA580C; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 100px; text-transform: uppercase;">Most Popular</div>
            <div style="font-size: 14px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">Growth Focus</div>
            <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin: 8px 0;">Enquiry Builder</div>
            <div style="font-size: 42px; font-weight: 900; color: #FFFFFF; margin-bottom: 16px;">₹25,000</div>
            <ul style="list-style: none; font-size: 15px; color: #CBD5E1; line-height: 1.6;">
              <li style="margin-bottom: 8px;">✓ Up to 10 custom pages</li>
              <li style="margin-bottom: 8px;">✓ High-converting UX structure</li>
              <li style="margin-bottom: 8px;">✓ Enquiry & lead tracking</li>
              <li>✓ Local SEO foundation</li>
            </ul>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size: 14px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Comprehensive</div>
            <div style="font-size: 22px; font-weight: 800; color: #0F172A; margin: 8px 0;">Growth Optimization</div>
            <div style="font-size: 42px; font-weight: 900; color: #0F172A; margin-bottom: 16px;">₹37,000</div>
            <ul style="list-style: none; font-size: 15px; color: #475569; line-height: 1.6;">
              <li style="margin-bottom: 8px;">✓ Up to 30 structured pages</li>
              <li style="margin-bottom: 8px;">✓ Multi-practice / location</li>
              <li style="margin-bottom: 8px;">✓ Deeper analytics & search</li>
              <li>✓ Advanced measurement</li>
            </ul>
          </div>
        </div>
        """
    },

    # Post 2: Website Diagnostic / UX Friction
    {
        "filename": "post2_ux_friction_diagnostic.png",
        "eyebrow": "Conversion & UX · Diagnostic Field Guide",
        "title": "People Visit Your Website — Why Don't They Contact You?",
        "footer_badge": "Conversion Rate Optimization",
        "content": """
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; width: 100%;">
          <div style="background: #FFFFFF; border-left: 4px solid #EA580C; border-radius: 12px; padding: 28px 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 32px; font-weight: 900; color: #EA580C; margin-bottom: 8px;">01</div>
            <div style="font-size: 19px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">Unclear Offer</div>
            <p style="font-size: 15px; color: #64748B; line-height: 1.5;">Can a visitor explain what you do, who you help, and where you operate within 5 seconds of landing?</p>
          </div>
          <div style="background: #FFFFFF; border-left: 4px solid #2563EB; border-radius: 12px; padding: 28px 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 32px; font-weight: 900; color: #2563EB; margin-bottom: 8px;">02</div>
            <div style="font-size: 19px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">Missing Trust Signals</div>
            <p style="font-size: 15px; color: #64748B; line-height: 1.5;">Are genuine reviews, actual completed work, and clear pricing upfront—or do customers hit vague claims?</p>
          </div>
          <div style="background: #FFFFFF; border-left: 4px solid #16A34A; border-radius: 12px; padding: 28px 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 32px; font-weight: 900; color: #16A34A; margin-bottom: 8px;">03</div>
            <div style="font-size: 19px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">High Contact Friction</div>
            <p style="font-size: 15px; color: #64748B; line-height: 1.5;">Can a customer tap to call or WhatsApp you on mobile with one hand, without filling out endless form fields?</p>
          </div>
        </div>
        """
    },

    # Post 3: Mayura Cafe Case Study
    {
        "filename": "post3_mayura_case_study.png",
        "eyebrow": "Real Business Case Study · Food & Hospitality",
        "title": "Mayura Cafe & Food Court: From Footfall Goals to a Working Menu",
        "footer_badge": "Live Working Design Preview",
        "content": """
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; width: 100%; align-items: center;">
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size: 14px; font-weight: 700; color: #EA580C; text-transform: uppercase; margin-bottom: 6px;">The Challenge & Solution</div>
            <div style="font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 14px;">Visit-First Restaurant UX</div>
            <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 16px;">
              Food delivery apps take 18–28% margins. We designed a direct website journey focused on driving in-person diners and takeaway orders.
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <span style="background: #F1F5F9; color: #334155; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 6px;">Fast Mobile Menu</span>
              <span style="background: #F1F5F9; color: #334155; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 6px;">Google Maps Navigation</span>
              <span style="background: #F1F5F9; color: #334155; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 6px;">Zero PDF Downloads</span>
            </div>
          </div>
          <div style="background: #0F172A; border-radius: 16px; padding: 32px; color: #FFFFFF; text-align: center;">
            <div style="font-size: 48px; font-weight: 900; color: #38BDF8; margin-bottom: 8px;">100%</div>
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Mobile-Friendly Digital Menu</div>
            <p style="font-size: 14px; color: #94A3B8; line-height: 1.5;">Customers browse food items and prices instantly on phone screens without pinching or zooming.</p>
          </div>
        </div>
        """
    },

    # Post 4: Free Growth Audit
    {
        "filename": "post4_free_growth_audit.png",
        "eyebrow": "Complimentary Review · Bangalore Businesses",
        "title": "Free Digital Growth Audit: See What May Be Stopping Enquiries",
        "footer_badge": "Zero Obligation · 48-Hour Turnaround",
        "content": """
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; width: 100%;">
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; text-align: center;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #EFF6FF; color: #2563EB; font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;">1</div>
            <div style="font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">Google Profile</div>
            <p style="font-size: 14px; color: #64748B; line-height: 1.4;">Categories, hours, service listings & review health check.</p>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; text-align: center;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #FEF3C7; color: #D97706; font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;">2</div>
            <div style="font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">Mobile UX</div>
            <p style="font-size: 14px; color: #64748B; line-height: 1.4;">Visual clarity, layout balance & ease of navigation on phones.</p>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; text-align: center;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #DCFCE7; color: #16A34A; font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;">3</div>
            <div style="font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">Contact Friction</div>
            <p style="font-size: 14px; color: #64748B; line-height: 1.4;">Testing tap-to-call, WhatsApp and form response pathways.</p>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; text-align: center;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #F3E8FF; color: #9333EA; font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;">4</div>
            <div style="font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">Action Plan</div>
            <p style="font-size: 14px; color: #64748B; line-height: 1.4;">3 core strengths + 3 highest-priority fixes to implement.</p>
          </div>
        </div>
        """
    },

    # Post 5: Local SEO & Google Maps
    {
        "filename": "post5_local_seo_maps.png",
        "eyebrow": "Local Discovery · Bangalore Search",
        "title": "Is Your Google Business Profile Doing Enough for Your Business?",
        "footer_badge": "East & South Bangalore Focus",
        "content": """
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; width: 100%;">
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 18px; font-weight: 800; color: #EA580C; margin-bottom: 8px;">Google Business Profile</div>
            <p style="font-size: 15px; color: #475569; line-height: 1.5; margin-bottom: 12px;">Makes your listing accurate, credible, and action-ready for customers browsing Google Search and Maps.</p>
            <div style="font-size: 13px; font-weight: 700; color: #64748B;">Category Alignment · Hours · Pin Location</div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 18px; font-weight: 800; color: #2563EB; margin-bottom: 8px;">Local SEO On-Page Foundation</div>
            <p style="font-size: 15px; color: #475569; line-height: 1.5; margin-bottom: 12px;">Connects your website pages to specific high-intent searches across Bangalore commercial hubs.</p>
            <div style="font-size: 13px; font-weight: 700; color: #64748B;">Varthur · Whitefield · HSR · Koramangala · Indiranagar</div>
          </div>
        </div>
        """
    },

    # Post 6: AI Search & Future Proofing (GEO)
    {
        "filename": "post6_ai_search_geo.png",
        "eyebrow": "Generative Engine Optimization (GEO)",
        "title": "How AI Search Engines (ChatGPT & Google AI) Find Your Business",
        "footer_badge": "Optimizing for AI Search in 2026",
        "content": """
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%;">
          <div style="background: #0F172A; color: #FFFFFF; border-radius: 16px; padding: 28px 22px;">
            <div style="font-size: 13px; font-weight: 700; color: #38BDF8; text-transform: uppercase;">01 / Structured Data</div>
            <div style="font-size: 20px; font-weight: 800; margin: 10px 0;">Schema & Entity Linking</div>
            <p style="font-size: 14px; color: #94A3B8; line-height: 1.5;">JSON-LD markup connects your business type, services, pricing, and founder credentials directly into AI knowledge graphs.</p>
          </div>
          <div style="background: #0F172A; color: #FFFFFF; border-radius: 16px; padding: 28px 22px;">
            <div style="font-size: 13px; font-weight: 700; color: #38BDF8; text-transform: uppercase;">02 / Documentation</div>
            <div style="font-size: 20px; font-weight: 800; margin: 10px 0;">Standard llms.txt</div>
            <p style="font-size: 14px; color: #94A3B8; line-height: 1.5;">Gives automated AI crawlers (GPTBot, ClaudeBot, Perplexity) a clean, markdown-formatted directory of your services.</p>
          </div>
          <div style="background: #0F172A; color: #FFFFFF; border-radius: 16px; padding: 28px 22px;">
            <div style="font-size: 13px; font-weight: 700; color: #38BDF8; text-transform: uppercase;">03 / Citability</div>
            <div style="font-size: 20px; font-weight: 800; margin: 10px 0;">Fact-Dense Answer Blocks</div>
            <p style="font-size: 14px; color: #94A3B8; line-height: 1.5;">Replacing vague marketing filler with 130–160 word structured answers that AI search engines can quote verbatim.</p>
          </div>
        </div>
        """
    },

    # Post 7: Clinics & Healthcare
    {
        "filename": "post7_healthcare_clinic_websites.png",
        "eyebrow": "Healthcare Practice Growth · Bangalore",
        "title": "Website Design for Dental Clinics & Healthcare Practices",
        "footer_badge": "Frictionless Patient Experience",
        "content": """
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; width: 100%;">
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
            <div style="font-size: 14px; font-weight: 700; color: #0284C7; text-transform: uppercase; margin-bottom: 6px;">Patient Experience First</div>
            <div style="font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Turn Local Patient Searches into Bookings</div>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              When a patient has a dental issue, they want fast clarity: doctor credentials, treatments offered, clinic hygiene, and a quick WhatsApp or call booking action.
            </p>
          </div>
          <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 16px; padding: 28px; color: #0369A1;">
            <div style="font-size: 16px; font-weight: 800; margin-bottom: 12px;">Essential Clinic Features:</div>
            <ul style="list-style: none; font-size: 14px; line-height: 1.7;">
              <li>✓ One-tap WhatsApp appointment chat</li>
              <li>✓ Clear treatment explanations & pricing</li>
              <li>✓ Clinic photos, parking & landmark details</li>
              <li>✓ Google Maps directions integrated</li>
            </ul>
          </div>
        </div>
        """
    },

    # Post 8: What’s Included in Web Design
    {
        "filename": "post8_whats_included.png",
        "eyebrow": "Service Scope · Pragmatic Web Design",
        "title": "What Should Be Included in a Small Business Website?",
        "footer_badge": "Clean Semantic Code · No Bloat",
        "content": """
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width: 100%;">
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px 24px; display: flex; gap: 16px; align-items: flex-start;">
            <div style="background: #FFF7ED; color: #EA580C; font-size: 20px; font-weight: 900; width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✓</div>
            <div>
              <div style="font-size: 17px; font-weight: 800; color: #0F172A;">Mobile-First Responsive Layout</div>
              <p style="font-size: 14px; color: #64748B; margin-top: 4px;">Designed specifically for smooth reading on smartphones, tablets, and desktops.</p>
            </div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px 24px; display: flex; gap: 16px; align-items: flex-start;">
            <div style="background: #EFF6FF; color: #2563EB; font-size: 20px; font-weight: 900; width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✓</div>
            <div>
              <div style="font-size: 17px; font-weight: 800; color: #0F172A;">Click-to-Call & WhatsApp</div>
              <p style="font-size: 14px; color: #64748B; margin-top: 4px;">Frictionless contact pathways aligned with Indian consumer habits.</p>
            </div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px 24px; display: flex; gap: 16px; align-items: flex-start;">
            <div style="background: #ECFDF5; color: #059669; font-size: 20px; font-weight: 900; width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✓</div>
            <div>
              <div style="font-size: 17px; font-weight: 800; color: #0F172A;">Search-Ready Technical Structure</div>
              <p style="font-size: 14px; color: #64748B; margin-top: 4px;">Schema.org JSON-LD, XML sitemaps, descriptive meta tags and fast Core Web Vitals.</p>
            </div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px 24px; display: flex; gap: 16px; align-items: flex-start;">
            <div style="background: #FAF5FF; color: #7C3AED; font-size: 20px; font-weight: 900; width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">✓</div>
            <div>
              <div style="font-size: 17px; font-weight: 800; color: #0F172A;">Direct Senior UX Collaboration</div>
              <p style="font-size: 14px; color: #64748B; margin-top: 4px;">Work directly with founder Gyaneshwar without middleman account managers.</p>
            </div>
          </div>
        </div>
        """
    }
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1200, "height": 900})

    for post in posts:
        out_path = os.path.join(output_dir, post["filename"])
        html = create_card_html(post["eyebrow"], post["title"], post["content"], post["footer_badge"])
        page.set_content(html)
        page.screenshot(path=out_path, full_page=False)
        print(f"Generated: {out_path}")

    browser.close()

print(f"Successfully generated all {len(posts)} GBP post images in {output_dir}")
