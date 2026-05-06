const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { applyFilters } = require('../tabFilter');

/**
 * POST /filter
 * Body: { tabs: [...], filters: { domain?, keyword?, protocols? } }
 * Returns filtered tabs
 */
router.post('/', (req, res) => {
  const { tabs, filters } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (filters !== undefined && typeof filters !== 'object') {
    return res.status(400).json({ error: 'filters must be an object' });
  }

  if (filters?.protocols !== undefined && !Array.isArray(filters.protocols)) {
    return res.status(400).json({ error: 'filters.protocols must be an array' });
  }

  const filtered = applyFilters(tabs, filters || {});

  res.json({
    original: tabs.length,
    filtered: filtered.length,
    tabs: filtered,
  });
});

module.exports = router;
