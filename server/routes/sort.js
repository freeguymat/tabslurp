const express = require('express');
const router  = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { sortTabs }            = require('../tabSorter');

/**
 * POST /sort
 * Body: { tabs: Tab[], strategy?: 'title' | 'url' | 'domain' }
 * Returns the tabs array sorted by the requested strategy.
 */
router.post('/', (req, res) => {
  const { tabs, strategy = 'title' } = req.body;

  const validation = validateTabsPayload({ tabs });
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const allowedStrategies = ['title', 'url', 'domain'];
  if (!allowedStrategies.includes(strategy)) {
    return res.status(400).json({
      error: `Invalid strategy "${strategy}". Must be one of: ${allowedStrategies.join(', ')}.`
    });
  }

  try {
    const sorted = sortTabs(tabs, strategy);
    return res.json({ tabs: sorted, strategy, count: sorted.length });
  } catch (err) {
    console.error('Sort error:', err);
    return res.status(500).json({ error: 'Failed to sort tabs.' });
  }
});

module.exports = router;
