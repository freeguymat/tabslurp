const {
  HIGHLIGHT_COLORS,
  isValidColor,
  highlightTab,
  unhighlightTab,
  isHighlighted,
  getHighlightColor,
  highlightTabs,
  getHighlightedTabs,
  getHighlightsByColor,
  clearHighlights
} = require('./tabHighlighter');

let store;
const tab1 = { id: 'a1', title: 'GitHub', url: 'https://github.com' };
const tab2 = { id: 'a2', title: 'MDN', url: 'https://developer.mozilla.org' };
const tab3 = { id: 'a3', title: 'NPM', url: 'https://npmjs.com' };

beforeEach(() => { store = {}; });

test('isValidColor returns true for valid colors', () => {
  HIGHLIGHT_COLORS.forEach(c => expect(isValidColor(c)).toBe(true));
});

test('isValidColor returns false for unknown color', () => {
  expect(isValidColor('magenta')).toBe(false);
});

test('highlightTab stores highlight entry', () => {
  const result = highlightTab(store, tab1, 'red');
  expect(result.tabId).toBe('a1');
  expect(result.color).toBe('red');
  expect(result.highlightedAt).toBeDefined();
});

test('highlightTab throws on invalid color', () => {
  expect(() => highlightTab(store, tab1, 'neon')).toThrow('Invalid color');
});

test('highlightTab throws on invalid tab', () => {
  expect(() => highlightTab(store, null, 'blue')).toThrow('Invalid tab');
});

test('isHighlighted returns true after highlight', () => {
  highlightTab(store, tab1, 'green');
  expect(isHighlighted(store, 'a1')).toBe(true);
});

test('unhighlightTab removes highlight', () => {
  highlightTab(store, tab1, 'blue');
  expect(unhighlightTab(store, 'a1')).toBe(true);
  expect(isHighlighted(store, 'a1')).toBe(false);
});

test('unhighlightTab returns false when not highlighted', () => {
  expect(unhighlightTab(store, 'nonexistent')).toBe(false);
});

test('getHighlightColor returns color or null', () => {
  highlightTab(store, tab1, 'yellow');
  expect(getHighlightColor(store, 'a1')).toBe('yellow');
  expect(getHighlightColor(store, 'a2')).toBeNull();
});

test('highlightTabs highlights multiple tabs', () => {
  const results = highlightTabs(store, [tab1, tab2], 'purple');
  expect(results).toHaveLength(2);
  expect(results[0].color).toBe('purple');
});

test('getHighlightedTabs returns only highlighted tabs', () => {
  highlightTab(store, tab1, 'red');
  highlightTab(store, tab3, 'blue');
  const result = getHighlightedTabs(store, [tab1, tab2, tab3]);
  expect(result).toHaveLength(2);
  expect(result.map(t => t.id)).toContain('a1');
  expect(result.map(t => t.id)).toContain('a3');
});

test('getHighlightsByColor filters by color', () => {
  highlightTab(store, tab1, 'red');
  highlightTab(store, tab2, 'blue');
  highlightTab(store, tab3, 'red');
  const reds = getHighlightsByColor(store, [tab1, tab2, tab3], 'red');
  expect(reds).toHaveLength(2);
});

test('clearHighlights removes all highlights', () => {
  highlightTab(store, tab1, 'red');
  highlightTab(store, tab2, 'blue');
  clearHighlights(store);
  expect(isHighlighted(store, 'a1')).toBe(false);
  expect(isHighlighted(store, 'a2')).toBe(false);
});
