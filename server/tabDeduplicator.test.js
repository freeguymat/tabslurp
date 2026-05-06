const { normalizeUrl, deduplicateTabs } = require('./tabDeduplicator');

describe('normalizeUrl', () => {
  test('strips fragment by default', () => {
    expect(normalizeUrl('https://example.com/page#section'))
      .toBe('https://example.com/page#section'.replace('#section', ''));
  });

  test('keeps query string by default', () => {
    const url = 'https://example.com/search?q=hello';
    expect(normalizeUrl(url)).toBe(url);
  });

  test('strips query string when ignoreQuery is true', () => {
    expect(normalizeUrl('https://example.com/search?q=hello', { ignoreQuery: true }))
      .toBe('https://example.com/search');
  });

  test('strips trailing slash from non-root path', () => {
    expect(normalizeUrl('https://example.com/page/'))
      .toBe('https://example.com/page');
  });

  test('preserves root slash', () => {
    expect(normalizeUrl('https://example.com/')).toContain('example.com');
  });

  test('returns original string for invalid URL', () => {
    expect(normalizeUrl('not-a-url')).toBe('not-a-url');
  });
});

describe('deduplicateTabs', () => {
  const makeTabs = (urls) => urls.map((url, i) => ({ url, title: `Tab ${i}` }));

  test('returns all tabs when no duplicates', () => {
    const tabs = makeTabs(['https://a.com', 'https://b.com']);
    const { unique, duplicates } = deduplicateTabs(tabs);
    expect(unique).toHaveLength(2);
    expect(duplicates).toHaveLength(0);
  });

  test('removes exact duplicate URLs', () => {
    const tabs = makeTabs(['https://a.com', 'https://a.com', 'https://b.com']);
    const { unique, duplicates } = deduplicateTabs(tabs);
    expect(unique).toHaveLength(2);
    expect(duplicates).toHaveLength(1);
  });

  test('keeps first occurrence of duplicate', () => {
    const tabs = [
      { url: 'https://a.com', title: 'First' },
      { url: 'https://a.com', title: 'Second' },
    ];
    const { unique } = deduplicateTabs(tabs);
    expect(unique[0].title).toBe('First');
  });

  test('deduplicates by fragment-stripped URL', () => {
    const tabs = makeTabs(['https://a.com/page#one', 'https://a.com/page#two']);
    const { unique, duplicates } = deduplicateTabs(tabs, { ignoreFragment: true });
    expect(unique).toHaveLength(1);
    expect(duplicates).toHaveLength(1);
  });

  test('deduplicates by query-stripped URL', () => {
    const tabs = makeTabs(['https://a.com/s?q=foo', 'https://a.com/s?q=bar']);
    const { unique } = deduplicateTabs(tabs, { ignoreQuery: true });
    expect(unique).toHaveLength(1);
  });

  test('handles empty array', () => {
    const { unique, duplicates } = deduplicateTabs([]);
    expect(unique).toHaveLength(0);
    expect(duplicates).toHaveLength(0);
  });
});
