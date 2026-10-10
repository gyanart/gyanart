document.addEventListener("DOMContentLoaded",()=>{
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
    if(button)button.classList.toggle("is-visible",window.scrollY>=window.innerHeight);
  };

  updateHeader();
  updateTopButton();
  window.addEventListener("scroll",()=>{updateHeader();updateTopButton();},{passive:true});
  const topButton=document.querySelector("[data-back-to-top]");
  if(topButton)topButton.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));

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

  document.querySelectorAll("form[data-email-form]").forEach(form=>form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const button=form.querySelector('button[type="submit"]');
    const status=form.querySelector(".form-status");
    const originalText=button?button.textContent:"";
    if(button){button.disabled=true;button.textContent="Sending…";}
    if(status)status.textContent="Sending your request securely…";
    try{
      const response=await fetch(form.getAttribute("action")||"submit-form.php",{
        method:"POST",
        body:new FormData(form),
        headers:{"Accept":"application/json"}
      });
      const result=await response.json();
      if(!response.ok||!result.success)throw new Error(result.message||"We couldn’t send your request. Please email info@gyanart.com.");
      if(status)status.textContent=result.message;
      form.reset();
    }catch(error){
      if(status)status.textContent=error.message||"We couldn’t send your request. Please email info@gyanart.com.";
    }finally{
      if(button){button.disabled=false;button.textContent=originalText;}
    }
  }));
});
