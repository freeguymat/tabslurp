const request = require('supertest');
const express = require('express');
const filterRouter = require('./filter');

const app = express();
app.use(express.json());
app.use('/filter', filterRouter);

const sampleTabs = [
  { title: 'GitHub Home', url: 'https://github.com/explore' },
  { title: 'Google Search', url: 'https://www.google.com/search?q=test' },
  { title: 'Local Dev', url: 'http://localhost:3000/app' },
];

describe('POST /filter', () => {
  it('returns filtered tabs by domain', async () => {
    const res = await request(app)
      .post('/filter')
      .send({ tabs: sampleTabs, filters: { domain: 'github.com' } });
    expect(res.status).toBe(200);
    expect(res.body.filtered).toBe(1);
    expect(res.body.tabs[0].title).toBe('GitHub Home');
  });

  it('returns filtered tabs by keyword', async () => {
    const res = await request(app)
      .post('/filter')
      .send({ tabs: sampleTabs, filters: { keyword: 'search' } });
    expect(res.status).toBe(200);
    expect(res.body.filtered).toBe(1);
  });

  it('returns all tabs when filters is empty', async () => {
    const res = await request(app)
      .post('/filter')
      .send({ tabs: sampleTabs, filters: {} });
    expect(res.status).toBe(200);
    expect(res.body.filtered).toBe(3);
    expect(res.body.original).toBe(3);
  });

  it('returns 400 for invalid tabs payload', async () => {
    const res = await request(app)
      .post('/filter')
      .send({ tabs: 'notanarray' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for invalid filters type', async () => {
    const res = await request(app)
      .post('/filter')
      .send({ tabs: sampleTabs, filters: 'bad' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when protocols is not an array', async () => {
    const res = await request(app)
      .post('/filter')
      .send({ tabs: sampleTabs, filters: { protocols: 'https' } });
    expect(res.status).toBe(400);
  });
});
