(function() {
  const ORG = document.currentScript.getAttribute("data-org") || "demo-org";
  const INTERVAL_MINUTES = 0.1; // ca. 6 sekunder
  const userId = getUserId();

  function getUserId() {
    const key = "plugpause-user";
    let id = localStorage.getItem(key);
    if (!id) {
      id = "u" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem(key, id);
    }
    return id;
  }

  function showWidget() {
    if (document.getElementById("plugpause-widget")) return;

    const box = document.createElement("div");
    box.id = "plugpause-widget";
    box.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: #f0f4f8; color: #333;
      padding: 12px 16px; border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      font-family: sans-serif; font-size: 14px;
      z-index: 9999;
    `;
    box.innerHTML = `
      <strong>Plug & Pause</strong><br>
      Tid til en mikropause!<br>
      <button id="plugpause-btn" style="
        margin-top: 6px; padding: 6px 12px;
        background: #0078d4; color: white;
        border: none; border-radius: 4px;
        cursor: pointer;
      ">Jeg tog en pause</button>
    `;
    document.body.appendChild(box);

    document.getElementById("plugpause-btn").onclick = () => {
      fetch(`https://plugpause.workers.dev/track?org=${ORG}&user=${getUserId()}&event=pause`);
      box.innerHTML = "Tak for pausen! 👌";
      setTimeout(() => box.remove(), 3000);
      setTimeout(showWidget, INTERVAL_MINUTES * 60 * 1000);
    };
  }

  setTimeout(showWidget, INTERVAL_MINUTES * 60 * 1000);
})();
