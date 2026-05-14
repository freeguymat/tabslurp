// Tab rating system — let users rate tabs 1-5 stars

const ratings = {};

function getRatingKey(tab) {
  return tab.url;
}

function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function rateTab(tab, rating) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  if (!isValidRating(rating)) throw new Error('Rating must be an integer between 1 and 5');
  const key = getRatingKey(tab);
  ratings[key] = { url: tab.url, title: tab.title || '', rating, ratedAt: new Date().toISOString() };
  return ratings[key];
}

function unrateTab(tab) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  const key = getRatingKey(tab);
  const existed = !!ratings[key];
  delete ratings[key];
  return existed;
}

function getRating(tab) {
  if (!tab || !tab.url) return null;
  return ratings[getRatingKey(tab)] || null;
}

function isRated(tab) {
  return !!getRating(tab);
}

function rateTabs(tabs, rating) {
  return tabs.map(tab => rateTab(tab, rating));
}

function getTopRated(minRating = 4) {
  return Object.values(ratings).filter(r => r.rating >= minRating).sort((a, b) => b.rating - a.rating);
}

function getAllRatings() {
  return Object.values(ratings);
}

function clearRatings() {
  Object.keys(ratings).forEach(k => delete ratings[k]);
}

function ratingSummary(tabs) {
  const rated = tabs.filter(t => isRated(t));
  const total = rated.reduce((sum, t) => sum + getRating(t).rating, 0);
  return {
    total: tabs.length,
    rated: rated.length,
    unrated: tabs.length - rated.length,
    averageRating: rated.length ? parseFloat((total / rated.length).toFixed(2)) : null
  };
}

module.exports = { getRatingKey, isValidRating, rateTab, unrateTab, getRating, isRated, rateTabs, getTopRated, getAllRatings, clearRatings, ratingSummary };
