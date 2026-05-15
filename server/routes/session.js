// routes/session.js — HTTP routes for tab session management

const express = require('express');
const router = express.Router();
const {
  saveSession,
  getSession,
  listSessions,
  deleteSession,
  restoreSession,
} = require('../tabSessionManager');

// GET /session — list all saved sessions
router.get('/', (req, res) => {
  const sessions = listSessions();
  res.json({ sessions });
});

// POST /session — save a new session
router.post('/', (req, res) => {
  const { name, tabs } = req.body;
  if (!name || !Array.isArray(tabs)) {
    return res.status(400).json({ error: 'name and tabs are required' });
  }
  try {
    const session = saveSession(name, tabs);
    res.status(201).json({ session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /session/:name — get a specific session
router.get('/:name', (req, res) => {
  const session = getSession(req.params.name);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ session });
});

// GET /session/:name/restore — restore (retrieve tabs from) a session
router.get('/:name/restore', (req, res) => {
  const result = restoreSession(req.params.name);
  if (!result) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(result);
});

// DELETE /session/:name — delete a session
router.delete('/:name', (req, res) => {
  const deleted = deleteSession(req.params.name);
  if (!deleted) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ success: true, deleted: req.params.name });
});

module.exports = router;
