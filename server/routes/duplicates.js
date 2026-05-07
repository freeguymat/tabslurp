const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const {
  findExactDuplicates,
  findTitleDuplicates,
  groupDuplicates,
  getDuplicateSummary,
} = require('../tabDuplicateFinder');

// POST /duplicates/exact — find exact URL duplicates
router.post('/exact', (req, res) => {
  const { error, tabs } = validateTabsPayload(req.body);
  if (error) return res.status(400).json({ error });

  const duplicates = findExactDuplicates(tabs);
  res.json({ count: duplicates.length, duplicates });
});

// POST /duplicates/title — find tabs with matching titles
router.post('/title', (req, res) => {
  const { error, tabs } = validateTabsPayload(req.body);
  if (error) return res.status(400).json({ error });

  const duplicates = findTitleDuplicates(tabs);
  res.json({ count: duplicates.length, duplicates });
});

// POST /duplicates/groups — group all duplicate tabs together
router.post('/groups', (req, res) => {
  const { error, tabs } = validateTabsPayload(req.body);
  if (error) return res.status(400).json({ error });

  const groups = groupDuplicates(tabs);
  res.json({ groupCount: groups.length, groups });
});

// POST /duplicates/summary — full duplicate analysis
router.post('/summary', (req, res) => {
  const { error, tabs } = validateTabsPayload(req.body);
  if (error) return res.status(400).json({ error });

  const summary = getDuplicateSummary(tabs);
  res.json(summary);
});

module.exports = router;
