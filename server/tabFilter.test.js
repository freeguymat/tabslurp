const { filterByDomain, filterByKeyword, filterByProtocol, applyFilters } = require('./tabFilter');

const sampleTabs = [
  { title: 'GitHub Home', url: 'https://github.com/explore' },
  { title: 'GitHub Issues', url: 'https://github.com/user/repo/issues' },
  { title: 'Google Search', url: 'https://www.google.com/search?q=test' },
  { title: 'MDN Docs', url: 'https://developer.mozilla.org/en-US/' },
  { title: 'Local Dev', url: 'http://localhost:3000/app' },
];

describe('filterByDomain', () => {
  it('returns tabs matching the domain', () => {
    const result = filterByDomain(sampleTabs, 'github.com');
    expect(result).toHaveLength(2);
  });

  it('ignores www prefix', () => {
    const result = filterByDomain(sampleTabs, 'google.com');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Google Search');
  });

  it('returns empty array for unknown domain', () => {
    expect(filterByDomain(sampleTabs, 'example.com')).toHaveLength(0);
  });
});

describe('filterByKeyword', () => {
  it('matches tabs by title keyword', () => {
    const result = filterByKeyword(sampleTabs, 'github');
    expect(result).toHaveLength(2);
  });

  it('matches tabs by URL keyword', () => {
    const result = filterByKeyword(sampleTabs, 'localhost');
    expect(result).toHaveLength(1);
  });

  it('is case-insensitive', () => {
    const result = filterByKeyword(sampleTabs, 'MDN');
    expect(result).toHaveLength(1);
  });

  it('returns empty for no match', () => {
    expect(filterByKeyword(sampleTabs, 'zzznomatch')).toHaveLength(0);
  });
});

describe('filterByProtocol', () => {
  it('filters by https', () => {
    const result = filterByProtocol(sampleTabs, ['https']);
    expect(result).toHaveLength(4);
  });

  it('filters by http', () => {
    const result = filterByProtocol(sampleTabs, ['http']);
    expect(result).toHaveLength(1);
  });
});

describe('applyFilters', () => {
  it('applies multiple filters', () => {
    const result = applyFilters(sampleTabs, { domain: 'github.com', keyword: 'issues' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('GitHub Issues');
  });

  it('returns all tabs when no filters given', () => {
    expect(applyFilters(sampleTabs, {})).toHaveLength(sampleTabs.length);
  });
});
