const {
  createSnapshot,
  getSnapshots,
  getSnapshot,
  getLatestSnapshot,
  deleteSnapshot,
  clearSnapshots,
  versionSummary
} = require('./tabVersioner');

const sampleTabs = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://github.com', title: 'GitHub' }
];

beforeEach(() => {
  clearSnapshots('test');
  clearSnapshots('other');
});

test('createSnapshot returns a versioned snapshot', () => {
  const snap = createSnapshot('test', sampleTabs);
  expect(snap.version).toBe(1);
  expect(snap.tabCount).toBe(2);
  expect(snap.tabs).toHaveLength(2);
  expect(snap.createdAt).toBeDefined();
});

test('createSnapshot increments version', () => {
  createSnapshot('test', sampleTabs);
  const snap2 = createSnapshot('test', sampleTabs);
  expect(snap2.version).toBe(2);
});

test('getSnapshots returns all snapshots for a name', () => {
  createSnapshot('test', sampleTabs);
  createSnapshot('test', sampleTabs);
  expect(getSnapshots('test')).toHaveLength(2);
});

test('getSnapshots returns empty array for unknown name', () => {
  expect(getSnapshots('nope')).toEqual([]);
});

test('getSnapshot retrieves specific version', () => {
  createSnapshot('test', sampleTabs);
  createSnapshot('test', [sampleTabs[0]]);
  const snap = getSnapshot('test', 2);
  expect(snap.tabCount).toBe(1);
});

test('getSnapshot returns null for missing version', () => {
  createSnapshot('test', sampleTabs);
  expect(getSnapshot('test', 99)).toBeNull();
});

test('getLatestSnapshot returns most recent', () => {
  createSnapshot('test', sampleTabs);
  createSnapshot('test', [sampleTabs[0]]);
  const latest = getLatestSnapshot('test');
  expect(latest.version).toBe(2);
});

test('getLatestSnapshot returns null when empty', () => {
  expect(getLatestSnapshot('test')).toBeNull();
});

test('deleteSnapshot removes a version', () => {
  createSnapshot('test', sampleTabs);
  createSnapshot('test', sampleTabs);
  const removed = deleteSnapshot('test', 1);
  expect(removed).toBe(true);
  expect(getSnapshots('test')).toHaveLength(1);
});

test('versionSummary returns correct summary', () => {
  createSnapshot('test', sampleTabs);
  createSnapshot('test', sampleTabs);
  const summary = versionSummary('test');
  expect(summary.totalVersions).toBe(2);
  expect(summary.latest).toBe(2);
  expect(summary.name).toBe('test');
});
