const SKIP_PATHS = ["/embed/", "/embed?", "/log/"];

function toSpotifyUri(url: string): string | null {
  const parsed = new URL(url);
  const path = parsed.pathname;

  for (const skip of SKIP_PATHS) {
    if (path.includes(skip)) return null;
  }

  // /track/abc123 -> spotify:track:abc123
  const stripped = path.startsWith("/") ? path.slice(1) : path;
  if (!stripped) return null;

  return "spotify:" + stripped.replace(/\//g, ":");
}

// Close tab when redirect page asks
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "closeTab" && sender.tab?.id) {
    browser.tabs.remove(sender.tab.id).catch(() => {});
  }
});

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    const uri = toSpotifyUri(details.url);
    if (!uri) return {};

    // Redirect to local page that triggers spotify: URI via window.location.
    // This makes Firefox show the protocol handler dialog properly.
    const redirectPage = browser.runtime.getURL(
      `redirect.html?uri=${encodeURIComponent(uri)}`
    );
    return { redirectUrl: redirectPage };
  },
  { urls: ["*://open.spotify.com/*"], types: ["main_frame"] },
  ["blocking"]
);
