const {
  startTracking,
  stopTracking,
  getTracking,
  getTotalTime,
  formatDuration,
  getAllTracking,
  clearTracking,
} = require('./tabTimeTracker');

describe('tabTimeTracker', () => {
  const tab = { url: 'https://example.com', title: 'Example' };

  beforeEach(() => {
    clearTracking(tab.url);
  });

  test('startTracking returns entry with startedAt', () => {
    const entry = startTracking(tab);
    expect(entry).not.toBeNull();
    expect(entry.url).toBe(tab.url);
    expect(entry.startedAt).toBeGreaterThan(0);
    expect(entry.totalMs).toBe(0);
  });

  test('startTracking returns null for invalid tab', () => {
    expect(startTracking(null)).toBeNull();
    expect(startTracking({})).toBeNull();
  });

  test('stopTracking accumulates time', () => {
    startTracking(tab);
    const entry = stopTracking(tab.url);
    expect(entry).not.toBeNull();
    expect(entry.totalMs).toBeGreaterThanOrEqual(0);
    expect(entry.startedAt).toBeNull();
  });

  test('stopTracking returns null for untracked url', () => {
    expect(stopTracking('https://nottracked.com')).toBeNull();
  });

  test('getTracking returns null for unknown url', () => {
    expect(getTracking('https://unknown.com')).toBeNull();
  });

  test('getTotalTime returns 0 for unknown url', () => {
    expect(getTotalTime('https://nobody.com')).toBe(0);
  });

  test('getTotalTime includes live time when active', () => {
    startTracking(tab);
    const total = getTotalTime(tab.url);
    expect(total).toBeGreaterThanOrEqual(0);
  });

  test('formatDuration formats ms correctly', () => {
    expect(formatDuration(90000)).toBe('1m 30s');
    expect(formatDuration(0)).toBe('0m 0s');
    expect(formatDuration(3600000)).toBe('60m 0s');
  });

  test('getAllTracking returns all entries', () => {
    startTracking(tab);
    const all = getAllTracking();
    expect(Array.isArray(all)).toBe(true);
    const found = all.find((e) => e.url === tab.url);
    expect(found).toBeDefined();
    expect(found.active).toBe(true);
    expect(typeof found.formatted).toBe('string');
  });

  test('clearTracking removes entry', () => {
    startTracking(tab);
    const result = clearTracking(tab.url);
    expect(result).toBe(true);
    expect(getTracking(tab.url)).toBeNull();
  });

  test('clearTracking returns false for unknown url', () => {
    expect(clearTracking('https://nope.com')).toBe(false);
  });
});
