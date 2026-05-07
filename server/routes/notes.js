// routes/notes.js - REST endpoints for tab notes
const express = require('express');
const router = express.Router();
const {
  addNote,
  getNotesForTab,
  removeNote,
  clearNotesForTab,
} = require('../tabNotes');

// GET /notes?url=... - get notes for a tab
router.get('/', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query param required' });
  try {
    const notes = getNotesForTab({ url });
    res.json({ url, notes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /notes - add a note to a tab
// body: { url, title?, text }
router.post('/', (req, res) => {
  const { url, title, text } = req.body || {};
  if (!url) return res.status(400).json({ error: 'url is required' });
  if (!text) return res.status(400).json({ error: 'text is required' });
  try {
    const note = addNote({ url, title }, text);
    res.status(201).json({ url, note });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /notes/:noteId?url=... - remove a specific note
router.delete('/:noteId', (req, res) => {
  const { url } = req.query;
  const { noteId } = req.params;
  if (!url) return res.status(400).json({ error: 'url query param required' });
  try {
    const remaining = removeNote({ url }, noteId);
    res.json({ url, remaining });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /notes?url=... - clear all notes for a tab
router.delete('/', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query param required' });
  try {
    clearNotesForTab({ url });
    res.json({ url, message: 'all notes cleared' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
