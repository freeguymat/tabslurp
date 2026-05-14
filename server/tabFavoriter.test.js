const {
  favoriteTab,
  unfavoriteTab,
  isFavorite,
  favoriteTabs,
  getFavoriteTabs,
  clearFavorites,
  getFavoriteSummary,
} = require('./tabFavoriter');

beforeEach(() => clearFavorites());

const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://github.com', title: 'GitHub' };

test('favoriteTab adds a tab', () => {
  const result = favoriteTab(tab1);
  expect(result.url).toBe(tab1.url);
  expect(result.favoritedAt).toBeDefined();
});

test('isFavorite returns true after favoriting', () => {
  favoriteTab(tab1);
  expect(isFavorite(tab1)).toBe(true);
});

test('isFavorite returns false for unknown tab', () => {
  expect(isFavorite(tab2)).toBe(false);
});

test('unfavoriteTab removes a tab', () => {
  favoriteTab(tab1);
  unfavoriteTab(tab1);
  expect(isFavorite(tab1)).toBe(false);
});

test('unfavoriteTab returns false when tab not favorited', () => {
  expect(unfavoriteTab(tab2)).toBe(false);
});

test('favoriteTabs favorites multiple tabs', () => {
  const results = favoriteTabs([tab1, tab2]);
  expect(results).toHaveLength(2);
  expect(isFavorite(tab1)).toBe(true);
  expect(isFavorite(tab2)).toBe(true);
});

test('getFavoriteTabs returns all favorites', () => {
  favoriteTabs([tab1, tab2]);
  expect(getFavoriteTabs()).toHaveLength(2);
});

test('clearFavorites empties the store', () => {
  favoriteTabs([tab1, tab2]);
  clearFavorites();
  expect(getFavoriteTabs()).toHaveLength(0);
});

test('getFavoriteSummary returns correct total and domains', () => {
  favoriteTabs([tab1, tab2]);
  const summary = getFavoriteSummary();
  expect(summary.total).toBe(2);
  expect(summary.byDomain['example.com']).toBe(1);
  expect(summary.byDomain['github.com']).toBe(1);
});

test('favoriteTab throws if tab has no url', () => {
  expect(() => favoriteTab({ title: 'No URL' })).toThrow();
});
