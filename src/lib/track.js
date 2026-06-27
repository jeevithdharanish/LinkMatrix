import { createHash } from "crypto";

// Link-preview crawlers (LinkedIn, WhatsApp, Slack...) and generic bots hit the
// page every time the link is rendered somewhere — they are not real visitors.
const BOT_RE = /bot|crawl|spider|slurp|preview|scrape|httpclient|python-requests|python-urllib|curl\/|wget\/|axios\/|go-http-client|facebookexternalhit|linkedinbot|whatsapp|telegrambot|discordbot|twitterbot|slackbot|pinterest|embedly|quora link preview|vkshare|bitlybot|headless/i;

export function isBot(userAgent) {
  return !userAgent || BOT_RE.test(userAgent);
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// Extract visitor metadata from a Headers object (works for both the
// server-component `headers()` and a route handler's `req.headers`).
export function getVisitorMeta(h) {
  const userAgent = (h.get('user-agent') || '').slice(0, 300);
  // `ping` click beacons carry the page URL in Ping-From instead of Referer
  const referrer = (h.get('referer') || h.get('ping-from') || '').slice(0, 500);
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || '';
  const country = h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || '';
  const city = safeDecode(h.get('x-vercel-ip-city') || '');

  const visitorHash = (ip || userAgent)
    ? createHash('sha256')
      .update(`${ip}|${userAgent}|${process.env.NEXTAUTH_SECRET || ''}`)
      .digest('hex')
      .slice(0, 16)
    : '';

  return { referrer, userAgent, country, city, visitorHash };
}

export function deviceFromUA(ua) {
  if (!ua) return 'Unknown';
  if (/ipad|tablet/i.test(ua)) return 'Tablet';
  if (/mobi|android|iphone/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

// Order matters: more specific hosts before broader matches (gmail before google)
const SOURCE_MAP = [
  ['lnkd.in', 'LinkedIn'],
  ['linkedin.com', 'LinkedIn'],
  ['mail.google.com', 'Gmail'],
  ['google.', 'Google'],
  ['bing.com', 'Bing'],
  ['duckduckgo.com', 'DuckDuckGo'],
  ['t.co', 'Twitter / X'],
  ['twitter.com', 'Twitter / X'],
  ['x.com', 'Twitter / X'],
  ['instagram.com', 'Instagram'],
  ['facebook.com', 'Facebook'],
  ['fb.com', 'Facebook'],
  ['github.com', 'GitHub'],
  ['youtube.com', 'YouTube'],
  ['whatsapp.com', 'WhatsApp'],
  ['wa.me', 'WhatsApp'],
  ['t.me', 'Telegram'],
  ['telegram.', 'Telegram'],
  ['reddit.com', 'Reddit'],
  ['naukri.com', 'Naukri'],
  ['indeed.', 'Indeed'],
];

// Friendly labels for common ?ref= tags; unknown tags are shown capitalized
const REF_TAG_LABELS = {
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  telegram: 'Telegram',
  twitter: 'Twitter / X',
  x: 'Twitter / X',
  github: 'GitHub',
  youtube: 'YouTube',
  gmail: 'Gmail',
  email: 'Email',
  resume: 'Resume',
  naukri: 'Naukri',
  indeed: 'Indeed',
};

// Sanitize a ?ref= URL param into the stored referrer marker ("ref:<tag>").
// Returns '' when the tag is missing or unusable.
export function refTagToReferrer(tag) {
  if (typeof tag !== 'string') return '';
  const clean = tag.trim().toLowerCase().replace(/[^a-z0-9 _-]/g, '').slice(0, 50);
  return clean ? `ref:${clean}` : '';
}

export function sourceFromReferrer(referrer) {
  if (!referrer) return 'Direct';
  if (referrer.startsWith('ref:')) {
    const tag = referrer.slice(4);
    return REF_TAG_LABELS[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
  }
  let host;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return 'Direct';
  }
  let ownHost = '';
  try {
    ownHost = new URL(process.env.URL || '').hostname.replace(/^www\./, '');
  } catch { }
  if (ownHost && host === ownHost) return 'Internal';
  for (const [match, label] of SOURCE_MAP) {
    if (host === match || host.includes(match)) return label;
  }
  return host;
}

export function locationLabel(country, city) {
  if (city) return `${city}, ${countryName(country)}`;
  return countryName(country) || '';
}

export function countryName(code) {
  if (!code) return '';
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
}
