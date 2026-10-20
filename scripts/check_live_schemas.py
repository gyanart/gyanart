import urllib.request, json, ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
url = "https://www.gyanart.com/"
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }
)
html = urllib.request.urlopen(req, context=ctx).read().decode("utf-8")

soup = BeautifulSoup(html, "html.parser")

print("Title:", soup.title.string.strip() if soup.title else "None")
desc = soup.find("meta", attrs={"name": "description"})
print("Meta description:", desc["content"].strip() if desc else "None")

canonical = soup.find("link", rel="canonical")
print("Canonical:", canonical["href"] if canonical else "None")

og_title = soup.find("meta", property="og:title")
print("OG Title:", og_title["content"] if og_title else "None")

og_desc = soup.find("meta", property="og:description")
print("OG Description:", og_desc["content"] if og_desc else "None")

scripts = soup.find_all("script", type="application/ld+json")
print(f"\nTotal JSON-LD scripts found: {len(scripts)}")

for i, s in enumerate(scripts):
    try:
        data = json.loads(s.string)
        schema_type = data.get("@type", "Unknown")
        print(f"\n--- Schema {i+1}: {schema_type} ---")
        if "@graph" in data:
            print("Graph elements:", [item.get("@type") for item in data["@graph"]])
            print(json.dumps(data, indent=2)[:400] + "...")
        else:
            print(json.dumps(data, indent=2)[:400] + "...")
    except Exception as e:
        print(f"Schema {i+1} parse error: {e}")
