import urllib.request, json, ssl, time
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

def get_soup(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        return BeautifulSoup(r.read().decode('utf-8', errors='ignore'), 'html.parser'), r.headers, r.status

pages = [
    ("Homepage", "https://www.gyanart.com/"),
    ("Pricing", "https://www.gyanart.com/pricing.html"),
    ("Services/Solutions", "https://www.gyanart.com/solutions.html"),
    ("How It Works", "https://www.gyanart.com/how-it-works.html"),
    ("Portfolio", "https://www.gyanart.com/portfolio.html"),
    ("Contact", "https://www.gyanart.com/contact.html"),
    ("Growth Audit", "https://www.gyanart.com/growth-audit.html"),
    ("FAQs", "https://www.gyanart.com/faqs.html"),
    ("Dental Clinics", "https://www.gyanart.com/dental-clinics.html"),
    ("Restaurants", "https://www.gyanart.com/restaurants.html"),
    ("Professional Services", "https://www.gyanart.com/professional-services.html")
]

results = []

for name, url in pages:
    try:
        soup, hdrs, status = get_soup(url)
        title = soup.title.string.strip() if soup.title else ""
        desc_el = soup.find('meta', attrs={'name': 'description'})
        desc = desc_el['content'].strip() if desc_el else ""
        canonical_el = soup.find('link', rel='canonical')
        canonical = canonical_el['href'] if canonical_el else ""
        h1s = [h.get_text(strip=True) for h in soup.find_all('h1')]
        
        # Schemas
        schemas = []
        for s in soup.find_all('script', type='application/ld+json'):
            try:
                schemas.append(json.loads(s.string))
            except Exception as e:
                pass
        
        schema_types = []
        for sc in schemas:
            if isinstance(sc, dict):
                schema_types.append(sc.get('@type', 'unknown'))
            elif isinstance(sc, list):
                for item in sc:
                    schema_types.append(item.get('@type', 'unknown'))
        
        results.append({
            "name": name,
            "url": url,
            "status": status,
            "title": title,
            "title_len": len(title),
            "desc": desc,
            "desc_len": len(desc),
            "canonical": canonical,
            "h1_count": len(h1s),
            "h1": h1s[0] if h1s else "None",
            "schema_types": schema_types,
            "word_count": len(soup.get_text().split()),
            "img_count": len(soup.find_all('img')),
            "imgs_without_alt": len([img for img in soup.find_all('img') if not img.get('alt')])
        })
    except Exception as e:
        results.append({"name": name, "url": url, "error": str(e)})

print(json.dumps(results, indent=2))
