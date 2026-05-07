const {
  addNote,
  getNotesForTab,
  removeNote,
  clearNotesForTab,
  annotateTabsWithNotes,
  clearAllNotes,
} = require('./tabNotes');

const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://other.com', title: 'Other' };

beforeEach(() => {
  clearAllNotes();
});

test('addNote returns note with id, text, createdAt', () => {
  const note = addNote(tab1, 'interesting page');
  expect(note.text).toBe('interesting page');
  expect(note.id).toBeDefined();
  expect(note.createdAt).toBeDefined();
});

test('getNotesForTab returns added notes', () => {
  addNote(tab1, 'first note');
  addNote(tab1, 'second note');
  const result = getNotesForTab(tab1);
  expect(result).toHaveLength(2);
  expect(result[0].text).toBe('first note');
});

test('getNotesForTab returns empty array for tab with no notes', () => {
  expect(getNotesForTab(tab2)).toEqual([]);
});

test('notes are scoped per tab url', () => {
  addNote(tab1, 'note for tab1');
  expect(getNotesForTab(tab2)).toHaveLength(0);
});

test('removeNote removes correct note', () => {
  const note = addNote(tab1, 'to remove');
  addNote(tab1, 'to keep');
  removeNote(tab1, note.id);
  const remaining = getNotesForTab(tab1);
  expect(remaining).toHaveLength(1);
  expect(remaining[0].text).toBe('to keep');
});

test('clearNotesForTab removes all notes for that tab', () => {
  addNote(tab1, 'a');
  addNote(tab1, 'b');
  clearNotesForTab(tab1);
  expect(getNotesForTab(tab1)).toHaveLength(0);
});

test('annotateTabsWithNotes attaches notes array to each tab', () => {
  addNote(tab1, 'annotated');
  const result = annotateTabsWithNotes([tab1, tab2]);
  expect(result[0].notes).toHaveLength(1);
  expect(result[1].notes).toHaveLength(0);
});

test('addNote throws on invalid tab', () => {
  expect(() => addNote({}, 'note')).toThrow('Invalid tab');
});

test('addNote throws on empty note text', () => {
  expect(() => addNote(tab1, '  ')).toThrow('non-empty string');
});
