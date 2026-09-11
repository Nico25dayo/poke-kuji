(() => {
  if (!("serviceWorker" in navigator)) return;

  let refreshing = false;

  function showUpdateBar(worker) {
    if (document.getElementById("pokeKujiUpdateBar")) return;

    const bar = document.createElement("div");
    bar.id = "pokeKujiUpdateBar";
    bar.style.cssText = [
      "position:fixed",
      "left:12px",
      "right:12px",
      "bottom:14px",
      "z-index:99999",
      "display:flex",
      "align-items:center",
      "justify-content:space-between",
      "gap:12px",
      "padding:12px 14px",
      "border-radius:14px",
      "background:#222",
      "color:#fff",
      "box-shadow:0 8px 24px rgba(0,0,0,.24)",
      "font-family:-apple-system,BlinkMacSystemFont,'Noto Sans JP',sans-serif",
      "font-size:14px"
    ].join(";");

    const text = document.createElement("span");
    text.textContent = "ポケくじの新しいバージョンがあります";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "更新";
    button.style.cssText = [
      "border:0",
      "border-radius:10px",
      "padding:8px 14px",
      "background:#fff",
      "color:#222",
      "font-weight:700",
      "cursor:pointer"
    ].join(";");

    button.addEventListener("click", () => {
      button.disabled = true;
      button.textContent = "更新中…";
      worker.postMessage({ type: "SKIP_WAITING" });
    });

    bar.append(text, button);
    document.body.appendChild(bar);
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        updateViaCache: "none"
      });

      // 起動時に最新版を確認
      registration.update().catch(() => {});

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            showUpdateBar(newWorker);
          }
        });
      });
    } catch (error) {
      console.error("Service Worker登録エラー:", error);
    }
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
})();
