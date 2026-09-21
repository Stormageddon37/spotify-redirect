const params = new URLSearchParams(window.location.search);
const uri = params.get("uri");

if (uri && uri.startsWith("spotify:")) {
  window.location.href = uri;
  // Ask background script to close this tab
  setTimeout(() => {
    browser.runtime.sendMessage({ action: "closeTab" });
  }, 200);
}
