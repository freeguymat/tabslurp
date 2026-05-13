// routes/reminder.js — REST endpoints for tab reminders

const express = require('express');
const router = express.Router();
const {
  setReminder,
  removeReminder,
  hasReminder,
  getReminder,
  getAllReminders,
  getDueReminders,
  clearAllReminders,
  reminderSummary,
} = require('../tabReminder');

// GET /reminders — list all reminders
router.get('/', (req, res) => {
  res.json({ reminders: getAllReminders() });
});

// GET /reminders/due — list due reminders
router.get('/due', (req, res) => {
  res.json({ reminders: getDueReminders() });
});

// GET /reminders/summary
router.get('/summary', (req, res) => {
  res.json(reminderSummary());
});

// POST /reminders — set a reminder for a tab
router.post('/', (req, res) => {
  const { tab, remindAt, note } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  if (!remindAt) {
    return res.status(400).json({ error: 'remindAt is required' });
  }
  const date = new Date(remindAt);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: 'remindAt must be a valid ISO date string' });
  }
  try {
    const reminder = setReminder(tab, date, note || '');
    res.status(201).json({ reminder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /reminders — remove a reminder for a tab
router.delete('/', (req, res) => {
  const { tab } = req.body;
  if (!tab || !tab.url) {
    return res.status(400).json({ error: 'tab with url is required' });
  }
  const removed = removeReminder(tab);
  res.json({ removed });
});

// DELETE /reminders/all — clear all reminders
router.delete('/all', (req, res) => {
  clearAllReminders();
  res.json({ cleared: true });
});

module.exports = router;
