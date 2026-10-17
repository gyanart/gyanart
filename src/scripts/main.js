const trackGA4=(eventName,params={})=>{
  if(typeof window.gtag==="function")window.gtag("event",eventName,params);
};

document.addEventListener("DOMContentLoaded",()=>{
  let formToastTimer;
  let formToastFadeTimer;
  const showFormToast=(message,form)=>{
    let toast=document.querySelector(".site-toast");
    if(!toast){
      toast=document.createElement("div");
      toast.className="site-toast";
      toast.setAttribute("role","status");
      toast.setAttribute("aria-live","polite");
      toast.setAttribute("aria-atomic","true");
    }
    if(form&&!toast.parentElement?.isSameNode(form))form.appendChild(toast);
    window.clearTimeout(formToastTimer);
    window.clearTimeout(formToastFadeTimer);
    toast.textContent=message;
    toast.classList.remove("is-visible","is-hiding");
    requestAnimationFrame(()=>toast.classList.add("is-visible"));
    formToastTimer=window.setTimeout(()=>{
      toast.classList.remove("is-visible");
      toast.classList.add("is-hiding");
      formToastFadeTimer=window.setTimeout(()=>toast.classList.remove("is-hiding"),350);
    },2000);
  };
  // Remember the visitor's explicit language choice across page navigation.
  const languageKey="gyanart-language";
  const localizedPages={
    kn:new Set(["index.html","how-it-works.html","solutions.html","growth-experiments.html","insights.html","growth-audit.html","website-design.html","local-seo-services.html","google-business-profile-optimization.html","pricing.html","about.html","contact.html"]),
    hi:new Set(["index.html","how-it-works.html","solutions.html","growth-experiments.html","insights.html","growth-audit.html","website-design.html","local-seo-services.html","google-business-profile-optimization.html","pricing.html","about.html","contact.html"])
  };
  const pathParts=window.location.pathname.split("/").filter(Boolean);
  const currentLanguage=["kn","hi"].includes(pathParts[0])?pathParts[0]:"en";
  const currentSlug=pathParts.length===0?"index.html":pathParts[pathParts.length-1];
  const savedLanguage=(()=>{try{return localStorage.getItem(languageKey);}catch{return null;}})();
  if(savedLanguage&&savedLanguage!==currentLanguage&&localizedPages[savedLanguage]?.has(currentSlug)){
    const target=savedLanguage==="en"
      ?(currentSlug==="index.html"?"/":"/"+currentSlug)
      :"/"+savedLanguage+"/"+(currentSlug==="index.html"?"":currentSlug);
    if(target!==window.location.pathname)window.location.replace(target);
    return;
  }
  document.addEventListener("click",event=>{
    const languageLink=event.target.closest(".language-menu a[lang]");
    if(languageLink){
      try{localStorage.setItem(languageKey,languageLink.getAttribute("lang"));}catch{}
    }
    const link=event.target.closest("a[href]");
    if(!link)return;
    const href=link.getAttribute("href")||"";
    if(/^https?:\/\/(?:www\.)?(?:wa\.me|whatsapp\.com)\//i.test(href)){
      trackGA4("contact_click",{contact_method:"whatsapp"});
    }else if(/^tel:/i.test(href)){
      trackGA4("contact_click",{contact_method:"phone"});
    }else if(/^mailto:/i.test(href)){
      trackGA4("contact_click",{contact_method:"email"});
    }
  });
  const header=document.querySelector("[data-header]");
  const toggle=document.querySelector(".nav-toggle");
  const nav=document.querySelector(".site-nav");
  let lastY=window.scrollY;

  const updateHeader=()=>{
    if(!header)return;
    const y=window.scrollY;
    header.classList.toggle("scrolled",y>8);
    if(y<40)header.classList.remove("compact");
    else if(y>lastY+3)header.classList.add("compact");
    else if(y<lastY-3)header.classList.remove("compact");
    lastY=y;
  };
  const closeMenu=()=>{
    if(!toggle||!nav)return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
  };
  const updateTopButton=()=>{
    const button=document.querySelector("[data-back-to-top]");
    if(button)button.classList.toggle("is-visible",window.scrollY>=Math.max(240,window.innerHeight*0.65));
  };

  updateHeader();
  updateTopButton();
  window.addEventListener("scroll",()=>{updateHeader();updateTopButton();},{passive:true});
  const topButton=document.querySelector("[data-back-to-top]");
  if(topButton)topButton.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));

  document.querySelectorAll(".language-switcher").forEach(switcher=>{
    const button=switcher.querySelector(".language-toggle");
    const menu=switcher.querySelector(".language-menu");
    if(!button||!menu)return;
    const closeLanguageMenu=()=>{menu.hidden=true;button.setAttribute("aria-expanded","false");};
    button.addEventListener("click",event=>{
      event.stopPropagation();
      const open=menu.hidden;
      menu.hidden=!open;
      button.setAttribute("aria-expanded",String(open));
    });
    document.addEventListener("click",event=>{if(!switcher.contains(event.target))closeLanguageMenu();});
    document.addEventListener("keydown",event=>{if(event.key==="Escape")closeLanguageMenu();});
  });

  document.querySelectorAll(".nav-dropdown").forEach(dropdown=>{
    const button=dropdown.querySelector(".nav-dropdown-toggle");
    if(!button)return;
    button.addEventListener("click",()=>{
      if(!window.matchMedia("(max-width: 700px)").matches)return;
      const open=dropdown.classList.toggle("open");
      button.setAttribute("aria-expanded",String(open));
    });
    document.addEventListener("keydown",event=>{
      if(event.key==="Escape"){
        dropdown.classList.remove("open");
        button.setAttribute("aria-expanded","false");
      }
    });
  });

  if(toggle&&nav){
    toggle.addEventListener("click",()=>{
      const open=nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded",String(open));
    });
    document.addEventListener("click",event=>{
      if(nav.classList.contains("open")&&!nav.contains(event.target)&&!toggle.contains(event.target))closeMenu();
    });
    document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu();});
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
  }

  document.querySelectorAll(".faq-item button").forEach(button=>button.addEventListener("click",()=>{
    const item=button.closest(".faq-item");
    const open=item.classList.toggle("open");
    button.setAttribute("aria-expanded",String(open));
  }));

  document.querySelectorAll("form[data-email-form]").forEach(form=>{
    const started=form.querySelector('input[name="form_started_at"]');
    if(started)started.value=String(Date.now());
  });

  document.querySelectorAll("form[data-email-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const button=form.querySelector('button[type="submit"]');
    const status=form.querySelector(".form-status");
    const originalText=button?button.textContent:"";
    if(button){button.disabled=true;button.textContent="Sending…";}
    if(status){status.className="form-status note";status.textContent="Sending your request securely…";}
    try{
      const response=await fetch(form.getAttribute("action")||"submit-form.php",{
        method:"POST",
        body:new FormData(form),
        headers:{"Accept":"application/json"}
      });
      const result=await response.json();
      if(!response.ok||!result.success)throw new Error(result.message||"We couldn’t send your request. Please email info@gyanart.com.");
      const formName=form.querySelector('input[name="form_type"]')?.value||form.id||"unknown";
      trackGA4("generate_lead",{form_name:formName});
      if(status){status.className="form-status note";status.textContent="";}
      showFormToast(result.message||"Your request was submitted successfully.",form);
      form.reset();
      const resetStarted=form.querySelector('input[name="form_started_at"]');
      if(resetStarted)resetStarted.value=String(Date.now());
    }catch(error){
      if(status){status.className="form-status form-feedback form-feedback-error";status.textContent=error.message||"We couldn’t send your request. Please email info@gyanart.com.";}
    }finally{
      if(button){button.disabled=false;button.textContent=originalText;}
    }
  }));
});
