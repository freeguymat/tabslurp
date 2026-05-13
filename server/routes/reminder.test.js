const request = require('supertest');
const express = require('express');
const reminderRouter = require('./reminder');
const { clearAllReminders } = require('../tabReminder');

const app = express();
app.use(express.json());
app.use('/reminders', reminderRouter);

const tab = { url: 'https://example.com', title: 'Example', windowId: 1 };
const future = new Date(Date.now() + 60_000).toISOString();
const past = new Date(Date.now() - 60_000).toISOString();

beforeEach(() => clearAllReminders());

test('GET /reminders returns empty list', async () => {
  const res = await request(app).get('/reminders');
  expect(res.status).toBe(200);
  expect(res.body.reminders).toEqual([]);
});

test('POST /reminders creates a reminder', async () => {
  const res = await request(app)
    .post('/reminders')
    .send({ tab, remindAt: future, note: 'check this' });
  expect(res.status).toBe(201);
  expect(res.body.reminder.url).toBe(tab.url);
  expect(res.body.reminder.note).toBe('check this');
});

test('POST /reminders 400 on missing tab', async () => {
  const res = await request(app).post('/reminders').send({ remindAt: future });
  expect(res.status).toBe(400);
});

test('POST /reminders 400 on invalid date', async () => {
  const res = await request(app)
    .post('/reminders')
    .send({ tab, remindAt: 'not-a-date' });
  expect(res.status).toBe(400);
});

test('GET /reminders/due returns past reminders', async () => {
  await request(app).post('/reminders').send({ tab, remindAt: past });
  const res = await request(app).get('/reminders/due');
  expect(res.status).toBe(200);
  expect(res.body.reminders).toHaveLength(1);
});

test('GET /reminders/summary returns counts', async () => {
  await request(app).post('/reminders').send({ tab, remindAt: past });
  const res = await request(app).get('/reminders/summary');
  expect(res.status).toBe(200);
  expect(res.body.total).toBe(1);
  expect(res.body.due).toBe(1);
});

test('DELETE /reminders removes a reminder', async () => {
  await request(app).post('/reminders').send({ tab, remindAt: future });
  const res = await request(app).delete('/reminders').send({ tab });
  expect(res.status).toBe(200);
  expect(res.body.removed).toBe(true);
});

test('DELETE /reminders/all clears everything', async () => {
  await request(app).post('/reminders').send({ tab, remindAt: future });
  await request(app).delete('/reminders/all');
  const res = await request(app).get('/reminders');
  expect(res.body.reminders).toHaveLength(0);
});
