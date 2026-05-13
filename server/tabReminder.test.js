const {
  setReminder,
  removeReminder,
  hasReminder,
  getReminder,
  getAllReminders,
  getDueReminders,
  clearAllReminders,
  reminderSummary,
} = require('./tabReminder');

const tab = { url: 'https://example.com', title: 'Example', windowId: 1 };
const future = new Date(Date.now() + 60_000);
const past = new Date(Date.now() - 60_000);

beforeEach(() => clearAllReminders());

test('setReminder stores a reminder', () => {
  const r = setReminder(tab, future, 'read later');
  expect(r.url).toBe(tab.url);
  expect(r.note).toBe('read later');
  expect(r.remindAt).toBe(future.toISOString());
});

test('setReminder throws on invalid tab', () => {
  expect(() => setReminder({}, future)).toThrow('Invalid tab');
});

test('setReminder throws on invalid date', () => {
  expect(() => setReminder(tab, 'not-a-date')).toThrow('valid Date');
});

test('hasReminder returns true after set', () => {
  setReminder(tab, future);
  expect(hasReminder(tab)).toBe(true);
});

test('hasReminder returns false before set', () => {
  expect(hasReminder(tab)).toBe(false);
});

test('getReminder returns correct reminder', () => {
  setReminder(tab, future, 'check this');
  const r = getReminder(tab);
  expect(r.note).toBe('check this');
});

test('removeReminder removes it', () => {
  setReminder(tab, future);
  removeReminder(tab);
  expect(hasReminder(tab)).toBe(false);
});

test('getDueReminders returns only past reminders', () => {
  setReminder(tab, past);
  setReminder({ url: 'https://other.com' }, future);
  const due = getDueReminders();
  expect(due).toHaveLength(1);
  expect(due[0].url).toBe(tab.url);
});

test('reminderSummary counts correctly', () => {
  setReminder(tab, past);
  setReminder({ url: 'https://other.com' }, future);
  const s = reminderSummary();
  expect(s.total).toBe(2);
  expect(s.due).toBe(1);
  expect(s.upcoming).toBe(1);
});

test('getAllReminders returns all', () => {
  setReminder(tab, future);
  expect(getAllReminders()).toHaveLength(1);
});
