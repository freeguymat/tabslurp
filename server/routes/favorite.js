// routes/favorite.js — API routes for tab favoriting

const express = require('express');
const router = express.Router();
const {
  favoriteTab,
  unfavoriteTab,
  isFavorite,
  favoriteTabs,
  getFavoriteTabs,
  clearFavorites,
  getFavoriteSummary,
} = require('../tabFavoriter');

// POST /favorite — favorite a single tab
router.post('/', (req, res) => {
  const tab = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'Tab with url is required' });
  }
  try {
    const result = favoriteTab(tab);
    res.json({ favorited: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /favorite/bulk — favorite multiple tabs
router.post('/bulk', (req, res) => {
  const { tabs } = req.body;
  if (!Array.isArray(tabs)) {
    return res.status(400).json({ error: 'tabs array is required' });
  }
  const results = favoriteTabs(tabs);
  res.json({ favorited: results });
});

// DELETE /favorite — unfavorite a tab
router.delete('/', (req, res) => {
  const tab = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'Tab with url is required' });
  }
  const removed = unfavoriteTab(tab);
  res.json({ removed });
});

// GET /favorite — list all favorited tabs
router.get('/', (req, res) => {
  res.json({ favorites: getFavoriteTabs() });
});

// GET /favorite/check — check if a tab is favorited
router.get('/check', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query param required' });
  res.json({ favorited: isFavorite({ url }) });
});

// GET /favorite/summary — get favorites summary
router.get('/summary', (req, res) => {
  res.json(getFavoriteSummary());
});

// DELETE /favorite/all — clear all favorites
router.delete('/all', (req, res) => {
  clearFavorites();
  res.json({ cleared: true });
});

module.exports = router;
