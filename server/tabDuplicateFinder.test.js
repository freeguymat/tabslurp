const {
  normalizeUrlForCompare,
  findExactDuplicates,
  findTitleDuplicates,
  groupDuplicates,
  getDuplicateSummary,
} = require('./tabDuplicateFinder');

const tabs = [
  { url: 'https://example.com/', title: 'Example' },
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://github.com', title: 'GitHub' },
  { url: 'https://github.com#readme', title: 'GitHub' },
  { url: 'https://unique.com', title: 'Unique Site' },
];

describe('normalizeUrlForCompare', () => {
  it('strips trailing slash', () => {
    expect(normalizeUrlForCompare('https://example.com/')).toBe('https://example.com');
  });

  it('strips hash fragment', () => {
    expect(normalizeUrlForCompare('https://github.com#readme')).toBe('https://github.com');
  });

  it('handles invalid url gracefully', () => {
    expect(normalizeUrlForCompare('not a url')).toBe('not a url');
  });
});

describe('findExactDuplicates', () => {
  it('finds tabs with same normalized url', () => {
    const dups = findExactDuplicates(tabs);
    expect(dups.length).toBeGreaterThanOrEqual(2);
  });

  it('returns original and duplicate', () => {
    const dups = findExactDuplicates(tabs);
    expect(dups[0]).toHaveProperty('original');
    expect(dups[0]).toHaveProperty('duplicate');
  });

  it('returns empty for unique tabs', () => {
    const unique = [{ url: 'https://a.com', title: 'A' }, { url: 'https://b.com', title: 'B' }];
    expect(findExactDuplicates(unique)).toHaveLength(0);
  });
});

describe('findTitleDuplicates', () => {
  it('finds tabs with same title', () => {
    const dups = findTitleDuplicates(tabs);
    expect(dups.length).toBeGreaterThanOrEqual(1);
  });

  it('ignores tabs with empty titles', () => {
    const withEmpty = [{ url: 'https://a.com', title: '' }, { url: 'https://b.com', title: '' }];
    expect(findTitleDuplicates(withEmpty)).toHaveLength(0);
  });
});

describe('groupDuplicates', () => {
  it('groups tabs by normalized url', () => {
    const groups = groupDuplicates(tabs);
    expect(groups.length).toBeGreaterThan(0);
    groups.forEach(g => expect(g.length).toBeGreaterThanOrEqual(2));
  });
});

describe('getDuplicateSummary', () => {
  it('returns summary object with expected keys', () => {
    const summary = getDuplicateSummary(tabs);
    expect(summary).toHaveProperty('totalTabs', tabs.length);
    expect(summary).toHaveProperty('exactDuplicateCount');
    expect(summary).toHaveProperty('titleDuplicateCount');
    expect(summary).toHaveProperty('duplicateGroups');
  });
});
