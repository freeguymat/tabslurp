const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { scoreTabs, readabilitySummary } = require('../tabReadabilityScorer');

// POST /readability/score
// Body: { tabs: [...] }
// Returns tabs annotated with readability scores
router.post('/score', (req, res) => {
  const { tabs } = req.body;
  const error = validateTabsPayload(tabs);
  if (error) return res.status(400).json({ error });

  const scored = scoreTabs(tabs);
  res.json({ tabs: scored });
});

// POST /readability/summary
// Body: { tabs: [...] }
// Returns a summary of readability across all tabs
router.post('/summary', (req, res) => {
  const { tabs } = req.body;
  const error = validateTabsPayload(tabs);
  if (error) return res.status(400).json({ error });

  const scored = scoreTabs(tabs);
  const summary = readabilitySummary(scored);
  res.json({ summary });
});

// POST /readability/filter
// Body: { tabs: [...], label: 'easy' | 'moderate' | 'complex' }
// Returns only tabs matching the given readability label
router.post('/filter', (req, res) => {
  const { tabs, label } = req.body;
  const error = validateTabsPayload(tabs);
  if (error) return res.status(400).json({ error });

  const validLabels = ['easy', 'moderate', 'complex'];
  if (!label || !validLabels.includes(label)) {
    return res.status(400).json({ error: `label must be one of: ${validLabels.join(', ')}` });
  }

  const scored = scoreTabs(tabs);
  const filtered = scored.filter(tab => tab.readability.label === label);
  res.json({ tabs: filtered, total: filtered.length });
});

module.exports = router;
