const request = require('supertest');
const express = require('express');
const highlightRouter = require('./highlight');

const app = express();
app.use(express.json());
app.use('/highlight', highlightRouter);

const tab1 = { id: 't1', title: 'GitHub', url: 'https://github.com' };
const tab2 = { id: 't2', title: 'MDN', url: 'https://developer.mozilla.org' };

beforeEach(async () => {
  await request(app).delete('/highlight');
});

test('GET /highlight/colors returns list of colors', async () => {
  const res = await request(app).get('/highlight/colors');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.colors)).toBe(true);
  expect(res.body.colors).toContain('red');
});

test('POST /highlight highlights a tab', async () => {
  const res = await request(app).post('/highlight').send({ tab: tab1, color: 'blue' });
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.highlight.color).toBe('blue');
});

test('POST /highlight returns 400 for missing fields', async () => {
  const res = await request(app).post('/highlight').send({ tab: tab1 });
  expect(res.status).toBe(400);
});

test('POST /highlight returns 400 for invalid color', async () => {
  const res = await request(app).post('/highlight').send({ tab: tab1, color: 'neon' });
  expect(res.status).toBe(400);
  expect(res.body.error).toMatch(/Invalid color/);
});

test('GET /highlight/status/:tabId shows highlighted tab', async () => {
  await request(app).post('/highlight').send({ tab: tab1, color: 'green' });
  const res = await request(app).get('/highlight/status/t1');
  expect(res.body.highlighted).toBe(true);
  expect(res.body.color).toBe('green');
});

test('GET /highlight/status/:tabId shows unhighlighted tab', async () => {
  const res = await request(app).get('/highlight/status/unknown');
  expect(res.body.highlighted).toBe(false);
  expect(res.body.color).toBeNull();
});

test('DELETE /highlight/:tabId removes highlight', async () => {
  await request(app).post('/highlight').send({ tab: tab1, color: 'red' });
  const res = await request(app).delete('/highlight/t1');
  expect(res.body.removed).toBe(true);
  const status = await request(app).get('/highlight/status/t1');
  expect(status.body.highlighted).toBe(false);
});

test('POST /highlight/bulk highlights multiple tabs', async () => {
  const res = await request(app).post('/highlight/bulk').send({ tabs: [tab1, tab2], color: 'yellow' });
  expect(res.body.highlighted).toBe(2);
});

test('POST /highlight/query returns highlighted tabs', async () => {
  await request(app).post('/highlight').send({ tab: tab1, color: 'pink' });
  const res = await request(app).post('/highlight/query').send({ tabs: [tab1, tab2] });
  expect(res.body.count).toBe(1);
  expect(res.body.tabs[0].id).toBe('t1');
});

test('POST /highlight/query filters by color', async () => {
  await request(app).post('/highlight').send({ tab: tab1, color: 'pink' });
  await request(app).post('/highlight').send({ tab: tab2, color: 'gray' });
  const res = await request(app).post('/highlight/query').send({ tabs: [tab1, tab2], color: 'gray' });
  expect(res.body.count).toBe(1);
  expect(res.body.tabs[0].id).toBe('t2');
});

test('DELETE /highlight clears all highlights', async () => {
  await request(app).post('/highlight/bulk').send({ tabs: [tab1, tab2], color: 'orange' });
  const res = await request(app).delete('/highlight');
  expect(res.body.success).toBe(true);
  const q = await request(app).post('/highlight/query').send({ tabs: [tab1, tab2] });
  expect(q.body.count).toBe(0);
});
