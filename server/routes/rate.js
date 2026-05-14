const express = require('express');
const router = express.Router();
const { rateTab, unrateTab, getRating, isRated, rateTabs, getTopRated, getAllRatings, ratingSummary } = require('../tabRater');

// POST /rate — rate a single tab
router.post('/', (req, res) => {
  const { tab, rating } = req.body;
  if (!tab || !tab.url) return res.status(400).json({ error: 'tab with url required' });
  if (rating === undefined) return res.status(400).json({ error: 'rating required' });
  try {
    const result = rateTab(tab, rating);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /rate/bulk — rate multiple tabs with the same rating
router.post('/bulk', (req, res) => {
  const { tabs, rating } = req.body;
  if (!Array.isArray(tabs) || tabs.length === 0) return res.status(400).json({ error: 'tabs array required' });
  if (rating === undefined) return res.status(400).json({ error: 'rating required' });
  try {
    const results = rateTabs(tabs, rating);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /rate — remove rating from a tab
router.delete('/', (req, res) => {
  const { tab } = req.body;
  if (!tab || !tab.url) return res.status(400).json({ error: 'tab with url required' });
  const existed = unrateTab(tab);
  res.json({ success: true, removed: existed });
});

// GET /rate/all — get all ratings
router.get('/all', (req, res) => {
  res.json({ success: true, data: getAllRatings() });
});

// GET /rate/top — get top-rated tabs
router.get('/top', (req, res) => {
  const min = parseInt(req.query.min, 10) || 4;
  res.json({ success: true, data: getTopRated(min) });
});

// POST /rate/summary — get rating summary for a list of tabs
router.post('/summary', (req, res) => {
  const { tabs } = req.body;
  if (!Array.isArray(tabs)) return res.status(400).json({ error: 'tabs array required' });
  res.json({ success: true, data: ratingSummary(tabs) });
});

module.exports = router;
