(function () {
  // Evităm inserarea dublă
  if (document.getElementById("roboMenuBtn")) return;

  // Stilul butonului
  const style = document.createElement("style");
  style.textContent = `
    .robo-menu-btn {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 9999;
      background: #2e86de;
      color: #ffffff;
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 14px;
      text-decoration: none;
      font-family: system-ui, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,.35);
      transition: transform .12s ease, box-shadow .12s ease;
    }
    .robo-menu-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,.4);
    }
  `;
  document.head.appendChild(style);

  // Creăm butonul
  const btn = document.createElement("a");
  btn.id = "roboMenuBtn";
  btn.href = "/menu-robo.html";
  btn.className = "robo-menu-btn";
  btn.textContent = "Meniu Robo-Cip";

  // Funcție de atașare în body
  function attachButton() {
    if (!document.body) return;
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachButton);
  } else {
    attachButton();
  }

})();
