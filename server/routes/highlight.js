const express = require('express');
const router = express.Router();
const {
  HIGHLIGHT_COLORS,
  highlightTab,
  unhighlightTab,
  isHighlighted,
  getHighlightColor,
  highlightTabs,
  getHighlightedTabs,
  getHighlightsByColor,
  clearHighlights
} = require('../tabHighlighter');

const store = {};

// POST /highlight — highlight a single tab
router.post('/', (req, res) => {
  const { tab, color } = req.body;
  if (!tab || !color) return res.status(400).json({ error: 'tab and color are required' });
  try {
    const result = highlightTab(store, tab, color);
    res.json({ success: true, highlight: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /highlight/bulk — highlight multiple tabs
router.post('/bulk', (req, res) => {
  const { tabs, color } = req.body;
  if (!Array.isArray(tabs) || !color) return res.status(400).json({ error: 'tabs array and color are required' });
  try {
    const results = highlightTabs(store, tabs, color);
    res.json({ success: true, highlighted: results.length, highlights: results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /highlight/:tabId — remove highlight from a tab
router.delete('/:tabId', (req, res) => {
  const existed = unhighlightTab(store, req.params.tabId);
  res.json({ success: true, removed: existed });
});

// GET /highlight/status/:tabId — check if a tab is highlighted
router.get('/status/:tabId', (req, res) => {
  const highlighted = isHighlighted(store, req.params.tabId);
  const color = getHighlightColor(store, req.params.tabId);
  res.json({ tabId: req.params.tabId, highlighted, color });
});

// POST /highlight/query — get highlighted tabs from a list
router.post('/query', (req, res) => {
  const { tabs, color } = req.body;
  if (!Array.isArray(tabs)) return res.status(400).json({ error: 'tabs array is required' });
  const result = color
    ? getHighlightsByColor(store, tabs, color)
    : getHighlightedTabs(store, tabs);
  res.json({ count: result.length, tabs: result });
});

// DELETE /highlight — clear all highlights
router.delete('/', (req, res) => {
  clearHighlights(store);
  res.json({ success: true, message: 'All highlights cleared' });
});

// GET /highlight/colors — list valid colors
router.get('/colors', (req, res) => {
  res.json({ colors: HIGHLIGHT_COLORS });
});

module.exports = router;
