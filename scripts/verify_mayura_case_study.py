#!/usr/bin/env python3
"""Validate the new Mayura UX case-study diagrams and built-page references."""
from html.parser import HTMLParser
from pathlib import Path
from xml.etree import ElementTree as ET
import json
import re

ROOT=Path("dist")
GRAPHICS={
    "ux-journey.svg": (1200,390),
    "ux-user-flow.svg": (1200,515),
    "ux-information-architecture.svg": (1200,450),
    "ux-wireframe-mobile.svg": (490,900),
    "ux-wireframe-desktop.svg": (1090,690),
}
PAGES=[
    "case-studies/mayura-cafe.html",
    "hi/case-studies/mayura-cafe.html",
    "kn/case-studies/mayura-cafe.html",
]
class Scan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images=[]
        self.classes=set()
        self.scripts=[]
        self.read_jsonld=False
        self.buffer=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        self.classes.update(a.get("class","").split())
        if tag=="img": self.images.append(a)
        if tag=="script" and a.get("type")=="application/ld+json":
            self.read_jsonld=True
            self.buffer=[]
    def handle_data(self,data):
        if self.read_jsonld: self.buffer.append(data)
    def handle_endtag(self,tag):
        if tag=="script" and self.read_jsonld:
            self.scripts.append("".join(self.buffer))
            self.read_jsonld=False

for name,(w,h) in GRAPHICS.items():
    path=ROOT/"assets"/"mayura"/name
    assert path.is_file(),f"Missing artwork: {path}"
    doc=ET.parse(path).getroot()
    assert doc.tag.endswith("svg"),f"Not SVG: {path}"
    assert doc.attrib.get("viewBox")==f"0 0 {w} {h}",f"Wrong SVG size: {name}"
    assert any(el.tag.endswith("title") for el in doc.iter()),f"Missing SVG title: {name}"
    assert any(el.tag.endswith("desc") for el in doc.iter()),f"Missing SVG description: {name}"

for page in PAGES:
    data=(ROOT/page).read_text(encoding="utf-8")
    parsed=Scan()
    parsed.feed(data)
    for name,(w,h) in GRAPHICS.items():
        matches=[img for img in parsed.images if img.get("src","").endswith("/"+name)]
        assert len(matches)==1,f"{page}: expected one {name} image; got {len(matches)}"
        img=matches[0]
        assert img.get("alt","").strip(),f"{page}: missing alt for {name}"
        assert img.get("width")==str(w) and img.get("height")==str(h),f"{page}: intrinsic dimensions missing for {name}"
    assert {"work-case-hero","work-case-cta"} <= parsed.classes,f"{page}: case-study sections missing"
    assert data.count('<h1')==1,f"{page}: one H1 required"
    assert "noindex" not in data.split("</head>")[0].lower(),f"{page}: case study unexpectedly noindexed"
    for script in parsed.scripts:
        json.loads(script)

css=(ROOT/"css"/"site.css").read_text(encoding="utf-8")

def css_rule(selector):
    """Return declarations for a simple CSS rule, regardless of whitespace/minification."""
    pattern=r"(?<![\w.-])"+re.escape(selector)+r"\s*\{([^{}]*)\}"
    match=re.search(pattern,css,re.S)
    assert match is not None,f"Missing CSS selector: {selector}"
    return match.group(1)

# Mayura now uses global light/dark theme tokens instead of fixed pastel backgrounds.
hero=css_rule(".work-case-hero")
cta=css_rule(".work-case-cta")
assert re.search(r"\bbackground-image\s*:\s*radial-gradient\s*\(",hero), "Case hero gradient missing"
for token in ("--hero-glow-1","--hero-glow-2"):
    assert f"var({token})" in hero,f"Case hero is not using theme token {token}"
assert re.search(r"\bbackground\s*:\s*var\(--surface\)\s*;",cta), "Case CTA is not using the theme surface"

# Both explicit theme overrides and the default light theme define the colors.
for theme in (":root",'[data-theme="light"]','[data-theme="dark"]'):
    declarations=css_rule(theme)
    for token in ("--surface","--hero-glow-1","--hero-glow-2"):
        assert re.search(r"(?<![\w-])"+re.escape(token)+r"\s*:",declarations), f"{theme}: missing {token}"

# Typography comes from shared brand tokens, not the obsolete Manrope/Inter stack.
base=css_rule(":root")
assert re.search(r"--font-sans\s*:\s*[^;]*Plus Jakarta Sans",base), "Current brand font token missing"
assert re.search(r"--font-heading\s*:\s*[^;]*Plus Jakarta Sans",base), "Heading font token missing"
assert re.search(r"font-family\s*:\s*var\(--font-sans\)",css_rule("body")), "Body font token unused"

sitemap=(ROOT/"sitemap.xml").read_text(encoding="utf-8")
for page in PAGES:
    assert f"https://www.gyanart.com/{page}" in sitemap,f"Sitemap missing {page}"
print(f"PASS: {len(GRAPHICS)} valid, accessible SVG graphics referenced in all {len(PAGES)} case-study languages, with theme-aware GyanArt styling, JSON-LD and sitemap.")
