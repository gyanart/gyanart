#!/usr/bin/env python3
"""Build-output SEO QA: deterministic, read-only, Python standard library."""
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree as ET
import json, re, sys

ROOT=Path("dist")
PAGES=json.loads(Path("src/data/pages.json").read_text(encoding="utf-8"))
BASE="https://www.gyanart.com/"
issues=[]
notes=[]
class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang=""
        self.title=""
        self.in_title=False
        self.meta={}
        self.links=[]
        self.anchors=[]
        self.language_options={}
        self.h1=0
        self.jsonld=[]
        self.in_jsonld=False
        self.json_text=""
        self.ids=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="html":self.lang=a.get("lang","")
        if tag=="title":self.in_title=True
        if tag=="h1":self.h1+=1
        if tag=="link":self.links.append(a)
        if tag=="meta":self.meta[a.get("name") or a.get("property") or ""]=a.get("content","")
        if tag=="a":
            self.anchors.append(a.get("href",""))
            if a.get("lang") in ("en","hi","kn"):
                self.language_options[a["lang"]]=a.get("href","")
        if "id" in a:self.ids.append(a["id"])
        if tag=="script" and a.get("type")=="application/ld+json":
            self.in_jsonld=True
            self.json_text=""
    def handle_data(self,data):
        if self.in_title:self.title+=data
        if self.in_jsonld:self.json_text+=data
    def handle_endtag(self,tag):
        if tag=="title":self.in_title=False
        if tag=="script" and self.in_jsonld:
            self.jsonld.append(self.json_text.strip())
            self.in_jsonld=False

def entry_url(p):
    if p.get("isHome") or p["output"]=="index.html":
        return BASE+(p.get("lang","")+"/" if p.get("lang") else "")
    return BASE+p["output"]

def slug(p):
    return p.get("slug") or (p["output"] if p["output"].startswith("experiments/") else Path(p["output"]).name)

def check(condition,kind,description,page=""):
    if not condition:issues.append((kind,page,description))

files={}
for p in PAGES:
    f=ROOT/p["output"]
    check(f.is_file(),"missing-built-page",str(f),p["output"])
    if f.is_file():
        parser=PageParser()
        parser.feed(f.read_text(encoding="utf-8"))
        files[p["output"]]=parser

groups=defaultdict(list)
for p in PAGES:groups[slug(p)].append(p)
expected_urls={entry_url(p) for p in PAGES if not p.get("noindex")}
noindex_count=sum(bool(p.get("noindex")) for p in PAGES)
indexed_count=len(PAGES)-noindex_count
sitemap_root=ET.parse(ROOT/"sitemap.xml").getroot()
published={n.text for n in sitemap_root.iter() if n.tag.endswith("}loc") or n.tag=="loc"}
check(expected_urls==published,"sitemap-mismatch",f"Missing {sorted(expected_urls-published)}; unexpected {sorted(published-expected_urls)}")
check(len(published)==len(expected_urls),"sitemap-duplicates",f"Found {len(published)} unique; expected {len(expected_urls)}")
robots=(ROOT/"robots.txt").read_text(encoding="utf-8")
check("Sitemap: https://www.gyanart.com/sitemap.xml" in robots,"robots","Wrong/missing sitemap directive")
check("Disallow: /" not in robots,"robots","Site-wide Disallow: / detected")

