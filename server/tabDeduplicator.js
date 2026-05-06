/**
 * Deduplicates tabs based on URL, with options for normalization
 */

/**
 * Normalize a URL for comparison purposes
 * Strips trailing slashes, fragments, and optionally query strings
 * @param {string} url
 * @param {object} options
 * @returns {string}
 */
function normalizeUrl(url, options = {}) {
  const { ignoreQuery = false, ignoreFragment = true } = options;

  try {
    const parsed = new URL(url);

    if (ignoreFragment) {
      parsed.hash = '';
    }

    if (ignoreQuery) {
      parsed.search = '';
    }

    let normalized = parsed.toString();
    // Strip trailing slash from pathname only
    if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
      normalized = normalized.replace(/\/$/, '');
    }

    return normalized;
  } catch {
    return url;
  }
}

/**
 * Remove duplicate tabs from an array
 * When duplicates are found, the first occurrence is kept
 * @param {Array} tabs
 * @param {object} options
 * @returns {{ unique: Array, duplicates: Array }}
 */
function deduplicateTabs(tabs, options = {}) {
  const seen = new Map();
  const unique = [];
  const duplicates = [];

  for (const tab of tabs) {
    const key = normalizeUrl(tab.url, options);

    if (seen.has(key)) {
      duplicates.push({ tab, duplicateOf: seen.get(key) });
    } else {
      seen.set(key, tab);
      unique.push(tab);
    }
  }

  return { unique, duplicates };
}

module.exports = { normalizeUrl, deduplicateTabs };
