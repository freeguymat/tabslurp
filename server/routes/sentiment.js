const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { analyzeTabs, sentimentSummary } = require('../tabSentimentAnalyzer');

// POST /sentiment/analyze
// Body: { tabs: [...] }
// Returns each tab annotated with a sentiment score and label
router.post('/analyze', (req, res) => {
  const { tabs } = req.body;
  const error = validateTabsPayload(tabs);
  if (error) {
    return res.status(400).json({ error });
  }

  const annotated = analyzeTabs(tabs);
  res.json({ tabs: annotated });
});

// POST /sentiment/summary
// Body: { tabs: [...] }
// Returns aggregate sentiment counts and average score
router.post('/summary', (req, res) => {
  const { tabs } = req.body;
  const error = validateTabsPayload(tabs);
  if (error) {
    return res.status(400).json({ error });
  }

  const summary = sentimentSummary(tabs);
  res.json(summary);
});

module.exports = router;
