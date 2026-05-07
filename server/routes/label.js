const express = require('express');
const router = express.Router();
const { addLabel, removeLabel, getLabelsForTab, labelTabs, filterByLabel, getAllLabels } = require('../tabLabeler');

// POST /label/add — add a label to a single tab
router.post('/add', (req, res) => {
  const { tab, label } = req.body;
  if (!tab || !label) return res.status(400).json({ error: 'tab and label are required' });
  try {
    const labels = addLabel(tab, label);
    res.json({ url: tab.url, labels });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /label/remove — remove a label from a single tab
router.post('/remove', (req, res) => {
  const { tab, label } = req.body;
  if (!tab || !label) return res.status(400).json({ error: 'tab and label are required' });
  try {
    const labels = removeLabel(tab, label);
    res.json({ url: tab.url, labels });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /label/get — get labels for a tab
router.post('/get', (req, res) => {
  const { tab } = req.body;
  if (!tab) return res.status(400).json({ error: 'tab is required' });
  try {
    const labels = getLabelsForTab(tab);
    res.json({ url: tab.url, labels });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /label/bulk — apply a label to multiple tabs
router.post('/bulk', (req, res) => {
  const { tabs, label } = req.body;
  if (!Array.isArray(tabs) || !label) return res.status(400).json({ error: 'tabs array and label are required' });
  try {
    const result = labelTabs(tabs, label);
    res.json({ labeled: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /label/filter — filter tabs by label
router.post('/filter', (req, res) => {
  const { tabs, label } = req.body;
  if (!Array.isArray(tabs) || !label) return res.status(400).json({ error: 'tabs array and label are required' });
  try {
    const result = filterByLabel(tabs, label);
    res.json({ tabs: result, count: result.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /label/all — list all known labels
router.get('/all', (req, res) => {
  const all = getAllLabels();
  res.json({ labels: all });
});

module.exports = router;
