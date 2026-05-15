const express = require('express');
const router = express.Router();
const {
  annotateTab,
  getAnnotations,
  removeAnnotation,
  clearAnnotations,
  getAnnotationSummary
} = require('../tabAnnotator');

// POST /annotate — add annotation to a tab
router.post('/', (req, res) => {
  const { tab, text } = req.body;
  if (!tab || !tab.url) return res.status(400).json({ error: 'tab with url required' });
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const annotation = annotateTab(tab, text);
    res.json({ annotation, annotations: getAnnotations(tab) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /annotate — get annotations for a tab by url query param
router.get('/', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query param required' });
  const tab = { url };
  res.json({ annotations: getAnnotations(tab) });
});

// DELETE /annotate — remove annotation by index
router.delete('/', (req, res) => {
  const { tab, index } = req.body;
  if (!tab || !tab.url) return res.status(400).json({ error: 'tab with url required' });
  if (index === undefined || index === null) return res.status(400).json({ error: 'index required' });
  try {
    const removed = removeAnnotation(tab, Number(index));
    res.json({ removed, annotations: getAnnotations(tab) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /annotate/clear — clear all annotations for a tab
router.delete('/clear', (req, res) => {
  const { tab } = req.body;
  if (!tab || !tab.url) return res.status(400).json({ error: 'tab with url required' });
  const removed = clearAnnotations(tab);
  res.json({ cleared: removed.length });
});

// GET /annotate/summary — overall annotation stats
router.get('/summary', (_req, res) => {
  res.json(getAnnotationSummary());
});

module.exports = router;
