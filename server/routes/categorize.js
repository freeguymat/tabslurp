const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { categorizeTabs, groupByCategory, categorizeSummary } = require('../tabCategorizer');

// POST /categorize — annotate each tab with a category
router.post('/', (req, res) => {
  const { tabs } = req.body;
  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const categorized = categorizeTabs(tabs);
  res.json({ tabs: categorized, count: categorized.length });
});

// POST /categorize/group — group tabs by category
router.post('/group', (req, res) => {
  const { tabs } = req.body;
  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const groups = groupByCategory(tabs);
  const totalCategories = Object.keys(groups).length;
  res.json({ groups, totalCategories });
});

// POST /categorize/summary — get category counts
router.post('/summary', (req, res) => {
  const { tabs } = req.body;
  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const summary = categorizeSummary(tabs);
  res.json({ summary, total: tabs.length });
});

module.exports = router;
