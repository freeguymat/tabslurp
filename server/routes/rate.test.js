const request = require('supertest');
const express = require('express');
const rateRouter = require('./rate');
const { clearRatings } = require('../tabRater');

const app = express();
app.use(express.json());
app.use('/rate', rateRouter);

beforeEach(() => clearRatings());

const tab1 = { url: 'https://github.com', title: 'GitHub' };
const tab2 = { url: 'https://example.com', title: 'Example' };

describe('POST /rate', () => {
  it('rates a tab', async () => {
    const res = await request(app).post('/rate').send({ tab: tab1, rating: 5 });
    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(5);
  });
  it('rejects missing tab', async () => {
    const res = await request(app).post('/rate').send({ rating: 3 });
    expect(res.status).toBe(400);
  });
  it('rejects invalid rating', async () => {
    const res = await request(app).post('/rate').send({ tab: tab1, rating: 10 });
    expect(res.status).toBe(400);
  });
});

describe('POST /rate/bulk', () => {
  it('rates multiple tabs', async () => {
    const res = await request(app).post('/rate/bulk').send({ tabs: [tab1, tab2], rating: 3 });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });
  it('rejects empty tabs', async () => {
    const res = await request(app).post('/rate/bulk').send({ tabs: [], rating: 3 });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /rate', () => {
  it('removes a rating', async () => {
    await request(app).post('/rate').send({ tab: tab1, rating: 4 });
    const res = await request(app).delete('/rate').send({ tab: tab1 });
    expect(res.body.removed).toBe(true);
  });
  it('returns false if not rated', async () => {
    const res = await request(app).delete('/rate').send({ tab: tab2 });
    expect(res.body.removed).toBe(false);
  });
});

describe('GET /rate/top', () => {
  it('returns top rated tabs', async () => {
    await request(app).post('/rate').send({ tab: tab1, rating: 5 });
    await request(app).post('/rate').send({ tab: tab2, rating: 2 });
    const res = await request(app).get('/rate/top?min=4');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].rating).toBe(5);
  });
});

describe('POST /rate/summary', () => {
  it('returns summary stats', async () => {
    await request(app).post('/rate').send({ tab: tab1, rating: 4 });
    const res = await request(app).post('/rate/summary').send({ tabs: [tab1, tab2] });
    expect(res.body.data.rated).toBe(1);
    expect(res.body.data.unrated).toBe(1);
    expect(res.body.data.averageRating).toBe(4);
  });
});
