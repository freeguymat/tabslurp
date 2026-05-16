// routes/share.js — POST /api/share
const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { shareTab, buildShareBundle } = require('../tabSharer');

// POST /api/share — share a bundle of tabs
router.post('/', (req, res) => {
  const { tabs, format = 'markdown', bundle = false } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const validFormats = ['markdown', 'text', 'json'];
  if (!validFormats.includes(format)) {
    return res.status(400).json({
      error: `Invalid format. Must be one of: ${validFormats.join(', ')}`
    });
  }

  try {
    if (bundle) {
      const result = buildShareBundle(tabs, format);
      return res.json(result);
    }

    const results = tabs.map(tab => {
      try {
        return { url: tab.url, ...shareTab(tab, format) };
      } catch (err) {
        return { url: tab.url, error: err.message };
      }
    });

    return res.json({ format, count: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/share/single — share a single tab
router.post('/single', (req, res) => {
  const { tab, format = 'markdown' } = req.body;

  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }

  try {
    const result = shareTab(tab, format);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
