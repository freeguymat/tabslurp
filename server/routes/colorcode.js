const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const {
  colorCodeTabs,
  groupByColor,
  colorSummary,
} = require('../tabColorCoder');

// POST /colorcode — annotate tabs with colors
router.post('/', (req, res) => {
  const { tabs, strategy = 'domain', palette } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const coded = colorCodeTabs(tabs, strategy, palette || undefined);
  return res.json({ tabs: coded, count: coded.length });
});

// POST /colorcode/group — group tabs by color
router.post('/group', (req, res) => {
  const { tabs, strategy = 'domain', palette } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  // Apply strategy via colorCodeTabs first so groupByColor sees correct colors
  const coded = colorCodeTabs(tabs, strategy, palette || undefined);
  const groups = groupByColor(coded);
  return res.json({ groups });
});

// POST /colorcode/summary — get color distribution summary
router.post('/summary', (req, res) => {
  const { tabs, strategy = 'domain', palette } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const coded = colorCodeTabs(tabs, strategy, palette || undefined);
  const summary = colorSummary(coded);
  return res.json({ summary });
});

module.exports = router;
