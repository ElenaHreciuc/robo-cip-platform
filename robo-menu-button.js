(function () {
  "use strict";
  const teacherPages = new Set(["/teacher-dashboard.html", "/teacher-notes.html", "/teacher-guide.html", "/menu-robo.html"]);
  if (!teacherPages.has(window.location.pathname)) return;
  if (document.getElementById("roboMenuBtn")) return;
  const style = document.createElement("style");
  style.textContent = ".robo-menu-center{display:flex;justify-content:center;margin:18px auto 22px;padding:0 12px}.robo-menu-btn{display:inline-block;background:#2e86de;color:white;border-radius:999px;padding:13px 25px;font:600 16px system-ui,sans-serif;text-decoration:none;box-shadow:0 3px 11px #163a5d35}.robo-menu-btn:focus-visible{outline:3px solid #f2ad35;outline-offset:3px}.robo-menu-btn:hover{background:#176fbc}";
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
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",attach,{once:true});
  else attach();
})();
