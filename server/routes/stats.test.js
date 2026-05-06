const request = require('supertest');
const express = require('express');
const statsRouter = require('./stats');

const app = express();
app.use(express.json());
app.use('/api/stats', statsRouter);

const sampleTabs = [
  { title: 'GitHub', url: 'https://github.com/foo' },
  { title: 'GitHub Issues', url: 'https://github.com/foo/issues' },
  { title: 'MDN', url: 'https://developer.mozilla.org/en-US/' },
  { title: 'Google', url: 'https://google.com' },
];

describe('POST /api/stats', () => {
  it('returns stats for valid tabs', async () => {
    const res = await request(app)
      .post('/api/stats')
      .send({ tabs: sampleTabs });

    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.total).toBe(4);
    expect(res.body.stats.uniqueDomains).toBe(3);
    expect(res.body.stats.byProtocol.https).toBe(4);
    expect(Array.isArray(res.body.stats.topDomains)).toBe(true);
    expect(res.body.stats.topDomains[0].domain).toBe('github.com');
  });

  it('returns 400 for missing tabs', async () => {
    const res = await request(app)
      .post('/api/stats')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for non-array tabs', async () => {
    const res = await request(app)
      .post('/api/stats')
      .send({ tabs: 'not-an-array' });

    expect(res.status).toBe(400);
  });

  it('handles empty tabs array', async () => {
    const res = await request(app)
      .post('/api/stats')
      .send({ tabs: [] });

    expect(res.status).toBe(200);
    expect(res.body.stats.total).toBe(0);
  });
});
