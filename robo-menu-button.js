(function () {
  "use strict";
  const teacherPages = new Set(["/teacher-dashboard.html", "/teacher-notes.html", "/teacher-guide.html", "/menu-robo.html"]);
  if (!teacherPages.has(window.location.pathname)) {
    const style = document.createElement("style");
    style.textContent = ".student-return-link{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:9px!important;min-height:42px;padding:10px 17px!important;background:#e8f5ff!important;color:#176aab!important;border:1px solid #a8d8f4!important;border-radius:999px!important;box-shadow:0 3px 10px #176aab16;text-decoration:none!important;font:600 14px system-ui,sans-serif!important;text-align:center}.student-return-link svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.student-return-link:hover{background:#d9edff!important}.student-return-link:focus-visible{outline:3px solid #5daee7;outline-offset:3px}.student-return-wrap{text-align:center!important;margin:23px auto 18px!important}";
    document.head.appendChild(style);
    function formatStudentReturns(){
      document.querySelectorAll('a[href^="/modules.html"],a[href^="/learner.html"]').forEach(a=>{
        if(!/Înapoi|înapoi/.test(a.textContent)||a.classList.contains("student-return-link"))return;
        a.classList.add("student-return-link");
        a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg><span>'+a.textContent.trim().replace(/^[←↩\s]+/,"")+'</span>';
        if(a.parentElement?.tagName==="P")a.parentElement.classList.add("student-return-wrap");
      });
    }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",formatStudentReturns,{once:true});
    else formatStudentReturns();
    return;
  }
  if (document.getElementById("roboMenuBtn")) return;
  const style = document.createElement("style");
  style.textContent = ".robo-menu-center{display:flex;justify-content:center;margin:18px auto 22px;padding:0 12px}.robo-menu-btn{display:inline-block;background:#2e86de;color:white;border-radius:999px;padding:13px 25px;font:600 16px system-ui,sans-serif;text-decoration:none;box-shadow:0 3px 11px #163a5d35}.robo-menu-btn:focus-visible{outline:3px solid #f2ad35;outline-offset:3px}.robo-menu-btn:hover{background:#176fbc}";
  style.textContent += ".teacher-return{display:flex;justify-content:center;margin:24px auto 16px}.teacher-return a{display:inline-flex;align-items:center;gap:9px;background:#e8f8fa;border:1px solid #b7e4ec;color:#167c92;border-radius:999px;padding:10px 16px;font:600 14px system-ui,sans-serif;text-decoration:none}.teacher-return svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.teacher-return a:focus-visible{outline:3px solid #8edbe7;outline-offset:3px}";
  document.head.appendChild(style);
  function attach() {
    if (!document.body) return;
    const wrap = document.createElement("nav");
    wrap.className = "robo-menu-center";
    wrap.setAttribute("aria-label","Acces meniu profesor");
    const btn = document.createElement("a");
    btn.id = "roboMenuBtn";
    btn.href = "/menu-robo.html";
    btn.className = "robo-menu-btn";
    btn.textContent = "Meniu Robo-Cip · Profesor";
    wrap.appendChild(btn);
    const content = document.querySelector("main, .page") || document.body;
    content.insertBefore(wrap,content.firstChild);
    const back = document.createElement("nav");
    back.className = "teacher-return";
    back.setAttribute("aria-label","Înapoi la activitățile elevilor");
    const link = document.createElement("a");
    link.href = "/modules.html";
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg><span>Înapoi la activitățile elevilor</span>';
    back.append(link);
    if (content === document.body) document.body.appendChild(back);
    else content.insertAdjacentElement("afterend",back);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",attach,{once:true});
  else attach();
})();
