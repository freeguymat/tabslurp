const request = require('supertest');
const express = require('express');
const versionRouter = require('./version');
const { clearSnapshots } = require('../tabVersioner');

const app = express();
app.use(express.json());
app.use('/version', versionRouter);

const tabs = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://news.ycombinator.com', title: 'HN' }
];

beforeEach(() => {
  clearSnapshots('mylist');
});

test('POST /version/:name creates snapshot', async () => {
  const res = await request(app).post('/version/mylist').send({ tabs });
  expect(res.status).toBe(200);
  expect(res.body.snapshot.version).toBe(1);
  expect(res.body.snapshot.tabCount).toBe(2);
});

test('POST /version/:name without tabs returns 400', async () => {
  const res = await request(app).post('/version/mylist').send({});
  expect(res.status).toBe(400);
});

test('GET /version/:name lists snapshots', async () => {
  await request(app).post('/version/mylist').send({ tabs });
  await request(app).post('/version/mylist').send({ tabs });
  const res = await request(app).get('/version/mylist');
  expect(res.status).toBe(200);
  expect(res.body.snapshots).toHaveLength(2);
});

test('GET /version/:name/latest returns latest snapshot', async () => {
  await request(app).post('/version/mylist').send({ tabs });
  await request(app).post('/version/mylist').send({ tabs: [tabs[0]] });
  const res = await request(app).get('/version/mylist/latest');
  expect(res.status).toBe(200);
  expect(res.body.snapshot.version).toBe(2);
});

test('GET /version/:name/latest returns 404 when empty', async () => {
  const res = await request(app).get('/version/mylist/latest');
  expect(res.status).toBe(404);
});

test('GET /version/:name/summary returns summary info', async () => {
  await request(app).post('/version/mylist').send({ tabs });
  const res = await request(app).get('/version/mylist/summary');
  expect(res.status).toBe(200);
  expect(res.body.totalVersions).toBe(1);
  expect(res.body.name).toBe('mylist');
});

test('GET /version/:name/:version returns specific snapshot', async () => {
  await request(app).post('/version/mylist').send({ tabs });
  const res = await request(app).get('/version/mylist/1');
  expect(res.status).toBe(200);
  expect(res.body.snapshot.version).toBe(1);
});

test('DELETE /version/:name/:version removes snapshot', async () => {
  await request(app).post('/version/mylist').send({ tabs });
  const del = await request(app).delete('/version/mylist/1');
  expect(del.status).toBe(200);
  const res = await request(app).get('/version/mylist');
  expect(res.body.snapshots).toHaveLength(0);
});

test('DELETE /version/:name clears all snapshots', async () => {
  await request(app).post('/version/mylist').send({ tabs });
  await request(app).post('/version/mylist').send({ tabs });
  await request(app).delete('/version/mylist');
  const res = await request(app).get('/version/mylist');
  expect(res.body.snapshots).toHaveLength(0);
});
