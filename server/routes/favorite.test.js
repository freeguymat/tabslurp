const request = require('supertest');
const express = require('express');
const favoriteRouter = require('./favorite');
const { clearFavorites } = require('../tabFavoriter');

const app = express();
app.use(express.json());
app.use('/favorite', favoriteRouter);

beforeEach(() => clearFavorites());

const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://github.com', title: 'GitHub' };

test('POST /favorite favorites a tab', async () => {
  const res = await request(app).post('/favorite').send(tab1);
  expect(res.status).toBe(200);
  expect(res.body.favorited.url).toBe(tab1.url);
});

test('POST /favorite returns 400 with no url', async () => {
  const res = await request(app).post('/favorite').send({ title: 'No URL' });
  expect(res.status).toBe(400);
});

test('POST /favorite/bulk favorites multiple tabs', async () => {
  const res = await request(app).post('/favorite/bulk').send({ tabs: [tab1, tab2] });
  expect(res.status).toBe(200);
  expect(res.body.favorited).toHaveLength(2);
});

test('POST /favorite/bulk returns 400 with no tabs array', async () => {
  const res = await request(app).post('/favorite/bulk').send({});
  expect(res.status).toBe(400);
});

test('GET /favorite returns empty list initially', async () => {
  const res = await request(app).get('/favorite');
  expect(res.status).toBe(200);
  expect(res.body.favorites).toHaveLength(0);
});

test('GET /favorite returns favorited tabs', async () => {
  await request(app).post('/favorite').send(tab1);
  const res = await request(app).get('/favorite');
  expect(res.body.favorites).toHaveLength(1);
});

test('GET /favorite/check returns favorited true', async () => {
  await request(app).post('/favorite').send(tab1);
  const res = await request(app).get('/favorite/check').query({ url: tab1.url });
  expect(res.body.favorited).toBe(true);
});

test('GET /favorite/check returns 400 without url', async () => {
  const res = await request(app).get('/favorite/check');
  expect(res.status).toBe(400);
});

test('DELETE /favorite removes a tab', async () => {
  await request(app).post('/favorite').send(tab1);
  const res = await request(app).delete('/favorite').send(tab1);
  expect(res.body.removed).toBe(true);
});

test('DELETE /favorite/all clears all favorites', async () => {
  await request(app).post('/favorite/bulk').send({ tabs: [tab1, tab2] });
  await request(app).delete('/favorite/all');
  const res = await request(app).get('/favorite');
  expect(res.body.favorites).toHaveLength(0);
});

test('GET /favorite/summary returns correct data', async () => {
  await request(app).post('/favorite/bulk').send({ tabs: [tab1, tab2] });
  const res = await request(app).get('/favorite/summary');
  expect(res.body.total).toBe(2);
  expect(res.body.byDomain).toBeDefined();
});
