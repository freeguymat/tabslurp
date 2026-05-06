const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { computeStats } = require('../tabStats');

/**
 * POST /api/stats
 * Body: { tabs: Tab[] }
 * Returns statistics about the provided tabs.
 */
router.post('/', (req, res) => {
  const { tabs } = req.body;

  const validation = validateTabsPayload({ tabs });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const stats = computeStats(tabs);
    return res.json({ stats });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to compute stats', details: err.message });
  }
});

module.exports = router;
