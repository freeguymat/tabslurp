const express = require('express');
const router = express.Router();
const {
  createSnapshot,
  getSnapshots,
  getSnapshot,
  getLatestSnapshot,
  deleteSnapshot,
  clearSnapshots,
  versionSummary
} = require('../tabVersioner');

// POST /version/:name — create a new snapshot
router.post('/:name', (req, res) => {
  const { name } = req.params;
  const { tabs } = req.body;
  if (!Array.isArray(tabs)) {
    return res.status(400).json({ error: 'tabs array required' });
  }
  try {
    const snapshot = createSnapshot(name, tabs);
    res.json({ snapshot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /version/:name — list all snapshots
router.get('/:name', (req, res) => {
  const snapshots = getSnapshots(req.params.name);
  res.json({ snapshots });
});

// GET /version/:name/latest — get latest snapshot
router.get('/:name/latest', (req, res) => {
  const snap = getLatestSnapshot(req.params.name);
  if (!snap) return res.status(404).json({ error: 'No snapshots found' });
  res.json({ snapshot: snap });
});

// GET /version/:name/summary — get version summary
router.get('/:name/summary', (req, res) => {
  res.json(versionSummary(req.params.name));
});

// GET /version/:name/:version — get specific version
router.get('/:name/:version', (req, res) => {
  const version = parseInt(req.params.version, 10);
  const snap = getSnapshot(req.params.name, version);
  if (!snap) return res.status(404).json({ error: 'Snapshot not found' });
  res.json({ snapshot: snap });
});

// DELETE /version/:name/:version — delete a specific version
router.delete('/:name/:version', (req, res) => {
  const version = parseInt(req.params.version, 10);
  const removed = deleteSnapshot(req.params.name, version);
  if (!removed) return res.status(404).json({ error: 'Snapshot not found' });
  res.json({ success: true });
});

// DELETE /version/:name — clear all snapshots for a name
router.delete('/:name', (req, res) => {
  clearSnapshots(req.params.name);
  res.json({ success: true });
});

module.exports = router;
