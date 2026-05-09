const request = require('supertest');
const express = require('express');
const prioritizeRouter = require('./prioritize');

const app = express();
app.use(express.json());
app.use('/api/prioritize', prioritizeRouter);

const sampleTabs = [
  { url: 'https://github.com/user/repo', title: 'My Project', pinned: false },
  { url: 'http://example.com', title: 'Example Site', pinned: false },
  { url: 'https://docs.google.com/doc', title: 'Important Doc', pinned: true }
];

describe('POST /api/prioritize', () => {
  it('returns prioritized tabs with scores and levels', async () => {
    const res = await request(app)
      .post('/api/prioritize')
      .send({ tabs: sampleTabs });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tabs');
    expect(res.body).toHaveProperty('summary');
    expect(res.body.count).toBe(sampleTabs.length);
    expect(res.body.tabs[0]).toHaveProperty('priorityScore');
    expect(res.body.tabs[0]).toHaveProperty('priorityLevel');
  });

  it('returns tabs sorted by score descending', async () => {
    const res = await request(app)
      .post('/api/prioritize')
      .send({ tabs: sampleTabs });
    const tabs = res.body.tabs;
    for (let i = 0; i < tabs.length - 1; i++) {
      expect(tabs[i].priorityScore).toBeGreaterThanOrEqual(tabs[i + 1].priorityScore);
    }
  });

  it('respects boostDomains option', async () => {
    const res = await request(app)
      .post('/api/prioritize')
      .send({ tabs: sampleTabs, options: { boostDomains: ['github.com'] } });
    expect(res.status).toBe(200);
    const top = res.body.tabs[0];
    expect(top.url).toContain('github.com');
  });

  it('returns 400 for invalid tabs payload', async () => {
    const res = await request(app)
      .post('/api/prioritize')
      .send({ tabs: 'not-an-array' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/prioritize/summary', () => {
  it('returns summary counts without full tab list', async () => {
    const res = await request(app)
      .post('/api/prioritize/summary')
      .send({ tabs: sampleTabs });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('summary');
    expect(res.body.summary).toHaveProperty('high');
    expect(res.body.summary).toHaveProperty('medium');
    expect(res.body.summary).toHaveProperty('low');
    expect(res.body).not.toHaveProperty('tabs');
  });

  it('returns 400 for missing tabs', async () => {
    const res = await request(app)
      .post('/api/prioritize/summary')
      .send({});
    expect(res.status).toBe(400);
  });
});
