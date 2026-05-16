const express = require('express');
const router = express.Router();
const {
  focusTab,
  unfocusTab,
  isFocused,
  getFocusedTabs,
  focusTabs,
  clearFocus,
  focusSummary
} = require('../tabFocusTracker');

// GET /focus - list all focused tabs
router.get('/', (req, res) => {
  res.json({ focused: getFocusedTabs() });
});

// GET /focus/summary - summary of focused tabs
router.get('/summary', (req, res) => {
  res.json(focusSummary());
});

// POST /focus - focus one or more tabs
router.post('/', (req, res) => {
  const { tab, tabs } = req.body;
  if (tabs && Array.isArray(tabs)) {
    const results = focusTabs(tabs);
    return res.json({ results });
  }
  if (tab) {
    const result = focusTab(tab);
    if (!result.success) return res.status(400).json(result);
    return res.json(result);
  }
  return res.status(400).json({ error: 'Provide tab or tabs' });
});

// DELETE /focus - unfocus a tab or clear all
router.delete('/', (req, res) => {
  const { tab } = req.body;
  if (tab) {
    const result = unfocusTab(tab);
    if (!result.success) return res.status(404).json({ error: 'Tab was not focused' });
    return res.json(result);
  }
  const result = clearFocus();
  return res.json(result);
});

// GET /focus/check - check if a specific tab is focused
router.get('/check', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query param required' });
  const focused = isFocused({ url });
  res.json({ url, focused });
});

module.exports = router;
