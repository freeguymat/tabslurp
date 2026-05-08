const {
  estimateReadingTime,
  categorizeDomain,
  annotateTab,
  annotateTabs,
  readingTimeSummary,
} = require('./tabReadingTime');

describe('estimateReadingTime', () => {
  it('returns at least 1 minute for short text', () => {
    expect(estimateReadingTime('Hi', 'http://a.com')).toBe(1);
  });

  it('returns more minutes for longer text', () => {
    const longTitle = 'word '.repeat(400).trim();
    expect(estimateReadingTime(longTitle, '')).toBeGreaterThan(1);
  });

  it('handles empty strings', () => {
    expect(estimateReadingTime('', '')).toBe(1);
  });
});

describe('categorizeDomain', () => {
  it('identifies documentation sites', () => {
    expect(categorizeDomain('https://docs.python.org/3/')).toBe('documentation');
  });

  it('identifies code hosting', () => {
    expect(categorizeDomain('https://github.com/user/repo')).toBe('code');
  });

  it('identifies video sites', () => {
    expect(categorizeDomain('https://www.youtube.com/watch?v=abc')).toBe('video');
  });

  it('identifies discussion sites', () => {
    expect(categorizeDomain('https://news.ycombinator.com')).toBe('discussion');
  });

  it('returns general for unknown domains', () => {
    expect(categorizeDomain('https://example.com')).toBe('general');
  });

  it('returns unknown for invalid url', () => {
    expect(categorizeDomain('not-a-url')).toBe('unknown');
  });
});

describe('annotateTab', () => {
  it('adds readingTime and category to a tab', () => {
    const tab = { title: 'Hello World', url: 'https://github.com/foo/bar' };
    const result = annotateTab(tab);
    expect(result).toHaveProperty('readingTime');
    expect(result).toHaveProperty('category', 'code');
    expect(result.title).toBe('Hello World');
  });
});

describe('annotateTabs', () => {
  it('returns empty array for non-array input', () => {
    expect(annotateTabs(null)).toEqual([]);
  });

  it('annotates all tabs', () => {
    const tabs = [
      { title: 'A', url: 'https://youtube.com/watch?v=1' },
      { title: 'B', url: 'https://example.com' },
    ];
    const result = annotateTabs(tabs);
    expect(result).toHaveLength(2);
    expect(result[0].category).toBe('video');
    expect(result[1].category).toBe('general');
  });
});

describe('readingTimeSummary', () => {
  it('computes total reading time and category counts', () => {
    const tabs = [
      { title: 'A', url: 'https://github.com/x' },
      { title: 'B', url: 'https://github.com/y' },
      { title: 'C', url: 'https://example.com' },
    ];
    const summary = readingTimeSummary(tabs);
    expect(summary.totalTabs).toBe(3);
    expect(summary.totalReadingTimeMinutes).toBeGreaterThan(0);
    expect(summary.byCategory.code).toBe(2);
    expect(summary.byCategory.general).toBe(1);
  });
});
