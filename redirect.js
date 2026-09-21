"use strict";
(() => {
  // src/redirect.ts
  var params = new URLSearchParams(window.location.search);
  var uri = params.get("uri");
  if (uri && uri.startsWith("spotify:")) {
    window.location.href = uri;
    setTimeout(() => {
      browser.runtime.sendMessage({ action: "closeTab" });
    }, 200);
  }
})();
