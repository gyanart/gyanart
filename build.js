const fs=require("fs");
const path=require("path");

const root=__dirname;
const src=path.join(root,"src");
const dist=path.join(root,"dist");
function read(p){return fs.readFileSync(path.join(src,p),"utf8");}
function ensure(p){fs.mkdirSync(path.dirname(p),{recursive:true});}
const site=JSON.parse(read("data/site.json"));
const header=read("components/header.html");
const footer=read("components/footer.html");
const pages=JSON.parse(read("data/pages.json"));
const whatsappNumber=String(site.whatsapp || "").replace(/\D/g,"");
const whatsappDisplay=whatsappNumber.startsWith("91")
  ? "+91 "+whatsappNumber.slice(2,7)+" "+whatsappNumber.slice(7)
  : whatsappNumber;

fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});

function render(page){
  let body=read(page.content);
  const nested=page.output.includes("/");
  const prefix=nested?"../":"";
  if(page.output!=="index.html"){
    body=body.replace('<section class="section"', '<section class="section page-intro"');
  }
  const labels={
    "how-it-works.html":"How It Works","solutions.html":"Solutions",
    "growth-experiments.html":"Growth Experiments","pricing.html":"Pricing",
    "about.html":"About Gyan","insights.html":"Insights",
    "growth-audit.html":"Free Growth Audit","contact.html":"Contact",
    "experiments/dental-clinic.html":"Dental Clinic",
    "experiments/professional-services.html":"Professional Services",
    "experiments/appliance-repair.html":"Appliance Repair",
    "experiments/restaurant.html":"Restaurant",
    "local-seo-services.html":"Local SEO Services",
    "google-business-profile-optimization.html":"Google Business Profile",
    "website-design.html":"Website Design"
  };
  const parent={
    "experiments/dental-clinic.html":["Growth Experiments","growth-experiments.html"],
    "experiments/professional-services.html":["Growth Experiments","growth-experiments.html"],
    "experiments/appliance-repair.html":["Growth Experiments","growth-experiments.html"],
    "experiments/restaurant.html":["Growth Experiments","growth-experiments.html"],
    "local-seo-services.html":["Solutions","solutions.html"],
    "google-business-profile-optimization.html":["Solutions","solutions.html"],
    "website-design.html":["Solutions","solutions.html"]
  };
  const crumbParts=[{label:"Home",href:prefix+"index.html"}];
  if(parent[page.output]) crumbParts.push({label:parent[page.output][0],href:prefix+parent[page.output][1]});
  if(labels[page.output]) crumbParts.push({label:labels[page.output]});
  const breadcrumb=page.output==="index.html"?"":'<nav class="breadcrumbs container" aria-label="Breadcrumb"><ol>'+crumbParts.map((c,i)=>'<li>'+(c.href?'<a href="'+c.href+'">'+c.label+'</a>': '<span aria-current="page">'+c.label+'</span>')+'</li>').join('<li class="breadcrumb-separator" aria-hidden="true">/</li>')+'</ol></nav>';
  let pageContent=body;
  if(page.output!=="index.html"){
    const introEnd=body.indexOf("</section>");
    if(introEnd===-1) throw new Error("Could not locate first section on "+page.output);
    const intro=body.slice(0,introEnd+"</section>".length);
    const remainder=body.slice(introEnd+"</section>".length);
    pageContent='<div class="page-top">'+breadcrumb+intro+'</div>'+remainder;
  }
  const nav=header.replaceAll("{{SITE_NAME}}",site.name)
    .replaceAll('href="index.html"','href="'+prefix+'index.html"')
    .replaceAll('href="how-it-works.html"','href="'+prefix+'how-it-works.html"')
    .replaceAll('href="solutions.html"','href="'+prefix+'solutions.html"')
    .replaceAll('href="growth-experiments.html"','href="'+prefix+'growth-experiments.html"')
    .replaceAll('href="pricing.html"','href="'+prefix+'pricing.html"')
    .replaceAll('href="about.html"','href="'+prefix+'about.html"')
    .replaceAll('href="insights.html"','href="'+prefix+'insights.html"')
    .replaceAll('href="growth-audit.html"','href="'+prefix+'growth-audit.html"');
  const foot=footer.replaceAll("{{SITE_NAME}}",site.name).replaceAll("{{TAGLINE}}",site.tagline)
    .replaceAll('href="index.html"','href="'+prefix+'index.html"')
    .replaceAll('href="how-it-works.html"','href="'+prefix+'how-it-works.html"')
    .replaceAll('href="solutions.html"','href="'+prefix+'solutions.html"')
    .replaceAll('href="growth-experiments.html"','href="'+prefix+'growth-experiments.html"')
    .replaceAll('href="pricing.html"','href="'+prefix+'pricing.html"')
    .replaceAll('href="about.html"','href="'+prefix+'about.html"')
    .replaceAll('href="insights.html"','href="'+prefix+'insights.html"')
    .replaceAll('href="contact.html"','href="'+prefix+'contact.html"')
    .replaceAll('href="growth-audit.html"','href="'+prefix+'growth-audit.html"');
  const html="<!doctype html>\n<html lang=\"en\">\n<head>\n"+
    '<meta charset="utf-8">\n'+
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'+
    '<meta name="theme-color" content="#F8F8F6">\n'+
    '<meta name="description" content="'+page.description+'">\n'+
    '<meta property="og:title" content="'+page.title+'">\n'+
    '<meta property="og:description" content="'+page.description+'">\n'+
    '<meta property="og:type" content="website">\n'+
    '<meta property="og:url" content="https://www.gyanart.com/'+(page.output === "index.html" ? "" : page.output)+'">\n'+
    '<link rel="canonical" href="https://www.gyanart.com/'+(page.output === "index.html" ? "" : page.output)+'">\n'+
    '<title>'+page.title+'</title>\n'+
    '<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"GyanArt","url":"https://www.gyanart.com/","email":"hello@gyanart.com","founder":{"@type":"Person","name":"Gyaneshwar","jobTitle":"UX Designer and Digital Growth Consultant"}})+'</script>\n'+
    '<link rel="icon" type="image/svg+xml" href="'+prefix+'favicon.svg">\n'+
    '<link rel="stylesheet" href="'+prefix+'css/site.css">\n'+
    '</head>\n<body>\n'+nav+'\n<main>\n'+pageContent+'\n</main>\n'+foot+
    '<script src="'+prefix+'js/main.js" defer></script>\n</body>\n</html>\n';
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
const assetsDir=path.join(src,"assets");
if(fs.existsSync(assetsDir)) fs.cpSync(assetsDir,path.join(dist,"assets"),{recursive:true});
fs.copyFileSync(path.join(src,"robots.txt"),path.join(dist,"robots.txt"));
fs.copyFileSync(path.join(src,"sitemap.xml"),path.join(dist,"sitemap.xml"));
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
  if(!html.includes('href="'+relativeFavicon+'"')){
    throw new Error("Favicon link is missing or incorrect in "+path.relative(dist,file));
  }
}
const contactHtml=fs.readFileSync(path.join(dist,"contact.html"),"utf8");
if(!contactHtml.includes("https://wa.me/"+whatsappNumber) || !contactHtml.includes(whatsappDisplay)){
  throw new Error("Contact page WhatsApp number/link does not match src/data/site.json");
}
console.log("Built",pages.length,"pages to dist/; WhatsApp contact and favicon verified across",htmlFiles.length,"HTML files.");
