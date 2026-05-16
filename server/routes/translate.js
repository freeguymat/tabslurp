const express = require('express');
const router = express.Router();
const {
  setTranslation,
  getTranslation,
  removeTranslation,
  applyTranslations,
  getTranslationSummary,
} = require('../tabTranslator');

// POST /translate/set — set a translation for a single tab
router.post('/set', (req, res) => {
  const { tab, translatedTitle } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  if (!translatedTitle || typeof translatedTitle !== 'string') {
    return res.status(400).json({ error: 'translatedTitle is required' });
  }
  try {
    const result = setTranslation(tab, translatedTitle);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// POST /translate/get — get translation for a single tab
router.post('/get', (req, res) => {
  const { tab } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  const translatedTitle = getTranslation(tab);
  return res.json({ translatedTitle });
});

// POST /translate/remove — remove translation for a tab
router.post('/remove', (req, res) => {
  const { tab } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  const removed = removeTranslation(tab);
  return res.json({ removed });
});

// POST /translate/apply — apply translations to a list of tabs
router.post('/apply', (req, res) => {
  const { tabs } = req.body;
  if (!Array.isArray(tabs)) {
    return res.status(400).json({ error: 'tabs must be an array' });
  }
  const result = applyTranslations(tabs);
  const summary = getTranslationSummary(tabs);
  return res.json({ tabs: result, summary });
});

module.exports = router;
