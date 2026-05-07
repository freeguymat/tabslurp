// tabArchiver.js — archive exported tab sets for later retrieval

const fs = require('fs');
const path = require('path');

const ARCHIVE_FILE = path.join(__dirname, 'data', 'archive.json');

function ensureArchiveFile() {
  const dir = path.dirname(ARCHIVE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ARCHIVE_FILE)) fs.writeFileSync(ARCHIVE_FILE, '[]', 'utf8');
}

function loadArchive() {
  ensureArchiveFile();
  const raw = fs.readFileSync(ARCHIVE_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveArchive(entries) {
  ensureArchiveFile();
  fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

function archiveTabs(label, tabs) {
  if (!label || typeof label !== 'string') throw new Error('label must be a non-empty string');
  if (!Array.isArray(tabs) || tabs.length === 0) throw new Error('tabs must be a non-empty array');

  const entries = loadArchive();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    label: label.trim(),
    tabs,
    archivedAt: new Date().toISOString(),
    count: tabs.length,
  };
  entries.push(entry);
  saveArchive(entries);
  return entry;
}

function getArchive() {
  return loadArchive();
}

function getArchiveById(id) {
  const entries = loadArchive();
  return entries.find((e) => e.id === id) || null;
}

function deleteArchiveEntry(id) {
  const entries = loadArchive();
  const next = entries.filter((e) => e.id !== id);
  if (next.length === entries.length) return false;
  saveArchive(next);
  return true;
}

function clearArchive() {
  saveArchive([]);
}

module.exports = { archiveTabs, getArchive, getArchiveById, deleteArchiveEntry, clearArchive };
