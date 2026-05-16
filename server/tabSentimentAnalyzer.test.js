const {
  scoreTitle,
  getSentimentLabel,
  analyzeTab,
  analyzeTabs,
  sentimentSummary
} = require('./tabSentimentAnalyzer');

describe('scoreTitle', () => {
  test('returns positive score for positive words', () => {
    expect(scoreTitle('Best JavaScript Tutorial')).toBeGreaterThan(0);
  });

  test('returns negative score for negative words', () => {
    expect(scoreTitle('Bug Fix: Crash on startup')).toBeLessThan(0);
  });

  test('returns 0 for neutral title', () => {
    expect(scoreTitle('My Tab')).toBe(0);
  });

  test('handles empty string', () => {
    expect(scoreTitle('')).toBe(0);
  });

  test('handles null', () => {
    expect(scoreTitle(null)).toBe(0);
  });
});

describe('getSentimentLabel', () => {
  test('positive for score > 0', () => expect(getSentimentLabel(2)).toBe('positive'));
  test('negative for score < 0', () => expect(getSentimentLabel(-1)).toBe('negative'));
  test('neutral for score 0', () => expect(getSentimentLabel(0)).toBe('neutral'));
});

describe('analyzeTab', () => {
  test('adds sentiment to tab', () => {
    const tab = { title: 'Awesome Guide', url: 'https://example.com' };
    const result = analyzeTab(tab);
    expect(result.sentiment).toBeDefined();
    expect(result.sentiment.label).toBe('positive');
    expect(result.title).toBe('Awesome Guide');
  });

  test('preserves original tab fields', () => {
    const tab = { title: 'Error page', url: 'https://example.com', windowId: 1 };
    const result = analyzeTab(tab);
    expect(result.windowId).toBe(1);
    expect(result.sentiment.label).toBe('negative');
  });
});

describe('analyzeTabs', () => {
  test('returns empty array for non-array input', () => {
    expect(analyzeTabs(null)).toEqual([]);
  });

  test('annotates all tabs', () => {
    const tabs = [
      { title: 'Great Tutorial', url: 'https://a.com' },
      { title: 'Broken Build', url: 'https://b.com' }
    ];
    const result = analyzeTabs(tabs);
    expect(result).toHaveLength(2);
    expect(result[0].sentiment.label).toBe('positive');
    expect(result[1].sentiment.label).toBe('negative');
  });
});

describe('sentimentSummary', () => {
  test('counts sentiments correctly', () => {
    const tabs = [
      { title: 'Best Guide', url: 'https://a.com' },
      { title: 'Bug Report', url: 'https://b.com' },
      { title: 'My Page', url: 'https://c.com' }
    ];
    const summary = sentimentSummary(tabs);
    expect(summary.total).toBe(3);
    expect(summary.counts.positive).toBe(1);
    expect(summary.counts.negative).toBe(1);
    expect(summary.counts.neutral).toBe(1);
  });

  test('returns zero averageScore for empty array', () => {
    const summary = sentimentSummary([]);
    expect(summary.averageScore).toBe(0);
  });
});
