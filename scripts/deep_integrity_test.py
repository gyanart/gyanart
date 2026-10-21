import os, re, json
from bs4 import BeautifulSoup
from urllib.parse import urlparse

dist = "C:/Users/gyana/projects/gyanart/dist"

print("="*70)
print("2. DEEP SITEWIDE INTEGRITY AUDIT (ALL HTML FILES)")
print("="*70)

html_files = []
for root, dirs, files in os.walk(dist):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.relpath(os.path.join(root, f), dist).replace("\\", "/"))

print(f"Total HTML files discovered: {len(html_files)}")

broken_links = []
broken_images = []
images_missing_alt = []
schema_errors = []
seo_missing_meta = []
form_issues = []

for rel_path in html_files:
    full_path = os.path.join(dist, rel_path)
    with open(full_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    soup = BeautifulSoup(html, "html.parser")
    page_dir = os.path.dirname(rel_path)

    # 1. Title & Meta
    title = soup.title.string.strip() if soup.title else ""
    desc_el = soup.find("meta", attrs={"name": "description"})
    desc = desc_el["content"].strip() if desc_el else ""
    canonical = soup.find("link", rel="canonical")
    if not title:
        seo_missing_meta.append((rel_path, "Missing <title>"))
    if not desc:
        seo_missing_meta.append((rel_path, "Missing meta description"))
    if not canonical:
        seo_missing_meta.append((rel_path, "Missing canonical link"))

    # 2. Schema check
    for idx, s in enumerate(soup.find_all("script", type="application/ld+json")):
        try:
            data = json.loads(s.string)
            if not isinstance(data, (dict, list)):
                schema_errors.append((rel_path, f"Schema {idx+1} is not dict or list"))
            elif isinstance(data, dict):
                if not data.get("@type"):
                    schema_errors.append((rel_path, f"Schema {idx+1} missing @type"))
        except Exception as e:
            schema_errors.append((rel_path, f"Schema {idx+1} JSON parse error: {e}"))

    # 3. Images check
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if not src:
            continue
        if not img.get("alt"):
            images_missing_alt.append((rel_path, src))
        # check if local image exists
        if not src.startswith(("http://", "https://", "data:")):
            clean_src = src.split("?")[0].split("#")[0]
            # resolve relative to page_dir or root
            if clean_src.startswith("/"):
                target_img = os.path.join(dist, clean_src.lstrip("/"))
            else:
                target_img = os.path.join(dist, page_dir, clean_src)
            if not os.path.isfile(target_img):
                broken_images.append((rel_path, src, target_img))

    # 4. Links check
    for a in soup.find_all("a"):
        href = a.get("href", "")
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        if href.startswith(("http://", "https://")):
            continue
        
        clean_href = href.split("?")[0].split("#")[0]
        if not clean_href:
            continue
        
        if clean_href.startswith("/"):
            target_file = os.path.join(dist, clean_href.lstrip("/"))
        else:
            target_file = os.path.join(dist, page_dir, clean_href)
        
        # If target is directory, look for index.html
        if os.path.isdir(target_file):
            target_file = os.path.join(target_file, "index.html")
            
        if not os.path.isfile(target_file):
            broken_links.append((rel_path, href))

    # 5. Form check
    for form in soup.find_all("form"):
        action = form.get("action", "")
        honeypot = form.find("input", attrs={"name": "website_confirm"})
        timer = form.find("input", attrs={"name": "form_started_at"})
        if not honeypot:
            form_issues.append((rel_path, "Form missing honeypot (website_confirm)"))
        if not timer:
            form_issues.append((rel_path, "Form missing form_started_at timer token"))

print("\n--- RESULTS ---")
print(f"Broken internal links: {len(broken_links)}")
for bl in broken_links[:10]:
    print(f"  [Broken Link] on {bl[0]} -> {bl[1]}")

print(f"Broken local image references: {len(broken_images)}")
for bi in broken_images[:10]:
    print(f"  [Broken Image] on {bi[0]} -> {bi[1]}")

print(f"Images missing alt text: {len(images_missing_alt)}")
for ima in images_missing_alt[:10]:
    print(f"  [Missing Alt] on {ima[0]} -> {ima[1]}")

print(f"Schema syntax errors: {len(schema_errors)}")
for se in schema_errors[:10]:
    print(f"  [Schema Error] on {se[0]} -> {se[1]}")

print(f"SEO missing metadata: {len(seo_missing_meta)}")
for sm in seo_missing_meta[:10]:
    print(f"  [Missing Meta] on {sm[0]} -> {sm[1]}")

print(f"Form security / token issues: {len(form_issues)}")
for fi in form_issues[:10]:
    print(f"  [Form Issue] on {fi[0]} -> {fi[1]}")

total_issues = len(broken_links) + len(broken_images) + len(images_missing_alt) + len(schema_errors) + len(seo_missing_meta) + len(form_issues)
print("\n" + "="*70)
print(f"TOTAL DEEP INTEGRITY ISSUES: {total_issues}")
print("="*70)
