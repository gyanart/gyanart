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
    '<title>'+page.title+'</title>\n'+
    '<link rel="stylesheet" href="'+prefix+'css/site.css">\n'+
    '</head>\n<body>\n'+nav+'\n<main>\n'+body+'\n</main>\n'+foot+
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
}
const contactHtml=fs.readFileSync(path.join(dist,"contact.html"),"utf8");
if(!contactHtml.includes("https://wa.me/"+whatsappNumber) || !contactHtml.includes(whatsappDisplay)){
  throw new Error("Contact page WhatsApp number/link does not match src/data/site.json");
}
console.log("Built",pages.length,"pages to dist/; WhatsApp contact verified across",htmlFiles.length,"HTML files.");
