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
const css=read("styles/site.css");
const js=read("scripts/main.js");

const pages=JSON.parse(read("data/pages.json"));

fs.rmSync(dist,{recursive:true,force:true});
fs.mkdirSync(dist,{recursive:true});

function render(page){
  const body=read(page.content);
  const html="<!doctype html>\n<html lang=\"en\">\n<head>\n"+
    '<meta charset="utf-8">\n'+
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'+
    '<meta name="theme-color" content="#F8F8F6">\n'+
    '<meta name="description" content="'+page.description+'">\n'+
    '<meta property="og:title" content="'+page.title+'">\n'+
    '<meta property="og:description" content="'+page.description+'">\n'+
    '<meta property="og:type" content="website">\n'+
    '<title>'+page.title+'</title>\n'+
    '<link rel="stylesheet" href="css/site.css">\n'+
    '</head>\n<body>\n'+
    header.replaceAll("{{SITE_NAME}}",site.name)+
    "\n<main>\n"+body+"\n</main>\n"+
    footer.replaceAll("{{SITE_NAME}}",site.name).replaceAll("{{TAGLINE}}",site.tagline)+
    '<script src="js/main.js" defer></script>\n</body>\n</html>\n';
  const out=path.join(dist,page.output);
  ensure(out);
  fs.writeFileSync(out,html);
}

pages.forEach(render);
ensure(path.join(dist,"css/site.css"));
ensure(path.join(dist,"js/main.js"));
fs.copyFileSync(path.join(src,"styles/site.css"),path.join(dist,"css/site.css"));
fs.copyFileSync(path.join(src,"scripts/main.js"),path.join(dist,"js/main.js"));
fs.copyFileSync(path.join(src,"robots.txt"),path.join(dist,"robots.txt"));
fs.copyFileSync(path.join(src,"sitemap.xml"),path.join(dist,"sitemap.xml"));
console.log("Built",pages.length,"pages to dist/");
