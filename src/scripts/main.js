const trackGA4=(eventName,params={})=>{
  if(typeof window.gtag==="function")window.gtag("event",eventName,params);
};

document.addEventListener("DOMContentLoaded",()=>{
  const packageInterest=new URLSearchParams(window.location.search).get("package");
  const contactMessage=document.querySelector("#contact-message");
  if(packageInterest&&contactMessage&&["Digital Foundation","Enquiry Builder","Growth Optimization"].includes(packageInterest)&&!contactMessage.value.trim()){
    contactMessage.value=`I’m interested in the ${packageInterest} package. I’d like to discuss my business requirements.`;
  }
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
    const tracked=link.dataset.trackEvent;
    if(tracked){trackGA4(tracked,{campaign_label:link.dataset.trackLabel||"unspecified",page_path:window.location.pathname});}
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
    button.addEventListener("click",(e)=>{
      e.stopPropagation();
      const open=dropdown.classList.toggle("open");
      button.setAttribute("aria-expanded",String(open));
    });
    document.addEventListener("click",(e)=>{
      if(!dropdown.contains(e.target)){
        dropdown.classList.remove("open");
        button.setAttribute("aria-expanded","false");
      }
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

  // Keep button feedback in the language of the page.
  const formFeedbackText={
    en:{sending:"Sending…",success:"✓ Successfully sent!"},
    hi:{sending:"भेजा जा रहा है…",success:"✓ सफलतापूर्वक भेज दिया!"},
    kn:{sending:"ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…",success:"✓ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!"}
  };
  const submitText=formFeedbackText[currentLanguage]||formFeedbackText.en;

  // Turnstile is activated only after BOTH cPanel environment variables exist.
  // The public endpoint reveals the site key only; the secret remains in PHP.
  let turnstileRequired=false;
  let turnstileReady=false;
  const protectedForms=[...document.querySelectorAll('form[data-email-form]')];
  if(protectedForms.length){
    fetch('/submit-form.php?turnstile_config=1',{cache:'no-store'})
      .then(response=>{if(!response.ok)throw new Error('Config unavailable');return response.json();})
      .then(config=>{
        if(!config.enabled||!config.siteKey)return;
        turnstileRequired=true;
        protectedForms.forEach(form=>{
          const slot=document.createElement('div');
          slot.className='gyanart-turnstile';
          slot.setAttribute('aria-label','Spam protection verification');
          const submit=form.querySelector('button[type="submit"]');
          if(submit)form.insertBefore(slot,submit);
          form.dataset.turnstileReady='false';
        });
        const script=document.createElement('script');
        script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async=true;
        script.onload=()=>{
          if(!window.turnstile)return;
          protectedForms.forEach(form=>{
            const slot=form.querySelector('.gyanart-turnstile');
            if(!slot)return;
            window.turnstile.render(slot,{
              sitekey:config.siteKey,
              action:'gyanart_enquiry',
              callback:()=>{form.dataset.turnstileReady='true';},
              'expired-callback':()=>{form.dataset.turnstileReady='false';},
              'error-callback':()=>{form.dataset.turnstileReady='false';},
            });
          });
          turnstileReady=true;
        };
        script.onerror=()=>{turnstileReady=false;};
        document.head.appendChild(script);
      }).catch(()=>{
        // PHP remains the source of truth: no unverified token is accepted
        // when Turnstile is active, even if the browser cannot load it.
        turnstileRequired=true;
      });
  }

  // Accept domain-only website and Maps links in Growth Audit forms.
  // PHP repeats this validation so direct posts cannot bypass it.
  const normalizeWebsiteLink=value=>{
    const text=value.trim();
    if(!text)return '';
    if(/\\s/.test(text)||text.startsWith('//'))return null;
    if(!/^https?:\\/\\//i.test(text)&&/^[a-z][a-z0-9+.-]*:/i.test(text))return null;
    const candidate=/^https?:\\/\\//i.test(text)?text:'https://'+text;
    try{
      const parsed=new URL(candidate);
      if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)return null;
      const host=parsed.hostname;
      const labels=host.split('.');
      if(labels.length<2||labels.some(label=>!label||label.length>63||!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)))return null;
      if(labels[labels.length-1].length<2||!/^[a-z]/i.test(labels[labels.length-1]))return null;
      return candidate;
    }catch{return null;}
  };
  const websiteInputErrors={
    en:'Enter a website such as gyanart.com or a valid Google Maps link.',
    hi:'gyanart.com जैसा वेबसाइट पता या सही Google Maps लिंक दर्ज करें।',
    kn:'gyanart.com ನಂತಹ ವೆಬ್‌ಸೈಟ್ ವಿಳಾಸ ಅಥವಾ ಸರಿಯಾದ Google Maps ಲಿಂಕ್ ನಮೂದಿಸಿ.'
  };

  // Shared submission feedback for contact, audit, and Starter Website forms.
  document.querySelectorAll("form[data-email-form]").forEach(form=>{
    const started=form.querySelector('input[name="form_started_at"]');
    const button=form.querySelector('button[type="submit"]');
    const status=form.querySelector(".form-status");
    const originalButtonHtml=button?.innerHTML||"";
    const websiteInput=form.querySelector('input[data-normalize-website]');
    const normalizeAuditWebsite=()=>{
      if(!websiteInput)return true;
      const normalized=normalizeWebsiteLink(websiteInput.value);
      if(normalized===null){
        websiteInput.setCustomValidity(websiteInputErrors[currentLanguage]||websiteInputErrors.en);
        return false;
      }
      websiteInput.setCustomValidity('');
      websiteInput.value=normalized;
      return true;
    };
    if(websiteInput){
      websiteInput.addEventListener('input',()=>websiteInput.setCustomValidity(''));
      websiteInput.addEventListener('blur',()=>{
        // Only rewrite a valid domain; let submit report invalid input.
        const normalized=normalizeWebsiteLink(websiteInput.value);
        if(normalized!==null)websiteInput.value=normalized;
      });
    }
    if(started)started.value=String(Date.now());

    // Keep success visible. A new enquiry can be started by editing a field.
    const clearSuccess=()=>{
      if(!form.classList.contains("is-submitted"))return;
      form.classList.remove("is-submitted");
      if(button){
        button.disabled=false;
        button.classList.remove("is-submit-success");
        button.innerHTML=originalButtonHtml;
      }
      if(status){
        status.className="form-status note";
        status.textContent="";
      }
    };
    form.addEventListener("input",clearSuccess);
    form.addEventListener("change",clearSuccess);

    form.addEventListener("submit",async event=>{
      event.preventDefault();
      if(form.dataset.sending==="true"||form.classList.contains("is-submitted"))return;
      if(!normalizeAuditWebsite()){
        websiteInput.reportValidity();
        return;
      }
      if(!form.reportValidity())return;
      if(turnstileRequired&&(!turnstileReady||form.dataset.turnstileReady!=='true')){
        if(status){
          status.className='form-status form-feedback-error';
          status.textContent='Please complete the security check. If it does not load, email info@gyanart.com.';
        }
        return;
      }
      form.dataset.sending="true";
      if(button){
        button.disabled=true;
        button.textContent=submitText.sending;
      }
      if(status){
        status.className="form-status note";
        status.textContent="Sending your request securely…";
      }
      try{
        const response=await fetch(form.getAttribute("action")||"submit-form.php",{
          method:"POST",
          body:new FormData(form),
          headers:{"Accept":"application/json"}
        });
        const result=await response.json();
        if(!response.ok||!result.success)throw new Error(result.message||"We couldn’t send your request. Please email info@gyanart.com.");

        const formName=form.querySelector('input[name="form_type"]')?.value||form.id||"unknown";
        trackGA4("generate_lead",{form_name:formName,page_path:window.location.pathname,...(form.closest(".dental-landing")?{lead_source:"dental_clinics"}:{}),...(packageInterest&&["Digital Foundation","Enquiry Builder","Growth Optimization"].includes(packageInterest)?{package_interest:packageInterest}:{})});
        form.reset();
        if(turnstileRequired&&window.turnstile){
          const widget=form.querySelector('.gyanart-turnstile');
          if(widget)window.turnstile.reset(widget);
          form.dataset.turnstileReady='false';
        }
        if(started)started.value=String(Date.now());
        form.classList.add("is-submitted");
        if(button){
          button.classList.add("is-submit-success");
          button.textContent=submitText.success;
        }
        if(status){
          status.className="form-status form-feedback-success";
          status.textContent=result.message||"Your enquiry was received. We’ll be in touch.";
        }
      }catch(error){
        if(turnstileRequired&&window.turnstile){
          const widget=form.querySelector('.gyanart-turnstile');
          if(widget)window.turnstile.reset(widget);
          form.dataset.turnstileReady='false';
        }
        if(status){
          status.className="form-status form-feedback-error";
          status.textContent=error.message||"We couldn’t send your request. Please email info@gyanart.com.";
        }
      }finally{
        form.dataset.sending="false";
        if(button){
          button.disabled=form.classList.contains("is-submitted");
          if(!form.classList.contains("is-submitted"))button.innerHTML=originalButtonHtml;
        }
      }
    });
  });

  // Theme Switcher & System Color Scheme Sync
  const themeToggles = document.querySelectorAll("[data-theme-toggle]");
  function getEffectiveTheme() {
    return document.documentElement.getAttribute("data-theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function updateThemeUI(theme) {
    themeToggles.forEach(btn => {
      const targetMode = theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", `Switch to ${targetMode} mode`);
      btn.setAttribute("title", `Switch to ${targetMode} mode`);
    });
  }
  function applyTheme(theme, save = true) {
    document.documentElement.setAttribute("data-theme", theme);
    if (save) {
      try { localStorage.setItem("gyanart-theme", theme); } catch(e) {}
    }
    updateThemeUI(theme);
  }
  themeToggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const current = getEffectiveTheme();
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    try {
      if (!localStorage.getItem("gyanart-theme")) {
        applyTheme(e.matches ? "dark" : "light", false);
      }
    } catch(err) {}
  });
  updateThemeUI(getEffectiveTheme());
});
