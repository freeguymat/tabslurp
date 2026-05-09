const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { prioritizeTabs, prioritySummary } = require('../tabPrioritizer');

// POST /api/prioritize
// Body: { tabs: [...], options: { boostDomains: [], boostPinned: true } }
router.post('/', (req, res) => {
  const { tabs, options = {} } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const prioritized = prioritizeTabs(tabs, options);
    const summary = prioritySummary(prioritized);
    return res.json({
      tabs: prioritized,
      summary,
      count: prioritized.length
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to prioritize tabs', detail: err.message });
  }
});

// POST /api/prioritize/summary
// Returns only the summary without full tab list
router.post('/summary', (req, res) => {
  const { tabs, options = {} } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const prioritized = prioritizeTabs(tabs, options);
    const summary = prioritySummary(prioritized);
    return res.json({ summary, count: prioritized.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to compute priority summary', detail: err.message });
  }
});

module.exports = router;
