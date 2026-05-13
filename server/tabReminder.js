// tabReminder.js — schedule reminders for tabs

const reminders = new Map();

function getReminderKey(tab) {
  return `${tab.url}::${tab.windowId ?? 0}`;
}

function setReminder(tab, remindAt, note = '') {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  if (!(remindAt instanceof Date) || isNaN(remindAt.getTime())) {
    throw new Error('remindAt must be a valid Date');
  }
  const key = getReminderKey(tab);
  const reminder = {
    url: tab.url,
    title: tab.title || '',
    windowId: tab.windowId ?? 0,
    remindAt: remindAt.toISOString(),
    note,
    createdAt: new Date().toISOString(),
  };
  reminders.set(key, reminder);
  return reminder;
}

function removeReminder(tab) {
  const key = getReminderKey(tab);
  return reminders.delete(key);
}

function hasReminder(tab) {
  return reminders.has(getReminderKey(tab));
}

function getReminder(tab) {
  return reminders.get(getReminderKey(tab)) || null;
}

function getAllReminders() {
  return Array.from(reminders.values());
}

function getDueReminders(now = new Date()) {
  return getAllReminders().filter(r => new Date(r.remindAt) <= now);
}

function clearAllReminders() {
  reminders.clear();
}

function reminderSummary() {
  const all = getAllReminders();
  const due = getDueReminders();
  return {
    total: all.length,
    due: due.length,
    upcoming: all.length - due.length,
  };
}

module.exports = {
  getReminderKey,
  setReminder,
  removeReminder,
  hasReminder,
  getReminder,
  getAllReminders,
  getDueReminders,
  clearAllReminders,
  reminderSummary,
};
