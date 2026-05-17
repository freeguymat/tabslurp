/**
 * tabMetadataEnricher.js
 * Enriches tab objects with derived metadata fields.
 */

const SOCIAL_DOMAINS = ['twitter.com', 'x.com', 'reddit.com', 'linkedin.com', 'facebook.com', 'instagram.com'];
const VIDEO_DOMAINS = ['youtube.com', 'vimeo.com', 'twitch.tv', 'dailymotion.com'];
const DEV_DOMAINS = ['github.com', 'stackoverflow.com', 'gitlab.com', 'npmjs.com', 'developer.mozilla.org'];
const NEWS_DOMAINS = ['bbc.com', 'cnn.com', 'nytimes.com', 'theguardian.com', 'reuters.com', 'hn.algolia.com', 'news.ycombinator.com'];

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function classifyContent(tab) {
  const domain = extractDomain(tab.url);
  if (!domain) return 'unknown';
  if (VIDEO_DOMAINS.some(d => domain.includes(d))) return 'video';
  if (SOCIAL_DOMAINS.some(d => domain.includes(d))) return 'social';
  if (DEV_DOMAINS.some(d => domain.includes(d))) return 'dev';
  if (NEWS_DOMAINS.some(d => domain.includes(d))) return 'news';
  return 'general';
}

function getProtocol(url) {
  try {
    return new URL(url).protocol.replace(':', '');
  } catch {
    return 'unknown';
  }
}

function isSecure(url) {
  return getProtocol(url) === 'https';
}

function getTitleWordCount(title) {
  if (!title || typeof title !== 'string') return 0;
  return title.trim().split(/\s+/).filter(Boolean).length;
}

function enrichTab(tab) {
  if (!tab || typeof tab !== 'object') return tab;
  const domain = extractDomain(tab.url);
  return {
    ...tab,
    _meta: {
      domain,
      protocol: getProtocol(tab.url),
      secure: isSecure(tab.url),
      contentType: classifyContent(tab),
      titleWordCount: getTitleWordCount(tab.title),
      hasTitle: Boolean(tab.title && tab.title.trim()),
      enrichedAt: new Date().toISOString()
    }
  };
}

function enrichTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.map(enrichTab);
}

function enrichmentSummary(enrichedTabs) {
  const contentTypes = {};
  let secureCount = 0;
  for (const tab of enrichedTabs) {
    const meta = tab._meta || {};
    contentTypes[meta.contentType] = (contentTypes[meta.contentType] || 0) + 1;
    if (meta.secure) secureCount++;
  }
  return {
    total: enrichedTabs.length,
    secureCount,
    insecureCount: enrichedTabs.length - secureCount,
    contentTypes
  };
}

module.exports = { extractDomain, classifyContent, isSecure, enrichTab, enrichTabs, enrichmentSummary };
