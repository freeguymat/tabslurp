const {
  truncateString,
  truncateTitle,
  truncateUrl,
  truncateTab,
  truncateTabs,
  truncationSummary,
} = require('./tabTruncator');

describe('truncateString', () => {
  it('returns string unchanged if within limit', () => {
    expect(truncateString('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis if over limit', () => {
    expect(truncateString('hello world', 8)).toBe('hello...');
  });

  it('returns non-string values as-is', () => {
    expect(truncateString(null, 10)).toBeNull();
  });
});

describe('truncateTitle', () => {
  it('truncates long titles to default max', () => {
    const long = 'A'.repeat(100);
    const result = truncateTitle(long);
    expect(result.length).toBe(80);
    expect(result.endsWith('...')).toBe(true);
  });

  it('respects custom maxLength', () => {
    const result = truncateTitle('Hello World', 7);
    expect(result).toBe('Hell...');
  });
});

describe('truncateUrl', () => {
  it('truncates long URLs to default max', () => {
    const long = 'https://example.com/' + 'a'.repeat(200);
    const result = truncateUrl(long);
    expect(result.length).toBe(120);
  });
});

describe('truncateTab', () => {
  const tab = { title: 'Short', url: 'https://example.com', windowId: 1 };

  it('returns tab with truncated fields', () => {
    const result = truncateTab(tab);
    expect(result.title).toBe('Short');
    expect(result.truncated).toBe(false);
  });

  it('marks tab as truncated when title is too long', () => {
    const longTab = { ...tab, title: 'T'.repeat(100) };
    const result = truncateTab(longTab);
    expect(result.truncated).toBe(true);
    expect(result.originalTitle).toBe(longTab.title);
  });

  it('preserves original title and url', () => {
    const longTab = { ...tab, url: 'https://x.com/' + 'p'.repeat(200) };
    const result = truncateTab(longTab);
    expect(result.originalUrl).toBe(longTab.url);
  });
});

describe('truncateTabs', () => {
  it('returns empty array for non-array input', () => {
    expect(truncateTabs(null)).toEqual([]);
  });

  it('processes all tabs', () => {
    const tabs = [
      { title: 'A', url: 'https://a.com' },
      { title: 'B'.repeat(90), url: 'https://b.com' },
    ];
    const result = truncateTabs(tabs);
    expect(result).toHaveLength(2);
    expect(result[1].truncated).toBe(true);
  });
});

describe('truncationSummary', () => {
  it('counts truncated tabs correctly', () => {
    const tabs = [
      { title: 'A', url: 'https://a.com', truncated: false },
      { title: 'B...', url: 'https://b.com', truncated: true },
    ];
    const summary = truncationSummary(tabs);
    expect(summary.total).toBe(2);
    expect(summary.truncatedCount).toBe(1);
  });
});
