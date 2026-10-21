import os, re, json, glob
from bs4 import BeautifulSoup

dist = "C:/Users/gyana/projects/gyanart/dist"

print("="*60)
print("1. RUNNING GITHUB ACTIONS CI/CD SIMULATION CHECKS")
print("="*60)

errors = []
warnings = []

def check(condition, desc):
    if condition:
        print(f"[PASS] {desc}")
    else:
        print(f"[FAIL] {desc}")
        errors.append(desc)

# File existence checks
key_files = [
    "index.html", "css/site.css", "js/main.js", "robots.txt", "sitemap.xml",
    "llms.txt", "llms-full.txt", "404.html", ".htaccess", "logo-design.html",
    "faqs.html", "pricing.html", "contact.html", "growth-audit.html",
    "submit-form.php", "assets/og-gyanart.svg", "assets/og-gyanart.png"
]
for kf in key_files:
    check(os.path.isfile(os.path.join(dist, kf)), f"File exists: {kf}")

# .htaccess checks
htaccess_path = os.path.join(dist, ".htaccess")
if os.path.isfile(htaccess_path):
    with open(htaccess_path, "r", encoding="utf-8") as f:
        ht = f.read()
    check("ErrorDocument 404 /404.html" in ht, ".htaccess: ErrorDocument 404")
    check("Permissions-Policy" in ht, ".htaccess: Permissions-Policy")
    check("Strict-Transport-Security" in ht, ".htaccess: HSTS")
    check("X-Content-Type-Options" in ht, ".htaccess: X-Content-Type-Options")
    check("Cache-Control" in ht, ".htaccess: Cache-Control")
    check("mod_expires.c" in ht, ".htaccess: mod_expires")
    check("mod_deflate.c" in ht, ".htaccess: mod_deflate")
    check("RewriteRule ^free-audit" in ht, ".htaccess: free-audit redirect rule")
    check("RewriteRule ^privacy" in ht, ".htaccess: privacy redirect rule")
    check("RewriteRule ^terms" in ht, ".htaccess: terms redirect rule")

# robots.txt & sitemap.xml
with open(os.path.join(dist, "robots.txt"), "r", encoding="utf-8") as f:
    rb = f.read()
check("https://www.gyanart.com/" in rb, "robots.txt: references https://www.gyanart.com/")
check("GPTBot" in rb and "ClaudeBot" in rb and "PerplexityBot" in rb, "robots.txt: allows AI crawlers")

with open(os.path.join(dist, "sitemap.xml"), "r", encoding="utf-8") as f:
    sm = f.read()
check("https://www.gyanart.com/" in sm, "sitemap.xml: contains site URLs")
check("pricing.html" in sm and "growth-audit.html" in sm and "faqs.html" in sm, "sitemap.xml: key pages present")

# index.html checks
with open(os.path.join(dist, "index.html"), "r", encoding="utf-8") as f:
    idx = f.read()
check('rel="canonical" href="https://www.gyanart.com/' in idx, "index.html: canonical tag")
check("og:image" in idx, "index.html: og:image")
check("G-D0JCS746B6" in idx, "index.html: GA4 measurement ID")
check("yxvmsm9pma" in idx, "index.html: Clarity ID")
check("FAQPage" in idx, "index.html: FAQPage schema")
check("OfferCatalog" in idx, "index.html: OfferCatalog schema")
check("google-rating-badge" in idx, "index.html: google-rating-badge")

# main.js checks
with open(os.path.join(dist, "js/main.js"), "r", encoding="utf-8") as f:
    js_content = f.read()
check("generate_lead" in js_content, "main.js: generate_lead event")
check("contact_click" in js_content, "main.js: contact_click event")
check('contact_method:"whatsapp"' in js_content, "main.js: whatsapp tracking")
check('contact_method:"phone"' in js_content, "main.js: phone tracking")
check('contact_method:"email"' in js_content, "main.js: email tracking")
check("showFormToast" in js_content, "main.js: showFormToast")

print("\n" + "="*60)
print(f"CI/CD SIMULATION SUMMARY: {len(errors)} ERRORS")
print("="*60)
if errors:
    for e in errors:
        print("  FAIL:", e)
else:
    print("ALL CI/CD CHECKS PASSED PERFECTLY!")
