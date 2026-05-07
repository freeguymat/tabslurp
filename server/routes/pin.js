// routes/pin.js — API routes for pinning and managing pinned tabs

const express = require('express');
const router = express.Router();
const {
  pinTab,
  unpinTab,
  isPinned,
  pinTabs,
  getPinnedTabs,
  getUnpinnedTabs,
  clearPinned,
  getPinnedUrls
} = require('../tabPinner');

// GET /pin — list all pinned URLs
router.get('/', (req, res) => {
  const urls = getPinnedUrls();
  res.json({ pinned: urls, count: urls.length });
});

// POST /pin — pin one or more tabs
router.post('/', (req, res) => {
  const { tabs, tab } = req.body;

  if (tabs && Array.isArray(tabs)) {
    const result = pinTabs(tabs);
    return res.json(result);
  }

  if (tab) {
    const result = pinTab(tab);
    if (!result.success) return res.status(400).json(result);
    return res.json(result);
  }

  return res.status(400).json({ error: 'Provide tab or tabs in request body' });
});

// DELETE /pin — unpin a tab by url
router.delete('/', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });
  const result = unpinTab({ url });
  if (!result.success) return res.status(404).json({ error: 'Tab not pinned', url });
  res.json(result);
});

// POST /pin/filter — split provided tabs into pinned vs unpinned
router.post('/filter', (req, res) => {
  const { tabs } = req.body;
  if (!Array.isArray(tabs)) {
    return res.status(400).json({ error: 'tabs must be an array' });
  }
  const pinned = getPinnedTabs(tabs);
  const unpinned = getUnpinnedTabs(tabs);
  res.json({ pinned, unpinned });
});

// DELETE /pin/all — clear all pinned tabs
router.delete('/all', (req, res) => {
  clearPinned();
  res.json({ success: true, message: 'All pins cleared' });
});

module.exports = router;
