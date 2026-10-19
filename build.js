const fs=require("fs");
const path=require("path");
const crypto=require("crypto");

const root=__dirname;
const src=path.join(root,"src");
const dist=path.join(root,"dist");
function read(p){return fs.readFileSync(path.join(src,p),"utf8");}
function ensure(p){fs.mkdirSync(path.dirname(p),{recursive:true});}
const site=JSON.parse(read("data/site.json"));
const header=read("components/header.html");
const footer=read("components/footer.html");
const pages=JSON.parse(read("data/pages.json"));
const cssVersion=crypto.createHash("sha256").update(read("styles/site.css")).digest("hex").slice(0,12);
const jsVersion=crypto.createHash("sha256").update(read("scripts/main.js")).digest("hex").slice(0,12);
const faviconVersion=crypto.createHash("sha256").update(read("favicon.svg")).digest("hex").slice(0,12);
const whatsappNumber=String(site.whatsapp || "").replace(/\D/g,"");
const whatsappDisplay=whatsappNumber.startsWith("91")
  ? "+91 "+whatsappNumber.slice(2,7)+" "+whatsappNumber.slice(7)
  : whatsappNumber;

fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});

function render(page){
  let body=read(page.content);
  const nested=page.output.includes("/");
  const prefix="../".repeat(page.output.split("/").length-1);
  const lang=page.lang||"en";
  const slug=page.slug||path.basename(page.output);
  if(!(page.isHome || page.output==="index.html" || page.noBreadcrumbs)){
    body=body.replace('<section class="section"', '<section class="section page-intro"');
  }
  const labels={
    "how-it-works.html":"How It Works","solutions.html":"Solutions",
    "growth-experiments.html":"Growth Experiments","pricing.html":"Pricing",
    "about.html":"About Gyan","insights.html":"Insights",
    "growth-audit.html":"Free Growth Audit","contact.html":"Contact","faqs.html":"FAQs",
    "experiments/dental-clinic.html":"Dental Clinic",
    "experiments/professional-services.html":"Professional Services",
    "experiments/appliance-repair.html":"Appliance Repair",
    "experiments/restaurant.html":"Restaurant",
    "local-seo-services.html":"Local SEO Services",
    "google-business-profile-optimization.html":"Google Business Profile",
    "website-design.html":"Website Design","logo-design.html":"Logo Design","portfolio.html":"Our Work","case-studies/mayura-cafe.html":"Mayura Cafe Case Study","privacy-policy.html":"Privacy Policy","terms-and-conditions.html":"Terms & Conditions"
  };
  const parent={
    "case-studies/mayura-cafe.html":["Our Work","portfolio.html"],
    "experiments/dental-clinic.html":["Growth Experiments","growth-experiments.html"],
    "experiments/professional-services.html":["Growth Experiments","growth-experiments.html"],
    "experiments/appliance-repair.html":["Growth Experiments","growth-experiments.html"],
    "experiments/restaurant.html":["Growth Experiments","growth-experiments.html"],
    "local-seo-services.html":["Solutions","solutions.html"],
    "google-business-profile-optimization.html":["Solutions","solutions.html"],
    "website-design.html":["Solutions","solutions.html"],
    "logo-design.html":["Solutions","solutions.html"]
  };
  const homeHref=lang==="en"?prefix+"index.html":"../".repeat(Math.max(0,page.output.split("/").length-2))+"index.html";
  const crumbParts=[{label:lang==="kn"?"ಮುಖಪುಟ":lang==="hi"?"होम":"Home",href:homeHref}];
  if(parent[slug]) crumbParts.push({label:parent[slug][0],href:lang==="en"?prefix+parent[slug][1]:"../".repeat(Math.max(0,page.output.split("/").length-2))+parent[slug][1]});
  if(labels[slug]) crumbParts.push({label:labels[slug]});
  const breadcrumb=(page.isHome || page.output==="index.html")?"":'<nav class="breadcrumbs container" aria-label="Breadcrumb"><ol>'+crumbParts.map((c,i)=>'<li>'+(c.href?'<a href="'+c.href+'">'+c.label+'</a>': '<span aria-current="page">'+c.label+'</span>')+'</li>').join('<li class="breadcrumb-separator" aria-hidden="true">/</li>')+'</ol></nav>';
  let pageContent=body;
  if(!(page.isHome || page.output==="index.html" || page.noBreadcrumbs)){
    const introEnd=body.indexOf("</section>");
    if(introEnd===-1) throw new Error("Could not locate first section on "+page.output);
    const intro=body.slice(0,introEnd+"</section>".length);
    const remainder=body.slice(introEnd+"</section>".length);
    pageContent='<div class="page-top">'+breadcrumb+intro+'</div>'+remainder;
  }
  const availableSlugs=new Set(pages.filter(p=>(p.lang||"en")===lang).map(p=>p.slug||path.basename(p.output)));
  const navHref=(target)=>lang==="en"?prefix+target:(availableSlugs.has(target)?"../".repeat(Math.max(0,page.output.split("/").length-2))+target:prefix+target);
  const navLabels=lang==="kn"?{how:"ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",solutions:"ಸೇವೆಗಳು",solutionsAll:"ಎಲ್ಲಾ ಸೇವೆಗಳು",websiteDesign:"ವೆಬ್‌ಸೈಟ್ ವಿನ್ಯಾಸ",logoDesign:"ಲೋಗೋ ವಿನ್ಯಾಸ",localSeo:"ಸ್ಥಳೀಯ SEO ಸೇವೆಗಳು",gbp:"Google Business Profile",experiments:"ಬೆಳವಣಿಗೆ ಉದಾಹರಣೆಗಳು",work:"ನಮ್ಮ ಕೆಲಸ",pricing:"ಬೆಲೆಗಳು",about:"ನಮ್ಮ ಬಗ್ಗೆ",insights:"ಮಾಹಿತಿ",audit:"ಉಚಿತ ಪರಿಶೀಲನೆ",language:"ಭಾಷೆ"}:lang==="hi"?{how:"कैसे काम करता है",solutions:"सेवाएं",solutionsAll:"सभी सेवाएं",websiteDesign:"वेबसाइट डिज़ाइन",logoDesign:"लोगो डिज़ाइन",localSeo:"लोकल SEO सेवाएं",gbp:"Google Business Profile",experiments:"ग्रोथ उदाहरण",work:"हमारा काम",pricing:"कीमतें",about:"हमारे बारे में",insights:"जानकारी",audit:"मुफ़्त ऑडिट",language:"भाषा"}:{how:"How It Works",solutions:"Solutions",solutionsAll:"All Solutions",websiteDesign:"Website Design",logoDesign:"Logo Design",localSeo:"Local SEO Services",gbp:"Google Business Profile",experiments:"Growth Experiments",work:"Our Work",pricing:"Pricing",about:"About Gyan",insights:"Insights",audit:"Get Free Growth Audit",language:"Language"};
  const languageItems=[{code:"en",name:"English"},{code:"kn",name:"ಕನ್ನಡ"},{code:"hi",name:"हिन्दी"}];
  const equivalentSlug=p=>p.slug||(p.output.startsWith("experiments/")?p.output:path.basename(p.output));
  const languageOptions=languageItems.map(item=>{
    const peer=pages.find(p=>(p.lang||"en")===item.code&&equivalentSlug(p)===equivalentSlug(page));
    const targetPage=peer||pages.find(p=>(p.lang||"en")===item.code&&equivalentSlug(p)==="index.html");
    if(!targetPage) throw new Error("Missing language destination for "+item.code+" on "+page.output);
    const home=targetPage.isHome||targetPage.output==="index.html";
    const destination=home?(item.code==="en"?"./":item.code+"/"):targetPage.output;
    const target=prefix+destination;
    return '<a href="'+target+'" lang="'+item.code+'"'+(item.code===lang?' aria-current="true"':"")+">"+item.name+"</a>";
  }).join("");
  const nav=header.replaceAll("{{SITE_NAME}}",site.name)
    .replaceAll("{{HREF_HOME}}",navHref("index.html"))
    .replaceAll("{{HREF_BRAND_ICON}}",prefix+"favicon.svg?v="+faviconVersion)
    .replaceAll("{{HREF_HOW}}",navHref("how-it-works.html"))
    .replaceAll("{{HREF_SOLUTIONS}}",navHref("solutions.html"))
    .replaceAll("{{HREF_WEBSITE_DESIGN}}",navHref("website-design.html"))
    .replaceAll("{{HREF_LOGO_DESIGN}}",navHref("logo-design.html"))
    .replaceAll("{{HREF_LOCAL_SEO}}",navHref("local-seo-services.html"))
    .replaceAll("{{HREF_GBP}}",navHref("google-business-profile-optimization.html"))
    .replaceAll("{{HREF_EXPERIMENTS}}",navHref("growth-experiments.html"))
    .replaceAll("{{HREF_PORTFOLIO}}",navHref("portfolio.html"))
    .replaceAll("{{HREF_PRICING}}",navHref("pricing.html"))
    .replaceAll("{{HREF_ABOUT}}",navHref("about.html"))
    .replaceAll("{{HREF_INSIGHTS}}",navHref("insights.html"))
    .replaceAll("{{HREF_AUDIT}}",navHref("growth-audit.html"))
    .replaceAll("{{NAV_HOW}}",navLabels.how).replaceAll("{{NAV_SOLUTIONS}}",navLabels.solutions)
    .replaceAll("{{NAV_SOLUTIONS_ALL}}",navLabels.solutionsAll).replaceAll("{{NAV_WEBSITE_DESIGN}}",navLabels.websiteDesign).replaceAll("{{NAV_LOGO_DESIGN}}",navLabels.logoDesign)
    .replaceAll("{{NAV_LOCAL_SEO}}",navLabels.localSeo).replaceAll("{{NAV_GBP}}",navLabels.gbp)
    .replaceAll("{{NAV_EXPERIMENTS}}",navLabels.experiments).replaceAll("{{NAV_WORK}}",navLabels.work).replaceAll("{{NAV_PRICING}}",navLabels.pricing)
    .replaceAll("{{NAV_ABOUT}}",navLabels.about).replaceAll("{{NAV_INSIGHTS}}",navLabels.insights)
    .replaceAll("{{NAV_AUDIT}}",navLabels.audit).replaceAll("{{LANGUAGE_LABEL}}",navLabels.language)
    .replaceAll("{{LANGUAGE_OPTIONS}}",languageOptions);
  const footerPrefix=lang==="en"?prefix:"../".repeat(Math.max(0,page.output.split("/").length-2));
  const foot=footer.replaceAll("{{SITE_NAME}}",site.name).replaceAll("{{TAGLINE}}",site.tagline)
    .replaceAll('href="index.html"','href="'+footerPrefix+'index.html"')
    .replaceAll('href="how-it-works.html"','href="'+footerPrefix+'how-it-works.html"')
    .replaceAll('href="solutions.html"','href="'+footerPrefix+'solutions.html"')
    .replaceAll('href="growth-experiments.html"','href="'+footerPrefix+'growth-experiments.html"')
    .replaceAll('href="portfolio.html"','href="'+footerPrefix+'portfolio.html"')
    .replaceAll('href="pricing.html"','href="'+footerPrefix+'pricing.html"')
    .replaceAll('href="about.html"','href="'+footerPrefix+'about.html"')
    .replaceAll('href="insights.html"','href="'+footerPrefix+'insights.html"')
    .replaceAll('href="faqs.html"','href="'+footerPrefix+'faqs.html"')
    .replaceAll('href="privacy-policy.html"','href="'+footerPrefix+'privacy-policy.html"')
    .replaceAll('href="terms-and-conditions.html"','href="'+footerPrefix+'terms-and-conditions.html"')
    .replaceAll('href="contact.html"','href="'+footerPrefix+'contact.html"')
    .replaceAll('href="growth-audit.html"','href="'+footerPrefix+'growth-audit.html"');
    const pageLang=page.lang||"en";
  const pageLocale=page.locale||({kn:"kn_IN",hi:"hi_IN",en:"en_IN"}[pageLang]||"en_IN");
  const pageSlug=equivalentSlug(page);
  const matchingPages=pages.filter(p=>equivalentSlug(p)===pageSlug);
  const alternates=matchingPages.map(p=>{const code=p.lang||"en";const url=(p.isHome||p.output==="index.html")?(code==="en"?"https://www.gyanart.com/":"https://www.gyanart.com/"+code+"/"):"https://www.gyanart.com/"+p.output;return '<link rel="alternate" hreflang="'+code+'" href="'+url+'">\n';}).join("")+
    '<link rel="alternate" hreflang="x-default" href="'+(matchingPages.find(p=>(p.lang||"en")==="en") ? (matchingPages.find(p=>(p.lang||"en")==="en").output==="index.html" ? "https://www.gyanart.com/" : "https://www.gyanart.com/"+matchingPages.find(p=>(p.lang||"en")==="en").output) : "https://www.gyanart.com/")+'">\n';
  // Only the measured English Website Design page uses this progressive CSS path.
  // Keep a non-JS fallback and leave other pages on their current stylesheet path.
  const stylesheetHref=prefix+"css/site.css?v="+cssVersion;
  const stylesheetTag=page.output==="website-design.html"
    ? `<style data-critical="website-design">\n${read("styles/critical-website-design.css")}\n</style>\n`+
      `<link rel="preload" as="style" href="${stylesheetHref}">\n`+
      `<link rel="stylesheet" href="${stylesheetHref}" media="print" onload="this.media='all'">\n`+
      `<noscript><link rel="stylesheet" href="${stylesheetHref}"></noscript>\n`
    : `<link rel="stylesheet" href="${stylesheetHref}">\n`;
  const html="<!doctype html>\n<html lang=\""+pageLang+"\">\n<head>\n"+
    '<meta charset="utf-8">\n'+
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'+
    '<meta name="theme-color" content="#F8F8F6">\n'+
    stylesheetTag+
    '<meta name="description" content="'+page.description+'">\n'+
    ((page.noindex || process.env.PREVIEW_BUILD === "true") ? '<meta name="robots" content="noindex,follow">\n' : '')+
    '<meta property="og:site_name" content="'+site.name+'">\n'+
    '<meta property="og:image" content="https://www.gyanart.com/assets/og-gyanart.svg">\n'+
    '<meta property="og:image:type" content="image/svg+xml">\n'+
    '<meta property="og:image:width" content="1200">\n'+
    '<meta property="og:image:height" content="630">\n'+
    '<meta property="og:image:alt" content="GyanArt — Help more local customers find and choose your business. UX-led digital growth for local businesses.">\n'+
    '<meta property="og:locale" content="'+pageLocale+'">\n'+
    alternates+
    '<meta name="twitter:card" content="summary_large_image">\n'+
    '<meta name="twitter:image" content="https://www.gyanart.com/assets/og-gyanart.svg">\n'+
    '<meta property="og:title" content="'+page.title+'">\n'+
    '<meta property="og:description" content="'+page.description+'">\n'+
    '<meta property="og:type" content="website">\n'+
    '<meta property="og:url" content="https://www.gyanart.com/'+(page.isHome ? (page.lang ? page.lang+"/" : "") : (page.output === "index.html" ? "" : page.output))+'">\n'+
    '<link rel="canonical" href="https://www.gyanart.com/'+(page.isHome ? (page.lang ? page.lang+"/" : "") : (page.output === "index.html" ? "" : page.output))+'">\n'+
    '<title>'+page.title+'</title>\n'+
    '<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"GyanArt","url":"https://www.gyanart.com/","description":"UX-led digital growth support for local businesses, including local SEO, Google Business Profile optimization and conversion-focused website design.","email":"info@gyanart.com","areaServed":{"@type":"City","name":"Bengaluru"},"knowsAbout":["Local SEO","Google Business Profile optimization","Website UX","Website design","Conversion optimization","Digital growth strategy"],"founder":{"@type":"Person","name":"Gyaneshwar","jobTitle":"UX Designer and Digital Growth Consultant"}})+'</script>\n'+
    '<link rel="icon" type="image/svg+xml" href="'+prefix+'favicon.svg?v='+faviconVersion+'">\n'+
    '<script>\n'+
    '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "yxvmsm9pma");\n'+
    '</script>\n'+
    '<script async src="https://www.googletagmanager.com/gtag/js?id=G-D0JCS746B6"></script>\n'+
    '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-D0JCS746B6");</script>\n'+
    '</head>\n<body>\n'+nav+'\n<main>\n'+pageContent+'\n</main>\n'+foot+
    '<script src="'+prefix+'js/main.js?v='+jsVersion+'" defer></script>\n</body>\n</html>\n';
  const safeHtml=html
    .replaceAll("919999999999",whatsappNumber)
    .replaceAll("+91 99999 99999",whatsappDisplay)
    .replaceAll("99999 99999",whatsappDisplay.replace("+91 ",""));
  const out=path.join(dist,page.output);
  ensure(out);
  fs.writeFileSync(out,safeHtml);
}
pages.forEach(render);
ensure(path.join(dist,"css/site.css"));
ensure(path.join(dist,"js/main.js"));
fs.copyFileSync(path.join(src,"styles/site.css"),path.join(dist,"css/site.css"));
fs.copyFileSync(path.join(src,"scripts/main.js"),path.join(dist,"js/main.js"));
fs.copyFileSync(path.join(src,"favicon.svg"),path.join(dist,"favicon.svg"));
ensure(path.join(dist,"assets/og-gyanart.svg"));
fs.copyFileSync(path.join(src,"og-gyanart.svg"),path.join(dist,"assets/og-gyanart.svg"));
const assetsDir=path.join(src,"assets");
if(fs.existsSync(assetsDir)) fs.cpSync(assetsDir,path.join(dist,"assets"),{recursive:true});
fs.copyFileSync(path.join(src,"robots.txt"),path.join(dist,"robots.txt"));
const sitemapUrls=pages.filter(page=>!page.noindex).map(page=>(page.isHome||page.output==="index.html")?(page.lang?"https://www.gyanart.com/"+page.lang+"/":"https://www.gyanart.com/"):"https://www.gyanart.com/"+page.output);
const sitemapXml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+sitemapUrls.map(url=>'  <url><loc>'+url+'</loc></url>').join("\n")+'\n</urlset>\n';
fs.writeFileSync(path.join(dist,"sitemap.xml"),sitemapXml);
fs.copyFileSync(path.join(src,"submit-form.php"),path.join(dist,"submit-form.php"));
const htmlFiles=[];
function collectHtml(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) collectHtml(full);
    else if(entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
collectHtml(dist);
for(const file of htmlFiles){
  const html=fs.readFileSync(file,"utf8");
  if(html.includes("919999999999") || html.includes("+91 99999 99999")){
    throw new Error("Legacy WhatsApp placeholder remains in "+path.relative(dist,file));
  }
  const relativeFavicon=path.relative(path.dirname(file),path.join(dist,"favicon.svg")).replace(/\\\\/g,"/");
  if(!html.includes('href="'+relativeFavicon+'?v='+faviconVersion+'"')){
    throw new Error("Favicon link is missing or incorrect in "+path.relative(dist,file));
  }
}
const contactHtml=fs.readFileSync(path.join(dist,"contact.html"),"utf8");
if(!contactHtml.includes("https://wa.me/"+whatsappNumber) || !contactHtml.includes(whatsappDisplay)){
  throw new Error("Contact page WhatsApp number/link does not match src/data/site.json");
}
const htaccess = `DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Redirect legacy URLs to the closest current equivalent in one hop.
  RewriteRule ^index\\.(html|htm)$ https://www.gyanart.com/ [R=301,L,NC]
  RewriteRule ^website_design\\.htm$ https://www.gyanart.com/website-design.html [R=301,L,NC]
  RewriteRule ^website-design/?$ https://www.gyanart.com/website-design.html [R=301,L,NC]
  RewriteRule ^logo_design\\.htm$ https://www.gyanart.com/logo-design.html [R=301,L,NC]
  RewriteRule ^about-us\\.html$ https://www.gyanart.com/about.html [R=301,L,NC]
  RewriteRule ^website-design-portfolio\\.html$ https://www.gyanart.com/website-design.html [R=301,L,NC]
  RewriteRule ^testimonials\\.html$ - [G,L]

  # Canonicalize all other requests to HTTPS on the preferred www hostname.
  RewriteCond %{HTTPS} !=on [OR]
  RewriteCond %{HTTP_HOST} !^www\\.gyanart\\.com$ [NC]
  RewriteRule ^ https://www.gyanart.com%{REQUEST_URI} [R=301,L]
</IfModule>

# Keep HTML revalidatable so deployments appear promptly.
<IfModule mod_headers.c>
  <FilesMatch "\\.(html|php)$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
  <Files "submit-form.php">
    Header set Cache-Control "no-store, no-cache, must-revalidate"
  </Files>
</IfModule>

# Cache versioned static assets; build.js adds content-hash query strings to CSS and JS.
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(css|js|jpg|jpeg|png|webp|avif|svg|woff2)$">
    Header set Cache-Control "public, max-age=31536000"
  </FilesMatch>
</IfModule>

# Enable compression when the hosting server provides mod_deflate.
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
`;
fs.writeFileSync(path.join(dist,".htaccess"), htaccess);
if(!fs.existsSync(path.join(dist,"submit-form.php"))) throw new Error("PHP form handler was not copied to dist/");
console.log("Built",pages.length,"pages to dist/; content-hashed CSS/JS URLs, cache/compression rules, WhatsApp contact, favicon, PHP form handler, and directory index verified across",htmlFiles.length,"HTML files.");
