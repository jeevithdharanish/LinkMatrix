// Client-safe URL helpers (no Node-only imports — used in both server and client components)

// Unicode-safe base64 encoder producing URL-safe output
export function safeBase64Encode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch {
    return encodeURIComponent(str);
  }
}

// Normalize a base URL to always end with a trailing slash
export function normalizeBaseUrl(url) {
  if (!url) return '/';
  return url.endsWith('/') ? url : url + '/';
}

// Build the /api/click tracking beacon URL used in <a ping=...>.
// Single source of truth for the click API's query contract.
export function clickPingUrl(baseUrl, pageUri, url, clickType) {
  return `${normalizeBaseUrl(baseUrl)}api/click?url=${safeBase64Encode(url)}&page=${encodeURIComponent(pageUri)}&clickType=${clickType}`;
}
