// tabNotes.js - attach and manage notes on individual tabs

const notes = new Map();

function getNoteKey(tab) {
  return tab.url;
}

function addNote(tab, noteText) {
  if (!tab || !tab.url) throw new Error('Invalid tab: missing url');
  if (typeof noteText !== 'string' || noteText.trim() === '') {
    throw new Error('Note text must be a non-empty string');
  }
  const key = getNoteKey(tab);
  const existing = notes.get(key) || [];
  const note = {
    id: Date.now() + Math.random().toString(36).slice(2),
    text: noteText.trim(),
    createdAt: new Date().toISOString(),
  };
  existing.push(note);
  notes.set(key, existing);
  return note;
}

function getNotesForTab(tab) {
  if (!tab || !tab.url) throw new Error('Invalid tab: missing url');
  return notes.get(getNoteKey(tab)) || [];
}

function removeNote(tab, noteId) {
  if (!tab || !tab.url) throw new Error('Invalid tab: missing url');
  const key = getNoteKey(tab);
  const existing = notes.get(key) || [];
  const updated = existing.filter((n) => n.id !== noteId);
  notes.set(key, updated);
  return updated;
}

function clearNotesForTab(tab) {
  if (!tab || !tab.url) throw new Error('Invalid tab: missing url');
  notes.delete(getNoteKey(tab));
}

function annotateTabsWithNotes(tabs) {
  return tabs.map((tab) => ({
    ...tab,
    notes: getNotesForTab(tab),
  }));
}

function clearAllNotes() {
  notes.clear();
}

module.exports = {
  addNote,
  getNotesForTab,
  removeNote,
  clearNotesForTab,
  annotateTabsWithNotes,
  clearAllNotes,
};
