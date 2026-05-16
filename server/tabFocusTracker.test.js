const {
  focusTab,
  unfocusTab,
  isFocused,
  getFocusedTabs,
  focusTabs,
  clearFocus,
  focusSummary
} = require('./tabFocusTracker');

beforeEach(() => clearFocus());

const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://github.com', title: 'GitHub' };

test('focusTab marks a tab as focused', () => {
  const result = focusTab(tab1);
  expect(result.success).toBe(true);
  expect(isFocused(tab1)).toBe(true);
});

test('focusTab returns error for tab without url or id', () => {
  const result = focusTab({});
  expect(result.success).toBe(false);
  expect(result.error).toBeDefined();
});

test('unfocusTab removes a focused tab', () => {
  focusTab(tab1);
  const result = unfocusTab(tab1);
  expect(result.success).toBe(true);
  expect(isFocused(tab1)).toBe(false);
});

test('unfocusTab returns false if tab was not focused', () => {
  const result = unfocusTab(tab2);
  expect(result.success).toBe(false);
});

test('getFocusedTabs returns all focused tabs with focusedAt', () => {
  focusTab(tab1);
  focusTab(tab2);
  const focused = getFocusedTabs();
  expect(focused.length).toBe(2);
  expect(focused[0]).toHaveProperty('focusedAt');
});

test('focusTabs focuses multiple tabs', () => {
  const results = focusTabs([tab1, tab2]);
  expect(results.length).toBe(2);
  expect(results.every(r => r.success)).toBe(true);
});

test('clearFocus removes all focused tabs', () => {
  focusTab(tab1);
  focusTab(tab2);
  const result = clearFocus();
  expect(result.cleared).toBe(2);
  expect(getFocusedTabs().length).toBe(0);
});

test('focusSummary returns count and urls', () => {
  focusTab(tab1);
  focusTab(tab2);
  const summary = focusSummary();
  expect(summary.total).toBe(2);
  expect(summary.urls).toContain('https://example.com');
});
