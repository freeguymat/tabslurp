const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { groupTabs, VALID_STRATEGIES } = require('../tabGrouper');

/**
 * POST /group
 * Body: { tabs: Tab[], strategy?: 'domain' | 'window' | 'protocol' }
 * Returns tabs grouped by the requested strategy.
 */
router.post('/', (req, res) => {
  const { tabs, strategy = 'domain' } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (!VALID_STRATEGIES.includes(strategy)) {
    return res.status(400).json({
      error: `Invalid strategy "${strategy}". Valid options: ${VALID_STRATEGIES.join(', ')}`,
    });
  }

  try {
    const grouped = groupTabs(tabs, strategy);

    const summary = Object.entries(grouped).map(([key, items]) => ({
      key,
      count: items.length,
      tabs: items,
    }));

    return res.json({
      strategy,
      totalTabs: tabs.length,
      groupCount: summary.length,
      groups: summary,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /group/strategies
 * Returns the list of supported grouping strategies.
 */
router.get('/strategies', (_req, res) => {
  res.json({ strategies: VALID_STRATEGIES });
});

module.exports = router;
