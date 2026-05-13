const request = require('supertest');
const express = require('express');
const colorcodeRouter = require('./colorcode');

const app = express();
app.use(express.json());
app.use('/colorcode', colorcodeRouter);

const sampleTabs = [
  { id: 1, title: 'GitHub', url: 'https://github.com/user/repo' },
  { id: 2, title: 'Google', url: 'https://google.com' },
  { id: 3, title: 'Local', url: 'file:///home/user/doc.html' },
];

describe('POST /colorcode', () => {
  test('returns tabs with color field', async () => {
    const res = await request(app).post('/colorcode').send({ tabs: sampleTabs });
    expect(res.status).toBe(200);
    expect(res.body.tabs).toHaveLength(sampleTabs.length);
    res.body.tabs.forEach(t => expect(t).toHaveProperty('color'));
  });

  test('uses protocol strategy', async () => {
    const res = await request(app)
      .post('/colorcode')
      .send({ tabs: sampleTabs, strategy: 'protocol' });
    expect(res.status).toBe(200);
    const https = res.body.tabs.find(t => t.url.startsWith('https'));
    expect(https.color).toBe('green');
  });

  test('returns 400 for invalid payload', async () => {
    const res = await request(app).post('/colorcode').send({ tabs: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns count equal to number of tabs', async () => {
    const res = await request(app).post('/colorcode').send({ tabs: sampleTabs });
    expect(res.body.count).toBe(sampleTabs.length);
  });
});

describe('POST /colorcode/group', () => {
  test('returns grouped object', async () => {
    const res = await request(app).post('/colorcode/group').send({ tabs: sampleTabs });
    expect(res.status).toBe(200);
    expect(typeof res.body.groups).toBe('object');
    const total = Object.values(res.body.groups).flat().length;
    expect(total).toBe(sampleTabs.length);
  });

  test('returns 400 for missing tabs', async () => {
    const res = await request(app).post('/colorcode/group').send({});
    expect(res.status).toBe(400);
  });
});

describe('POST /colorcode/summary', () => {
  test('returns summary array with color and count', async () => {
    const res = await request(app).post('/colorcode/summary').send({ tabs: sampleTabs });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.summary)).toBe(true);
    res.body.summary.forEach(entry => {
      expect(entry).toHaveProperty('color');
      expect(entry).toHaveProperty('count');
      expect(entry.count).toBeGreaterThan(0);
    });
  });

  test('returns 400 for invalid payload', async () => {
    const res = await request(app).post('/colorcode/summary').send({ tabs: null });
    expect(res.status).toBe(400);
  });
});
