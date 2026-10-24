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
    "website-design.html":"Website Design","logo-design.html":"Logo Design","portfolio.html":"Our Work","case-studies/mayura-cafe.html":"Mayura Cafe Case Study","privacy-policy.html":"Privacy Policy","terms-and-conditions.html":"Terms & Conditions","404.html":"Page Not Found",
    "insights/why-visitors-dont-contact-you.html":"Why Visitors Don't Contact You",
    "insights/google-business-profile-local-seo-guide.html":"Google Business Profile Guide",
    "insights/ai-search-google-visibility-local-business.html":"AI Search Visibility Guide",
    "insights/designing-website-customer-journey.html":"Customer Journey Guide",
    "insights/website-design-cost-in-bangalore.html":"Website Design Cost Guide",
    "restaurants.html":"Restaurants & Cafes",
    "professional-services.html":"Professional Services",
    "website-design-whitefield.html":"Whitefield Web Design",
    "website-design-hsr-layout.html":"HSR Layout Web Design"
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
    "logo-design.html":["Solutions","solutions.html"],
    "insights/why-visitors-dont-contact-you.html":["Insights","insights.html"],
    "insights/google-business-profile-local-seo-guide.html":["Insights","insights.html"],
    "insights/ai-search-google-visibility-local-business.html":["Insights","insights.html"],
    "insights/designing-website-customer-journey.html":["Insights","insights.html"],
    "insights/website-design-cost-in-bangalore.html":["Insights","insights.html"],
    "restaurants.html":["Solutions","solutions.html"],
    "professional-services.html":["Solutions","solutions.html"],
    "website-design-whitefield.html":["Solutions","solutions.html"],
    "website-design-hsr-layout.html":["Solutions","solutions.html"]
  };
  const parentLabels = {
    "Insights": { en: "Insights", kn: "ಮಾಹಿತಿ", hi: "जानकारी" },
    "Solutions": { en: "Solutions", kn: "ಸೇವೆಗಳು", hi: "सेवाएं" },
    "Growth Experiments": { en: "Growth Experiments", kn: "ಬೆಳವಣಿಗೆ ಉದಾಹರಣೆಗಳು", hi: "ग्रोथ उदाहरण" },
    "Our Work": { en: "Our Work", kn: "ನಮ್ಮ ಕೆಲಸ", hi: "हमारा काम" }
  };
  const articleCrumbLabels = {
    "insights/why-visitors-dont-contact-you.html": {
      en: "Why Visitors Don't Contact You",
      kn: "ಸಂದರ್ಶಕರು ಸಂಪರ್ಕಿಸದಿರಲು ಕಾರಣ",
      hi: "विज़िटर्स संपर्क क्यों नहीं करते"
    },
    "insights/google-business-profile-local-seo-guide.html": {
      en: "Google Business Profile Guide",
      kn: "Google Business Profile ಮಾರ್ಗದರ್ಶಿ",
      hi: "Google Business Profile गाइड"
    },
    "insights/ai-search-google-visibility-local-business.html": {
      en: "AI Search Visibility Guide",
      kn: "AI ಸರ್ಚ್ ಗೋಚರತೆ ಮಾರ್ಗದರ್ಶಿ",
      hi: "AI सर्च विजिबिलिटी गाइड"
    },
    "insights/designing-website-customer-journey.html": {
      en: "Customer Journey Guide",
      kn: "ಗ್ರಾಹಕ ಪ್ರಯಾಣ ಮಾರ್ಗದರ್ಶಿ",
      hi: "ग्राहक यात्रा गाइड"
    },
    "insights/website-design-cost-in-bangalore.html": {
      en: "Website Design Cost Guide",
      kn: "ವೆಬ್‌ಸೈಟ್ ವಿನ್ಯಾಸ ವೆಚ್ಚ ಗೈಡ್",
      hi: "वेबसाइट डिज़ाइन लागत गाइड"
    },
    "restaurants.html": {
      en: "Restaurants & Cafes",
      kn: "ರೆಸ್ಟೋರೆಂಟ್‌ಗಳು ಮತ್ತು ಕೆಫೆಗಳು",
      hi: "रेस्टोरेंट और कैफ़े"
    },
    "professional-services.html": {
      en: "Professional Services",
      kn: "ವೃತ್ತಿಪರ ಸೇವೆಗಳು",
      hi: "पेशेवर सेवाएं"
    },
    "website-design-whitefield.html": {
      en: "Whitefield Web Design",
      kn: "ವೈಟ್‌ಫೀಲ್ಡ್ ವೆಬ್‌ಸೈಟ್ ವಿನ್ಯಾಸ",
      hi: "व्हाइटफील्ड वेबसाइट डिज़ाइन"
    },
    "website-design-hsr-layout.html": {
      en: "HSR Layout Web Design",
      kn: "ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್ ವೆಬ್‌ಸೈಟ್ ವಿನ್ಯಾಸ",
      hi: "एचएसआर लेआउट वेबसाइट डिज़ाइन"
    }
  };
  const homeHref=lang==="en"?prefix+"index.html":"../".repeat(Math.max(0,page.output.split("/").length-2))+"index.html";
  const crumbParts=[{label:lang==="kn"?"ಮುಖಪುಟ":lang==="hi"?"होम":"Home",href:homeHref}];
  if(parent[slug]) {
    const parentName = parentLabels[parent[slug][0]] ? (parentLabels[parent[slug][0]][lang] || parent[slug][0]) : parent[slug][0];
    crumbParts.push({label:parentName,href:lang==="en"?prefix+parent[slug][1]:"../".repeat(Math.max(0,page.output.split("/").length-2))+parent[slug][1]});
  }
  const currentCrumbLabel = (articleCrumbLabels[slug] && articleCrumbLabels[slug][lang]) || labels[slug];
  if(currentCrumbLabel) crumbParts.push({label:currentCrumbLabel});
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
  const navHref=(target)=>{ if(target==="index.html" && lang==="en") return prefix || "/"; return lang==="en"?prefix+target:(availableSlugs.has(target)?"../".repeat(Math.max(0,page.output.split("/").length-2))+target:prefix+target); };
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
    .replaceAll('href="index.html"','href="'+(footerPrefix || "/")+'"')
    .replaceAll('href="starter-website-offer.html"','href="'+footerPrefix+'starter-website-offer.html"')
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
  const stylesheetHref=prefix+"css/site.css?v="+cssVersion;
  const stylesheetTag=`<link rel="stylesheet" href="${stylesheetHref}">\n`;
  const primarySchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "GyanArt",
    "alternateName": ["Gyanart Web Design", "GyanArt Digital Growth Consultancy"],
    "url": "https://www.gyanart.com/",
    "logo": "https://www.gyanart.com/assets/og-gyanart.png",
    "image": "https://www.gyanart.com/assets/og-gyanart.png",
    "description": "UX-led digital growth support for local businesses, including conversion-focused website design, local SEO, and Google Business Profile optimization in Bangalore.",
    "telephone": "+91-9880208870",
    "email": "info@gyanart.com",
    "priceRange": "₹10,000 - ₹37,000",
    "hasMap": "https://maps.app.goo.gl/QYAzaKxRDyMyX7RA6",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "A107, Hilife Pearl Shell, Balagere Road, Varthur",
      "addressLocality": "Bengaluru",
      "postalCode": "560087",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.9395061,
      "longitude": 77.7299794
    },
    "areaServed": [
      {"@type": "City", "name": "Bengaluru"},
      {"@type": "AdministrativeArea", "name": "Varthur"},
      {"@type": "AdministrativeArea", "name": "Balagere"},
      {"@type": "AdministrativeArea", "name": "Marathahalli"},
      {"@type": "AdministrativeArea", "name": "Whitefield"},
      {"@type": "AdministrativeArea", "name": "HSR Layout"},
      {"@type": "AdministrativeArea", "name": "Koramangala"},
      {"@type": "AdministrativeArea", "name": "Indiranagar"},
      {"@type": "AdministrativeArea", "name": "BTM Layout"},
      {"@type": "AdministrativeArea", "name": "Bellandur"}
    ],
    "founder": {
      "@type": "Person",
      "name": "Gyaneshwar",
      "jobTitle": "UX Designer and Digital Growth Consultant",
      "sameAs": "https://www.linkedin.com/in/uxgyan/"
    },
    "sameAs": [
      "https://maps.app.goo.gl/QYAzaKxRDyMyX7RA6",
      "https://www.linkedin.com/in/uxgyan/",
      "https://www.youtube.com/@gyanart",
      "https://www.instagram.com/gyanehswar.mule/"
    ],
    "knowsAbout": [
      "Website Design",
      "Local SEO",
      "Google Business Profile optimization",
      "Website UX",
      "Conversion optimization",
      "Digital growth strategy"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "7"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Website Design and Local Digital Growth Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "Digital Foundation",
          "price": "10000",
          "priceCurrency": "INR",
          "description": "Responsive website setup for up to 5 standard pages, click-to-call, WhatsApp actions, and Google Business Profile optimization."
        },
        {
          "@type": "Offer",
          "name": "Enquiry Builder",
          "price": "25000",
          "priceCurrency": "INR",
          "description": "Up to 10 standard pages, custom visual styling, conversion-focused page layout, enquiry forms, and local SEO setup."
        },
        {
          "@type": "Offer",
          "name": "Growth Optimization",
          "price": "37000",
          "priceCurrency": "INR",
          "description": "Up to 30 standard pages, tailored layouts, structured measurement, and baseline performance review."
        }
      ]
    }
  };
  let pageSchemaTags = '<script type="application/ld+json">' + JSON.stringify(primarySchema) + '</script>\n';

  if (page.isHome || page.output === "index.html") {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "GyanArt",
      "alternateName": ["GyanArt Web Design", "GyanArt Digital Growth"],
      "url": "https://www.gyanart.com/",
      "description": "UX-led website design and local SEO services for small businesses in Bangalore.",
      "publisher": {
        "@type": "Organization",
        "name": "GyanArt"
      }
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(websiteSchema) + '</script>\n';

    const homeFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do you work with small businesses?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. GyanArt works with businesses where improving digital discovery, trust and customer actions can make a meaningful difference."
          }
        },
        {
          "@type": "Question",
          "name": "Do you guarantee Google rankings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Search rankings depend on many factors outside anyone's control. The focus is on sound practices, useful experiences and measurable improvement."
          }
        },
        {
          "@type": "Question",
          "name": "Do you work outside Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Work is delivered remotely, with Bangalore as the initial focus and India-wide or selective international engagements possible."
          }
        },
        {
          "@type": "Question",
          "name": "Do you build websites?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, when a website is part of the growth problem. Rebuilding a website isn't automatically the answer."
          }
        },
        {
          "@type": "Question",
          "name": "Are advertising costs included?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Advertising spend is separate and paid directly by the client to the advertising platform."
          }
        },
        {
          "@type": "Question",
          "name": "Can you improve an existing website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The first step is to understand the current customer journey and identify what needs to change."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(homeFaqSchema) + '</script>\n';
  }

  if (!(page.isHome || page.output === "index.html") && crumbParts && crumbParts.length > 1) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": crumbParts.map((crumb, idx) => {
        let itemUrl = "https://www.gyanart.com/";
        if (idx === 0) {
          itemUrl = lang === "en" ? "https://www.gyanart.com/" : "https://www.gyanart.com/" + lang + "/";
        } else if (idx === crumbParts.length - 1) {
          itemUrl = "https://www.gyanart.com/" + page.output;
        } else if (parent[slug]) {
          itemUrl = "https://www.gyanart.com/" + (lang === "en" ? "" : lang + "/") + parent[slug][1];
        }
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "name": crumb.label,
          "item": itemUrl
        };
      })
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(breadcrumbSchema) + '</script>\n';
  }

  if (pageSlug === "website-design.html") {
    const websiteDesignServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Website Design for Small Businesses in Bangalore",
      "serviceType": "Website Design and Development",
      "description": "UX-led, conversion-focused mobile-friendly website design for small businesses in Bangalore, built around clear information, trust, and enquiry actions.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "GyanArt",
        "url": "https://www.gyanart.com/"
      },
      "areaServed": primarySchema.areaServed,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Website Design Packages",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Digital Foundation",
            "price": "10000",
            "priceCurrency": "INR",
            "description": "Up to 5 standard responsive pages, mobile click-to-call, WhatsApp actions, and Google Business Profile basics."
          },
          {
            "@type": "Offer",
            "name": "Enquiry Builder",
            "price": "25000",
            "priceCurrency": "INR",
            "description": "Up to 10 standard pages, custom styling, conversion-focused page layout, and enquiry tracking."
          },
          {
            "@type": "Offer",
            "name": "Growth Optimization",
            "price": "37000",
            "priceCurrency": "INR",
            "description": "Up to 30 pages, tailored service structure, and advanced measurement."
          }
        ]
      }
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(websiteDesignServiceSchema) + '</script>\n';

    const websiteDesignFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does a small-business website cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt website setup packages currently start at ₹10,000 for standard local business sites, with ₹25,000 and ₹37,000 tiers for custom structures, larger page limits, and deeper enquiry tracking."
          }
        },
        {
          "@type": "Question",
          "name": "Will a new website automatically rank on Google?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. A search-ready structure helps, but rankings also depend on relevance, competition, content quality, links and other factors. A website should be built around useful information and a clear customer journey, not ranking promises."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to rebuild my existing website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not always. We first review content, mobile usability, performance, search structure and enquiry paths. Focused improvements may be enough."
          }
        },
        {
          "@type": "Question",
          "name": "Can you help people find the website locally?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Website improvements can be paired with local SEO and Google Business Profile optimization to strengthen the overall discovery and enquiry journey."
          }
        },
        {
          "@type": "Question",
          "name": "Which areas in Bangalore do you serve for website design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt works with small businesses across Bangalore, including Varthur, Balagere, Marathahalli, Whitefield, HSR Layout, Koramangala, Indiranagar, Bellandur, and BTM Layout."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(websiteDesignFaqSchema) + '</script>\n';
  } else if (pageSlug === "local-seo-services.html") {
    const localSeoServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Local SEO Services in Bangalore",
      "serviceType": "Local Search Engine Optimization",
      "description": "Local SEO setup, on-page location optimization, local keyword alignment, and Google search visibility support for small businesses across Bangalore.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "GyanArt",
        "url": "https://www.gyanart.com/"
      },
      "areaServed": primarySchema.areaServed,
      "offers": {
        "@type": "Offer",
        "price": "1000",
        "priceCurrency": "INR",
        "description": "Monthly Local SEO and Google Business Profile maintenance starting from ₹1,000 to ₹3,000 per month."
      }
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(localSeoServiceSchema) + '</script>\n';

    const localSeoFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can you guarantee a Google ranking?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Local results depend on factors including relevance, distance, prominence and competition. GyanArt focuses on sound improvements and transparent measurement, not ranking guarantees."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a new website for local SEO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not necessarily. We first assess whether your current site can support the customer journey with targeted improvements."
          }
        },
        {
          "@type": "Question",
          "name": "Which Bangalore neighbourhoods do you provide Local SEO for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt provides local SEO and Google Business Profile optimization across Bangalore, with primary focus on East and South-East tech corridors: Varthur, Balagere, Whitefield, Marathahalli, Bellandur, Sarjapur Road, HSR Layout, Koramangala, Indiranagar, and BTM Layout."
          }
        },
        {
          "@type": "Question",
          "name": "Is advertising spend included in local SEO?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Any advertising budget is separate and paid directly by you to the platform."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(localSeoFaqSchema) + '</script>\n';
  } else if (pageSlug === "google-business-profile-optimization.html") {
    const gbpServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Google Business Profile Optimization in Bangalore",
      "serviceType": "Google Business Profile and Maps Optimization",
      "description": "Verification, category selection, NAP consistency, service descriptions, and review response guidance for Google Business Profiles in Bangalore.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "GyanArt",
        "url": "https://www.gyanart.com/"
      },
      "areaServed": primarySchema.areaServed
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(gbpServiceSchema) + '</script>\n';

    const gbpFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can optimization guarantee a top position on Google Maps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Local results depend on relevance, distance, prominence, competition and other factors. No provider can guarantee a particular position."
          }
        },
        {
          "@type": "Question",
          "name": "Do customer reviews matter on Google Business Profile?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Reviews can help people evaluate a business and can contribute to local prominence. Ask real customers for honest feedback and never buy or fabricate reviews."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a website if I have a Google Business Profile?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A useful website gives customers more detail about services, expertise, policies and next steps. The profile and website should support one another."
          }
        },
        {
          "@type": "Question",
          "name": "How do I know if the profile is helping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Monitor available profile interactions alongside website visits, calls, form submissions and qualified enquiries. Rankings and profile views alone do not show the whole business outcome."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(gbpFaqSchema) + '</script>\n';
  } else if (pageSlug === "logo-design.html") {
    const logoServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Logo & Brand Identity Design in Bangalore",
      "serviceType": "Logo Design and Visual Identity",
      "description": "Practical logo design and brand identity kits for Bangalore small businesses across digital and print touchpoints.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "GyanArt",
        "url": "https://www.gyanart.com/"
      },
      "areaServed": primarySchema.areaServed
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(logoServiceSchema) + '</script>\n';
  } else if (pageSlug === "faqs.html") {
    const faqsPageSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does a small-business website cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt website packages currently start at ₹10,000 for standard 5-page small-business sites, ₹25,000 for up to 10 pages with custom styling and enquiry tracking, and ₹37,000 for up to 30 pages with advanced measurement."
          }
        },
        {
          "@type": "Question",
          "name": "Will a new website automatically rank on Google?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. A search-ready structure helps, but rankings also depend on relevance, competition, content quality, links, technical access and other factors."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a new website or can you improve my existing one?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We first review content, mobile usability, performance, search structure and the enquiry journey. Sometimes focused improvements are enough."
          }
        },
        {
          "@type": "Question",
          "name": "Can you guarantee a top Google or Maps ranking?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Local results depend on relevance, distance, prominence, competition and other factors. GyanArt focuses on sound improvements and transparent measurement, not guaranteed positions."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between local SEO and Google Business Profile optimization?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Google Business Profile work improves the usefulness and accuracy of your listing. Local SEO also considers your website, service pages, location relevance, internal links and the broader discovery journey."
          }
        },
        {
          "@type": "Question",
          "name": "How long does SEO take to improve traffic?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It varies with the site's current state, competition, content and crawl/indexing conditions. Technical changes can be recognized sooner, while ranking and traffic gains often take months."
          }
        },
        {
          "@type": "Question",
          "name": "What happens during a free growth audit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We review public information about your website, search presence and customer contact journey, then provide a concise summary of strengths, improvement opportunities and suggested next steps."
          }
        },
        {
          "@type": "Question",
          "name": "What should I prepare before starting a website project?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prepare a short description of your services, main customer types, service areas, preferred contact method, and existing website or brand assets."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(faqsPageSchema) + '</script>\n';
  } else if (pageSlug === "insights.html") {
    const insightsCollectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Local SEO, Website UX & Digital Growth Guides | GyanArt",
      "description": page.description,
      "url": "https://www.gyanart.com/insights.html",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "url": "https://www.gyanart.com/insights/why-visitors-dont-contact-you.html",
            "name": "Why Visitors Don't Contact You"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "url": "https://www.gyanart.com/insights/google-business-profile-local-seo-guide.html",
            "name": "Google Business Profile & Local SEO Guide"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "url": "https://www.gyanart.com/insights/ai-search-google-visibility-local-business.html",
            "name": "AI Search Visibility for Local Businesses"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "url": "https://www.gyanart.com/insights/designing-website-customer-journey.html",
            "name": "Designing the Website Customer Journey"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "url": "https://www.gyanart.com/insights/website-design-cost-in-bangalore.html",
            "name": "Website Design Cost in Bangalore"
          }
        ]
      }
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(insightsCollectionSchema) + '</script>\n';
  } else if (pageSlug === "pricing.html") {
    const pricingServiceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Website Design Packages & Pricing in Bangalore",
      "serviceType": "Small Business Website Design",
      "description": "Transparent website design setup packages and monthly support tiers for local businesses in Bangalore.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "GyanArt",
        "url": "https://www.gyanart.com/"
      },
      "areaServed": primarySchema.areaServed,
      "hasOfferCatalog": primarySchema.hasOfferCatalog
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(pricingServiceSchema) + '</script>\n';

    const pricingFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which website package fits my business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Choose Digital Foundation (₹10,000 setup) for up to 5 standard pages and Google Business Profile setup. Choose Enquiry Builder (₹25,000 setup) for up to 10 pages with conversion-focused design and monthly support. Choose Growth Optimization (₹37,000 setup) for up to 30 pages with structured analytics."
          }
        },
        {
          "@type": "Question",
          "name": "What do the website setup fees include?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "One-time setup fees cover a standard small-business responsive website within the listed page limit, contact details, click-to-call, WhatsApp actions, and local search basics. Complex custom integrations or hosting are quoted separately."
          }
        },
        {
          "@type": "Question",
          "name": "Is monthly support mandatory?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Monthly support (₹1,000 to ₹3,000 per month) is optional ongoing maintenance covering profile checks, visibility monitoring, and agreed small content updates."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(pricingFaqSchema) + '</script>\n';
  }
  if (pageSlug.startsWith("insights/")) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": page.title.split("|")[0].trim(),
      "description": page.description,
      "inLanguage": pageLang,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.gyanart.com/" + page.output
      },
      "author": {
        "@type": "Person",
        "name": "Gyaneshwar",
        "jobTitle": "UX Designer and Digital Growth Consultant",
        "url": "https://www.linkedin.com/in/uxgyan/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "GyanArt",
        "url": "https://www.gyanart.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.gyanart.com/assets/og-gyanart.svg"
        }
      },
      "datePublished": "2026-10-20",
      "dateModified": "2026-10-20"
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(articleSchema) + '</script>\n';
  }
  if (pageSlug === "insights/website-design-cost-in-bangalore.html") {
    const costFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does website design cost in Bangalore in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In Bangalore, small business website design typically costs ₹10,000 to ₹25,000 for standard 5-to-10 page brochure sites, ₹25,000 to ₹45,000 for customized conversion-focused sites, and ₹37,000 to ₹80,000+ for comprehensive platforms with booking or e-commerce."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between freelancer and agency website costs in Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Freelancers typically charge ₹10,000 to ₹40,000 per project with low overhead and direct communication. Traditional digital agencies charge ₹60,000 to ₹2,50,000+ to cover account managers and office overhead. GyanArt offers founder-led UX leadership at transparent freelancer-level rates."
          }
        },
        {
          "@type": "Question",
          "name": "What are the hidden costs of running a business website in Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard ongoing costs include domain name registration (₹800 to ₹1,200/year), reliable cloud or shared hosting (₹2,500 to ₹6,000/year), and monthly support or maintenance (₹1,000 to ₹3,000/month)."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(costFaqSchema) + '</script>\n';
  }
  if (pageSlug === "restaurants.html") {
    const restaurantFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why should a restaurant have a website if they are already on Zomato and Swiggy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Food delivery apps take substantial commissions (typically 18% to 28%) and display competitor advertisements alongside your listing. A dedicated website builds direct loyalty, captures high-margin in-person diners, and allows customers to navigate directly via Google Maps or book tables on WhatsApp without third-party fees."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a restaurant website design cost in Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt restaurant setup packages start at ₹10,000 for standard mobile-friendly websites with digital menus and directions, ₹25,000 for custom visual layouts with event booking funnels, and ₹37,000 for multi-location food businesses."
          }
        },
        {
          "@type": "Question",
          "name": "Can we update our food menu and prices easily after launch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Because our menus are built as clean structured text rather than flattened image files, prices, seasonal items, and daily specials can be updated swiftly without requiring complete redesigns."
          }
        },
        {
          "@type": "Question",
          "name": "Do you help optimize our restaurant on Google Maps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Every restaurant website package includes Google Business Profile coordination: ensuring primary categories, verified entrance coordinates, operating hours, and photo guidelines match your website."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(restaurantFaqSchema) + '</script>\n';
  }
  if (pageSlug === "professional-services.html") {
    const profFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does a website actually generate consulting enquiries?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "By organizing the page around the specific problems prospective clients face, explaining your approach clearly, answering common hesitations upfront, and providing a single, frictionless next step—such as scheduling an introductory phone call or sending a WhatsApp message."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a website for an advisory or legal practice cost in Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt professional service packages start at ₹10,000 for standard 5-page firm presence, ₹25,000 for customized lead-building architectures with calendar integrations, and ₹37,000 for multi-practice advisory firms."
          }
        },
        {
          "@type": "Question",
          "name": "Can you help us rank for local B2B searches in Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We optimize your website's location signals, service-specific pages, and Google Business Profile to target decision-makers searching across commercial hubs like HSR Layout, Koramangala, Whitefield, and Indiranagar."
          }
        },
        {
          "@type": "Question",
          "name": "Do we need a massive blog to demonstrate expertise?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. You don't need dozens of generic posts. Three or four well-crafted, original field guides that answer high-intent client questions (pricing, process, mistakes to avoid) generate far more trust than hundreds of automated articles."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(profFaqSchema) + '</script>\n';
  }
  if (pageSlug === "website-design-whitefield.html") {
    const whitefieldFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can we meet in person in Whitefield or Varthur to discuss our website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. GyanArt's studio is located directly on Balagere Road in Varthur (Bengaluru 560087). We regularly meet with local business owners in Whitefield, ITPL, and Varthur for preliminary project discussions and strategy reviews."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a website design cost in Whitefield, Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt website packages start at ₹10,000 for standard 5-page small business websites, ₹25,000 for customized conversion-focused sites, and ₹37,000 for comprehensive multi-service platforms. There are zero agency sales commissions or hidden maintenance fees."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to launch a business website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A standard 5-to-10 page small business website in Whitefield typically takes 2 to 3 weeks to design, build, test, and launch once initial text and photos are confirmed."
          }
        },
        {
          "@type": "Question",
          "name": "Do you help our website rank locally on Google Maps in Whitefield?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Every website package includes Google Business Profile coordination: ensuring verified coordinates, primary categories, operating hours, and local Whitefield service corridors match your website's structured data."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(whitefieldFaqSchema) + '</script>\n';
  }
  if (pageSlug === "website-design-hsr-layout.html") {
    const hsrFaqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is GyanArt different from traditional agencies in HSR Layout?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Traditional agencies in HSR Layout charge significant markups to cover account managers and commercial rents. At GyanArt, you work directly with Gyaneshwar, a UX designer with 20+ years of digital experience, ensuring senior design thinking without agency bloat."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a website design cost in HSR Layout, Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GyanArt website packages start at ₹10,000 for standard 5-page small business sites, ₹25,000 for customized conversion-focused sites, and ₹37,000 for comprehensive platforms with booking or lead qualification funnels."
          }
        },
        {
          "@type": "Question",
          "name": "What is the typical turnaround time for an HSR Layout website?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A standard 5-to-10 page small business website typically launches within 2 to 3 weeks once initial text, branding assets, and photography are confirmed."
          }
        },
        {
          "@type": "Question",
          "name": "Do you build conversion-optimized landing pages for PPC ad campaigns?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our Enquiry Builder and Growth Optimization packages include dedicated, high-converting landing page layouts built to maximize return on Google Ads and Meta campaign spend."
          }
        }
      ]
    };
    pageSchemaTags += '<script type="application/ld+json">' + JSON.stringify(hsrFaqSchema) + '</script>\n';
  }

  const fontPreconnect='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" media="print" onload="this.media=\'all\'">\n<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"></noscript>\n';
  const themeDetectionScript='<script>(function(){try{var s=localStorage.getItem("gyanart-theme");var t=s||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>\n';
  const html="<!doctype html>\n<html lang=\""+pageLang+"\">\n<head>\n"+
    '<meta charset="utf-8">\n'+
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'+
    '<meta name="color-scheme" content="light dark">\n'+
    '<meta name="theme-color" content="#0B0D13">\n'+
    themeDetectionScript+
    fontPreconnect+
    stylesheetTag+
    '<meta name="description" content="'+page.description+'">\n'+
    ((page.noindex || process.env.PREVIEW_BUILD === "true") ? '<meta name="robots" content="noindex,follow">\n' : '')+
    '<meta property="og:site_name" content="'+site.name+'">\n'+
    '<meta property="og:image" content="https://www.gyanart.com/assets/og-gyanart.png">\n'+
    '<meta property="og:image:secure_url" content="https://www.gyanart.com/assets/og-gyanart.png">\n'+
    '<meta property="og:image:type" content="image/png">\n'+
    '<meta property="og:image:width" content="1200">\n'+
    '<meta property="og:image:height" content="630">\n'+
    '<meta property="og:image:alt" content="GyanArt — Help more local customers find and choose your business. UX-led digital growth for local businesses.">\n'+
    '<meta property="og:locale" content="'+pageLocale+'">\n'+
    alternates+
    '<meta name="twitter:card" content="summary_large_image">\n'+
    '<meta name="twitter:image" content="https://www.gyanart.com/assets/og-gyanart.png">\n'+
    '<meta property="og:title" content="'+page.title+'">\n'+
    '<meta property="og:description" content="'+page.description+'">\n'+
    '<meta property="og:type" content="website">\n'+
    '<meta property="og:url" content="https://www.gyanart.com/'+(page.isHome ? (page.lang ? page.lang+"/" : "") : (page.output === "index.html" ? "" : page.output))+'">\n'+
    '<link rel="canonical" href="https://www.gyanart.com/'+(page.isHome ? (page.lang ? page.lang+"/" : "") : (page.output === "index.html" ? "" : page.output))+'">\n'+
    '<title>'+page.title+'</title>\n'+
    pageSchemaTags+
    '<link rel="icon" type="image/svg+xml" href="'+prefix+'favicon.svg">\n'+
    '<script>\n'+
    'if(window.location.hostname==="www.gyanart.com"||window.location.hostname==="gyanart.com"){\n'+
    '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "yxvmsm9pma");\n'+
    'var gs=document.createElement("script");gs.async=true;gs.src="https://www.googletagmanager.com/gtag/js?id=G-D0JCS746B6";document.head.appendChild(gs);\n'+
    'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-D0JCS746B6");\n'+
    '}\n'+
    '</script>\n'+
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
if(fs.existsSync(path.join(src,"og-gyanart.png"))) {
  ensure(path.join(dist,"assets/og-gyanart.png"));
  fs.copyFileSync(path.join(src,"og-gyanart.png"),path.join(dist,"assets/og-gyanart.png"));
}
const assetsDir=path.join(src,"assets");
if(fs.existsSync(assetsDir)) fs.cpSync(assetsDir,path.join(dist,"assets"),{recursive:true});
fs.copyFileSync(path.join(src,"robots.txt"),path.join(dist,"robots.txt"));
if(fs.existsSync(path.join(src,"llms.txt"))) fs.copyFileSync(path.join(src,"llms.txt"),path.join(dist,"llms.txt"));
if(fs.existsSync(path.join(src,"llms-full.txt"))) fs.copyFileSync(path.join(src,"llms-full.txt"),path.join(dist,"llms-full.txt"));
const sitemapUrls=pages.filter(page=>!page.noindex).map(page=>{
  const url=(page.isHome||page.output==="index.html")?(page.lang?"https://www.gyanart.com/"+page.lang+"/":"https://www.gyanart.com/"):"https://www.gyanart.com/"+page.output;
  const isHome=page.isHome||page.output==="index.html";
  const priority=isHome?"1.0":(page.output==="pricing.html"||page.output==="website-design.html"||page.output==="solutions.html"?"0.9":"0.8");
  const changefreq=isHome?"weekly":"monthly";
  return '  <url>\n    <loc>'+url+'</loc>\n    <lastmod>2026-10-20</lastmod>\n    <changefreq>'+changefreq+'</changefreq>\n    <priority>'+priority+'</priority>\n  </url>';
}).join("\n");
const sitemapXml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+sitemapUrls+'\n</urlset>\n';
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
  const relativeFavicon=path.relative(path.dirname(file),path.join(dist,"favicon.svg")).replace(/\\/g,"/");
  if(!html.includes('href="'+relativeFavicon+'"')){
    throw new Error("Favicon link is missing or incorrect in "+path.relative(dist,file));
  }
}
const contactHtml=fs.readFileSync(path.join(dist,"contact.html"),"utf8");
if(!contactHtml.includes("https://wa.me/"+whatsappNumber) || !contactHtml.includes(whatsappDisplay)){
  throw new Error("Contact page WhatsApp number/link does not match src/data/site.json");
}
const htaccess = `DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Redirect legacy URLs to the closest current equivalent in one hop.
  RewriteRule ^index\\.(html|htm)$ https://www.gyanart.com/ [R=301,L,NC]
  RewriteRule ^free-audit(\\.html)?$ https://www.gyanart.com/growth-audit.html [R=301,L,NC]
  RewriteRule ^privacy(\\.html)?$ https://www.gyanart.com/privacy-policy.html [R=301,L,NC]
  RewriteRule ^terms(\\.html)?$ https://www.gyanart.com/terms-and-conditions.html [R=301,L,NC]
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

  # Clean URLs: Rewrite extensionless requests to their .html equivalent
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{DOCUMENT_ROOT}/$1.html -f [OR]
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+?)/?$ $1.html [L]
</IfModule>

# HTTP Security Headers for GEO & Browser Protection
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), camera=(), microphone=()"
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
