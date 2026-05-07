const {
  snoozeTab,
  unsnoozeTab,
  isSnoozed,
  getSnoozedTabs,
  getAwokenTabs,
  clearSnoozed,
  getSnoozeSummary,
} = require('./tabSnoozer');

const future = new Date(Date.now() + 60 * 60 * 1000).toISOString();
const past = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://github.com', title: 'GitHub' };

beforeEach(() => clearSnoozed());

test('snoozeTab stores a tab with wakeAt', () => {
  const entry = snoozeTab(tab1, future);
  expect(entry.tab).toEqual(tab1);
  expect(entry.wakeAt).toBe(new Date(future).toISOString());
  expect(entry.snoozedAt).toBeDefined();
});

test('snoozeTab throws on invalid tab', () => {
  expect(() => snoozeTab(null, future)).toThrow('Invalid tab');
  expect(() => snoozeTab({}, future)).toThrow('Invalid tab');
});

test('snoozeTab throws on invalid wakeAt', () => {
  expect(() => snoozeTab(tab1, 'not-a-date')).toThrow('Invalid wakeAt');
  expect(() => snoozeTab(tab1, null)).toThrow('Invalid wakeAt');
});

test('isSnoozed returns true after snoozing', () => {
  snoozeTab(tab1, future);
  expect(isSnoozed(tab1.url)).toBe(true);
  expect(isSnoozed(tab2.url)).toBe(false);
});

test('unsnoozeTab removes and returns entry', () => {
  snoozeTab(tab1, future);
  const entry = unsnoozeTab(tab1.url);
  expect(entry.tab).toEqual(tab1);
  expect(isSnoozed(tab1.url)).toBe(false);
});

test('unsnoozeTab returns null if not snoozed', () => {
  expect(unsnoozeTab('https://nope.com')).toBeNull();
});

test('getSnoozedTabs returns all snoozed entries', () => {
  snoozeTab(tab1, future);
  snoozeTab(tab2, future);
  expect(getSnoozedTabs()).toHaveLength(2);
});

test('getAwokenTabs returns only past-due tabs', () => {
  snoozeTab(tab1, past);
  snoozeTab(tab2, future);
  const awoken = getAwokenTabs();
  expect(awoken).toHaveLength(1);
  expect(awoken[0].tab.url).toBe(tab1.url);
});

test('getSnoozeSummary reflects state correctly', () => {
  snoozeTab(tab1, past);
  snoozeTab(tab2, future);
  const summary = getSnoozeSummary();
  expect(summary.total).toBe(2);
  expect(summary.awoken).toBe(1);
  expect(summary.pending).toBe(1);
});
