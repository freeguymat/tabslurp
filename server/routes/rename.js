// routes/rename.js — endpoints for tab renaming

const express = require('express');
const router = express.Router();
const {
  renameTab,
  unrename,
  isRenamed,
  getCustomTitle,
  applyRenames,
  getRenameMap,
} = require('../tabRenamer');

// POST /rename — rename a single tab
router.post('/', (req, res) => {
  const { tab, newTitle } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  if (!newTitle || typeof newTitle !== 'string') {
    return res.status(400).json({ error: 'newTitle must be a non-empty string' });
  }
  try {
    const renamed = renameTab(tab, newTitle);
    res.json({ success: true, tab: renamed });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /rename/apply — apply all renames to a list of tabs
router.post('/apply', (req, res) => {
  const { tabs } = req.body;
  if (!Array.isArray(tabs)) {
    return res.status(400).json({ error: 'tabs must be an array' });
  }
  try {
    const result = applyRenames(tabs);
    res.json({ success: true, tabs: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /rename — remove a custom rename for a tab
router.delete('/', (req, res) => {
  const { tab } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  const existed = unrename(tab);
  res.json({ success: true, removed: existed });
});

// GET /rename/map — get all current renames
router.get('/map', (req, res) => {
  res.json({ renames: getRenameMap() });
});

// GET /rename/check — check if a tab is renamed
router.post('/check', (req, res) => {
  const { tab } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  res.json({
    renamed: isRenamed(tab),
    customTitle: getCustomTitle(tab),
  });
});

module.exports = router;
