const { sortTabs, sortByTitle, sortByUrl, sortByDomain, extractDomain } = require('./tabSorter');

const sampleTabs = [
  { title: 'Zebra Article', url: 'https://news.example.com/zebra' },
  { title: 'Apple Docs',    url: 'https://docs.apple.com/guide' },
  { title: 'Mango Recipe',  url: 'https://food.example.com/mango' },
  { title: 'Beta Blog',     url: 'https://blog.beta.org/post' },
];

describe('extractDomain', () => {
  test('extracts hostname from valid URL', () => {
    expect(extractDomain('https://www.example.com/path')).toBe('www.example.com');
  });

  test('returns empty string for invalid URL', () => {
    expect(extractDomain('not-a-url')).toBe('');
  });

  test('handles URL without path', () => {
    expect(extractDomain('https://github.com')).toBe('github.com');
  });
});

describe('sortByTitle', () => {
  test('sorts tabs alphabetically by title', () => {
    const sorted = sortByTitle(sampleTabs);
    expect(sorted[0].title).toBe('Apple Docs');
    expect(sorted[sorted.length - 1].title).toBe('Zebra Article');
  });

  test('does not mutate original array', () => {
    const original = [...sampleTabs];
    sortByTitle(sampleTabs);
    expect(sampleTabs).toEqual(original);
  });
});

describe('sortByUrl', () => {
  test('sorts tabs alphabetically by URL', () => {
    const sorted = sortByUrl(sampleTabs);
    expect(sorted[0].url).toBe('https://blog.beta.org/post');
    expect(sorted[sorted.length - 1].url).toBe('https://news.example.com/zebra');
  });
});

describe('sortByDomain', () => {
  test('groups tabs by domain', () => {
    const sorted = sortByDomain(sampleTabs);
    const domains = sorted.map(t => extractDomain(t.url));
    expect(domains).toEqual([...domains].sort());
  });
});

describe('sortTabs', () => {
  test('defaults to title sort', () => {
    const byDefault = sortTabs(sampleTabs);
    const byTitle   = sortByTitle(sampleTabs);
    expect(byDefault).toEqual(byTitle);
  });

  test('sorts by url when strategy is url', () => {
    expect(sortTabs(sampleTabs, 'url')).toEqual(sortByUrl(sampleTabs));
  });

  test('sorts by domain when strategy is domain', () => {
    expect(sortTabs(sampleTabs, 'domain')).toEqual(sortByDomain(sampleTabs));
  });

  test('falls back to title for unknown strategy', () => {
    expect(sortTabs(sampleTabs, 'unknown')).toEqual(sortByTitle(sampleTabs));
  });
});
