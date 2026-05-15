const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { compareTabs } = require('../tabComparator');

// POST /compare
// Body: { tabsA: [...], tabsB: [...] }
router.post('/', (req, res) => {
  const { tabsA, tabsB } = req.body;

  if (!Array.isArray(tabsA) || !Array.isArray(tabsB)) {
    return res.status(400).json({ error: 'tabsA and tabsB must both be arrays' });
  }

  const validationA = validateTabsPayload(tabsA);
  if (!validationA.valid) {
    return res.status(400).json({ error: 'Invalid tabsA', details: validationA.errors });
  }

  const validationB = validateTabsPayload(tabsB);
  if (!validationB.valid) {
    return res.status(400).json({ error: 'Invalid tabsB', details: validationB.errors });
  }

  const result = compareTabs(tabsA, tabsB);
  return res.json(result);
});

module.exports = router;
