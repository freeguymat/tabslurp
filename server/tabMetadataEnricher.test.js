const {
  classifyContent,
  isSecure,
  enrichTab,
  enrichTabs,
  enrichmentSummary
} = require('./tabMetadataEnricher');

const makeTab = (url, title = 'Test Tab') => ({ url, title });

describe('classifyContent', () => {
  it('classifies youtube as video', () => {
    expect(classifyContent(makeTab('https://youtube.com/watch?v=abc'))).toBe('video');
  });

  it('classifies github as dev', () => {
    expect(classifyContent(makeTab('https://github.com/user/repo'))).toBe('dev');
  });

  it('classifies twitter as social', () => {
    expect(classifyContent(makeTab('https://twitter.com/someone'))).toBe('social');
  });

  it('classifies bbc as news', () => {
    expect(classifyContent(makeTab('https://bbc.com/news'))).toBe('news');
  });

  it('returns general for unrecognized domain', () => {
    expect(classifyContent(makeTab('https://example.com'))).toBe('general');
  });

  it('returns unknown for invalid url', () => {
    expect(classifyContent(makeTab('not-a-url'))).toBe('unknown');
  });
});

describe('isSecure', () => {
  it('returns true for https', () => {
    expect(isSecure('https://example.com')).toBe(true);
  });

  it('returns false for http', () => {
    expect(isSecure('http://example.com')).toBe(false);
  });
});

describe('enrichTab', () => {
  it('adds _meta to a tab', () => {
    const tab = makeTab('https://github.com/foo', 'Hello World');
    const result = enrichTab(tab);
    expect(result._meta).toBeDefined();
    expect(result._meta.domain).toBe('github.com');
    expect(result._meta.secure).toBe(true);
    expect(result._meta.contentType).toBe('dev');
    expect(result._meta.titleWordCount).toBe(2);
    expect(result._meta.hasTitle).toBe(true);
    expect(result._meta.enrichedAt).toBeDefined();
  });

  it('preserves original tab fields', () => {
    const tab = makeTab('https://example.com', 'My Tab');
    const result = enrichTab(tab);
    expect(result.url).toBe(tab.url);
    expect(result.title).toBe(tab.title);
  });

  it('handles null gracefully', () => {
    expect(enrichTab(null)).toBeNull();
  });
});

describe('enrichTabs', () => {
  it('enriches an array of tabs', () => {
    const tabs = [makeTab('https://example.com'), makeTab('http://foo.com')];
    const result = enrichTabs(tabs);
    expect(result).toHaveLength(2);
    result.forEach(t => expect(t._meta).toBeDefined());
  });

  it('returns empty array for non-array input', () => {
    expect(enrichTabs(null)).toEqual([]);
  });
});

describe('enrichmentSummary', () => {
  it('summarizes enriched tabs', () => {
    const tabs = enrichTabs([
      makeTab('https://github.com'),
      makeTab('http://example.com'),
      makeTab('https://youtube.com')
    ]);
    const summary = enrichmentSummary(tabs);
    expect(summary.total).toBe(3);
    expect(summary.secureCount).toBe(2);
    expect(summary.insecureCount).toBe(1);
    expect(summary.contentTypes.dev).toBe(1);
    expect(summary.contentTypes.video).toBe(1);
  });
});
