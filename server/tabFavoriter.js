// tabFavoriter.js — mark tabs as favorites and retrieve them

const favorites = new Map();

function getFavoriteKey(tab) {
  return tab.url;
}

function favoriteTab(tab) {
  const key = getFavoriteKey(tab);
  if (!key) throw new Error('Tab must have a url');
  favorites.set(key, { ...tab, favoritedAt: new Date().toISOString() });
  return favorites.get(key);
}

function unfavoriteTab(tab) {
  const key = getFavoriteKey(tab);
  return favorites.delete(key);
}

function isFavorite(tab) {
  return favorites.has(getFavoriteKey(tab));
}

function favoriteTabs(tabs) {
  return tabs.map(favoriteTab);
}

function getFavoriteTabs() {
  return Array.from(favorites.values());
}

function clearFavorites() {
  favorites.clear();
}

function getFavoriteSummary() {
  const all = getFavoriteTabs();
  const domains = {};
  for (const tab of all) {
    try {
      const host = new URL(tab.url).hostname;
      domains[host] = (domains[host] || 0) + 1;
    } catch (_) {}
  }
  return { total: all.length, byDomain: domains };
}

module.exports = {
  getFavoriteKey,
  favoriteTab,
  unfavoriteTab,
  isFavorite,
  favoriteTabs,
  getFavoriteTabs,
  clearFavorites,
  getFavoriteSummary,
};
