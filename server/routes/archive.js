// routes/archive.js — REST endpoints for tab archive feature

const express = require('express');
const router = express.Router();
const {
  archiveTabs,
  getArchive,
  getArchiveById,
  deleteArchiveEntry,
  clearArchive,
} = require('../tabArchiver');

// GET /archive — list all archived sessions
router.get('/', (req, res) => {
  try {
    const entries = getArchive();
    res.json({ success: true, count: entries.length, entries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /archive/:id — get a single archived session
router.get('/:id', (req, res) => {
  try {
    const entry = getArchiveById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, error: 'Archive entry not found' });
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /archive — create a new archive entry
router.post('/', (req, res) => {
  try {
    const { label, tabs } = req.body;
    if (!label) return res.status(400).json({ success: false, error: 'label is required' });
    if (!Array.isArray(tabs) || tabs.length === 0)
      return res.status(400).json({ success: false, error: 'tabs must be a non-empty array' });
    const entry = archiveTabs(label, tabs);
    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /archive/all — clear the entire archive
router.delete('/all', (req, res) => {
  try {
    clearArchive();
    res.json({ success: true, message: 'Archive cleared' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /archive/:id — remove a single entry
router.delete('/:id', (req, res) => {
  try {
    const removed = deleteArchiveEntry(req.params.id);
    if (!removed) return res.status(404).json({ success: false, error: 'Archive entry not found' });
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
