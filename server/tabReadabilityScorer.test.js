const {
  scoreTitleReadability,
  scoreUrlReadability,
  getReadabilityLabel,
  scoreTab,
  scoreTabs,
  readabilitySummary
} = require('./tabReadabilityScorer');

describe('scoreTitleReadability', () => {
  test('returns 0 for missing title', () => {
    expect(scoreTitleReadability(null)).toBe(0);
    expect(scoreTitleReadability('')).toBe(0);
  });

  test('gives higher score to short readable titles', () => {
    const short = scoreTitleReadability('How to Bake Bread');
    const long = scoreTitleReadability('Supercalifragilistic Extraordinarily Complicated Terminology Reference');
    expect(short).toBeGreaterThan(long);
  });

  test('returns a number between 0 and 10', () => {
    const score = scoreTitleReadability('Some Normal Title Here');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(10);
  });
});

describe('scoreUrlReadability', () => {
  test('returns 0 for missing url', () => {
    expect(scoreUrlReadability(null)).toBe(0);
  });

  test('penalizes urls with query params', () => {
    const clean = scoreUrlReadability('https://example.com/blog/post');
    const messy = scoreUrlReadability('https://example.com/page?utm_source=x&ref=y&session=abc');
    expect(clean).toBeGreaterThan(messy);
  });

  test('rewards simple path segments', () => {
    const score = scoreUrlReadability('https://example.com/docs/guide');
    expect(score).toBeGreaterThan(5);
  });
});

describe('getReadabilityLabel', () => {
  test('returns easy for high scores', () => expect(getReadabilityLabel(9)).toBe('easy'));
  test('returns moderate for mid scores', () => expect(getReadabilityLabel(6)).toBe('moderate'));
  test('returns complex for low scores', () => expect(getReadabilityLabel(2)).toBe('complex'));
});

describe('scoreTab', () => {
  test('adds readability object to tab', () => {
    const tab = { title: 'Simple Guide', url: 'https://example.com/guide' };
    const result = scoreTab(tab);
    expect(result.readability).toBeDefined();
    expect(result.readability.score).toBeGreaterThanOrEqual(0);
    expect(result.readability.label).toMatch(/easy|moderate|complex/);
  });

  test('preserves original tab properties', () => {
    const tab = { title: 'Test', url: 'https://test.com', windowId: 1 };
    const result = scoreTab(tab);
    expect(result.windowId).toBe(1);
  });
});

describe('readabilitySummary', () => {
  test('returns correct totals', () => {
    const tabs = scoreTabs([
      { title: 'Easy Read', url: 'https://example.com/blog' },
      { title: 'x'.repeat(50), url: 'https://x.com?a=1&b=2&c=3&d=4&e=5' }
    ]);
    const summary = readabilitySummary(tabs);
    expect(summary.total).toBe(2);
    expect(summary.averageScore).toBeGreaterThanOrEqual(0);
    expect(summary.breakdown).toHaveProperty('easy');
  });

  test('handles empty array', () => {
    const summary = readabilitySummary([]);
    expect(summary.total).toBe(0);
    expect(summary.averageScore).toBe(0);
  });
});
