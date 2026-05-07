const fs = require('fs');
const path = require('path');

// Point archive at a temp file for tests
const ARCHIVE_FILE = path.join(__dirname, 'data', 'archive.json');

const {
  archiveTabs,
  getArchive,
  getArchiveById,
  deleteArchiveEntry,
  clearArchive,
} = require('./tabArchiver');

const sampleTabs = [
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'MDN', url: 'https://developer.mozilla.org' },
];

beforeEach(() => {
  clearArchive();
});

test('archiveTabs stores an entry and returns it', () => {
  const entry = archiveTabs('My Session', sampleTabs);
  expect(entry).toHaveProperty('id');
  expect(entry.label).toBe('My Session');
  expect(entry.count).toBe(2);
  expect(entry).toHaveProperty('archivedAt');
});

test('getArchive returns all entries', () => {
  archiveTabs('Session A', sampleTabs);
  archiveTabs('Session B', sampleTabs);
  const all = getArchive();
  expect(all).toHaveLength(2);
});

test('getArchiveById returns correct entry', () => {
  const entry = archiveTabs('Find Me', sampleTabs);
  const found = getArchiveById(entry.id);
  expect(found).not.toBeNull();
  expect(found.label).toBe('Find Me');
});

test('getArchiveById returns null for unknown id', () => {
  expect(getArchiveById('nope')).toBeNull();
});

test('deleteArchiveEntry removes entry and returns true', () => {
  const entry = archiveTabs('Delete Me', sampleTabs);
  const result = deleteArchiveEntry(entry.id);
  expect(result).toBe(true);
  expect(getArchive()).toHaveLength(0);
});

test('deleteArchiveEntry returns false for missing id', () => {
  expect(deleteArchiveEntry('ghost')).toBe(false);
});

test('archiveTabs throws on invalid label', () => {
  expect(() => archiveTabs('', sampleTabs)).toThrow();
});

test('archiveTabs throws on empty tabs array', () => {
  expect(() => archiveTabs('Label', [])).toThrow();
});

test('clearArchive empties all entries', () => {
  archiveTabs('One', sampleTabs);
  archiveTabs('Two', sampleTabs);
  clearArchive();
  expect(getArchive()).toHaveLength(0);
});