for p in PAGES:
    key=p["output"]
    if key not in files:continue
    pg=files[key]
    url=entry_url(p)
    check(bool(pg.title.strip()),"missing-title","Empty title",key)
    check(bool(pg.meta.get("description","").strip()),"missing-description","No meta description",key)
    check(pg.h1==1,"heading-count",f"Expected one H1, got {pg.h1}",key)
    check(pg.lang==(p.get("lang") or "en"),"wrong-lang",f"{pg.lang} != {p.get('lang') or 'en'}",key)
    can=[x.get("href") for x in pg.links if x.get("rel")=="canonical"]
    check(can==[url],"canonical",f"{can} should be {url}",key)
    noindex="noindex" in pg.meta.get("robots","").lower()
    check(noindex==bool(p.get("noindex")),"noindex",f"noindex={noindex} expected {bool(p.get('noindex'))}",key)
    check((url in published)==(not p.get("noindex")),"sitemap-membership","Noindex/sitemap disagreement",key)
    locale=pg.meta.get("og:locale")
    expected_locale=p.get("locale") or {"hi":"hi_IN","kn":"kn_IN"}.get(p.get("lang"),"en_IN")
    check(locale==expected_locale,"og-locale",f"{locale} != {expected_locale}",key)
    check(bool(pg.jsonld),"structured-data","No JSON-LD",key)
    for block in pg.jsonld:
        try:
            obj=json.loads(block)
            check(isinstance(obj,dict) and bool(obj.get("@context")) and bool(obj.get("@type")),
                  "structured-data","Missing @context or @type",key)
        except ValueError as exc:issues.append(("invalid-jsonld",key,str(exc)))
    check(len(pg.ids)==len(set(pg.ids)),"duplicate-ids","Duplicate HTML ids",key)
    expected_alts={x.get("lang") or "en":entry_url(x) for x in groups[slug(p)]}
    en_url=expected_alts.get("en",BASE)
    expected_alts["x-default"]=en_url
    actual_alts={}
    for x in pg.links:
        if "hreflang" in x:
            lang=x["hreflang"]
            check(lang not in actual_alts,"hreflang-duplicate",f"Duplicate {lang}",key)
            actual_alts[lang]=x.get("href")
    check(actual_alts==expected_alts,"hreflang",
          f"Expected {expected_alts}; got {actual_alts}",key)
    if slug(p) == "404.html" or p.get("translationOptional"):
        continue
    # Verify every EN/HI/KN language switch leads to the same page in that language.
    for target_lang in ("en","hi","kn"):
        matches=[q for q in groups[slug(p)] if (q.get("lang") or "en")==target_lang]
        check(len(matches)==1,"language-peer",f"Need exactly one {target_lang} equivalent",key)
        if matches:
            switch=pg.language_options.get(target_lang)
            check(bool(switch),"language-switcher",f"Missing {target_lang} option",key)
            if switch:
                resolved=(ROOT/Path(key).parent/switch)
                expected=(ROOT/matches[0]["output"])
                if resolved.is_dir():resolved=resolved/"index.html"
                check(resolved.resolve()==expected.resolve(),"language-switcher",f"{target_lang} -> {switch}: {resolved} expected {expected}",key)
    # Resolve all same-host relative href targets against the current generated HTML path.
    for link in pg.anchors:
        if not link or link.startswith(("#","mailto:","tel:","sms:","javascript:","data:")):continue
        parsed=urlsplit(link)
        if parsed.scheme and parsed.scheme not in ("http","https"):continue
        if parsed.netloc and parsed.netloc not in ("www.gyanart.com","gyanart.com"):continue
        if parsed.netloc or link.startswith("/"):
            path=unquote(parsed.path.lstrip("/"))
            dest=ROOT/path
        else:
            dest=ROOT/Path(key).parent/unquote(parsed.path)
        if str(dest).endswith("/"):dest=dest/"index.html"
        if dest.is_dir():dest=dest/"index.html"
        if parsed.path=="" and (parsed.query or parsed.fragment):dest=ROOT/key
        if not dest.is_file():
            issues.append(("broken-internal-link",key,f"{link} -> {dest}"))
        # Anchors can be injected by JavaScript, so report them as notes rather than hard failures.
        elif parsed.fragment and not parsed.path and parsed.fragment not in pg.ids:
            notes.append((key,f"Unverified fragment #{parsed.fragment}"))
    files[key]=pg

lang_groups=[g for g in groups.values() if not any(x.get("noindex") or x.get("translationOptional") for x in g)]
for g in lang_groups:
    langs={x.get("lang") or "en" for x in g}
    check(langs=={"en","hi","kn"},"missing-translation",f"Missing set in {slug(g[0])}: {langs}")
    for p in g:
        check(p["output"] in files,"missing-localized-output","Translated target missing",p["output"])

counts=Counter(x[0] for x in issues)
print(f"SEO BUILD CRAWL: {len(PAGES)} generated pages, {indexed_count} indexable, {noindex_count} noindex; {len(published)} sitemap URLs; {len(groups)} translation groups")
print("Checks: titles, descriptions, H1, lang, self-canonical, noindex, sitemap, OG locale, JSON-LD validity/schema keys, hreflang reciprocity, local anchors, robots")
for kind,page,message in issues:
    print(f"ERROR [{kind}] {page}: {message}")
for page,message in notes[:20]:
    print(f"NOTE {page}: {message}")
print(f"RESULT: {len(issues)} errors; breakdown={dict(counts)}; {len(notes)} nonfatal fragment notes")
report={
  "pages_total":len(PAGES),"indexable":indexed_count,"noindex":noindex_count,
  "sitemap_urls":len(published),"translation_groups":len(groups),
  "errors":[{"kind":k,"page":p,"detail":d} for k,p,d in issues],
  "notes":[{"page":p,"detail":d} for p,d in notes],
}
Path("seo-full-site-qa.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
sys.exit(1 if issues else 0)
