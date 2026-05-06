const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { searchTabs } = require('../tabSearcher');

// POST /search
// Body: { tabs: [...], query: string, field?: 'title'|'url'|'all', caseSensitive?: boolean }
router.post('/', (req, res) => {
  const { tabs, query, field = 'all', caseSensitive = false } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'query is required and must be a string' });
  }

  const validFields = ['title', 'url', 'all'];
  if (!validFields.includes(field)) {
    return res.status(400).json({
      error: `field must be one of: ${validFields.join(', ')}`
    });
  }

  const validation = validateTabsPayload({ tabs });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const results = searchTabs(tabs, { query, field, caseSensitive });

  return res.json({
    query,
    field,
    caseSensitive,
    total: results.length,
    tabs: results
  });
});

module.exports = router;
