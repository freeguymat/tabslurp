const { tagTab, tagTabs, filterByTag, extractDomain } = require('./tabTagger');

describe('extractDomain', () => {
  it('strips www prefix', () => {
    expect(extractDomain('https://www.github.com/user/repo')).toBe('github.com');
  });

  it('returns empty string for invalid url', () => {
    expect(extractDomain('not-a-url')).toBe('');
  });
});

describe('tagTab', () => {
  it('tags a github tab as dev', () => {
    const tab = { url: 'https://github.com/user/repo', title: 'My Repo' };
    const result = tagTab(tab);
    expect(result.tags).toContain('dev');
  });

  it('tags a youtube tab as video', () => {
    const tab = { url: 'https://youtube.com/watch?v=abc', title: 'Cool Video' };
    const result = tagTab(tab);
    expect(result.tags).toContain('video');
  });

  it('tags by title keyword', () => {
    const tab = { url: 'https://example.com/docs', title: 'API Documentation' };
    const result = tagTab(tab);
    expect(result.tags).toContain('docs');
  });

  it('returns empty tags for unrecognized tab', () => {
    const tab = { url: 'https://randomsite.xyz', title: 'Some Page' };
    const result = tagTab(tab);
    expect(result.tags).toEqual([]);
  });

  it('preserves original tab fields', () => {
    const tab = { url: 'https://reddit.com', title: 'Reddit', windowId: 1 };
    const result = tagTab(tab);
    expect(result.windowId).toBe(1);
    expect(result.url).toBe('https://reddit.com');
  });

  it('can match multiple tags', () => {
    const tab = { url: 'https://news.ycombinator.com', title: 'Hacker News Documentation' };
    const result = tagTab(tab);
    expect(result.tags).toContain('news');
    expect(result.tags).toContain('docs');
  });
});

describe('tagTabs', () => {
  it('tags an array of tabs', () => {
    const tabs = [
      { url: 'https://github.com', title: 'GitHub' },
      { url: 'https://twitter.com', title: 'Twitter' },
    ];
    const result = tagTabs(tabs);
    expect(result[0].tags).toContain('dev');
    expect(result[1].tags).toContain('social');
  });

  it('returns empty array for non-array input', () => {
    expect(tagTabs(null)).toEqual([]);
  });
});

describe('filterByTag', () => {
  const tabs = [
    { url: 'https://github.com', title: 'GitHub', tags: ['dev'] },
    { url: 'https://youtube.com', title: 'YouTube', tags: ['video'] },
    { url: 'https://twitter.com', title: 'Twitter', tags: ['social'] },
  ];

  it('filters tabs by tag', () => {
    const result = filterByTag(tabs, 'dev');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('GitHub');
  });

  it('returns all tabs when no tag given', () => {
    expect(filterByTag(tabs, null)).toHaveLength(3);
  });

  it('returns empty array when no tabs match', () => {
    expect(filterByTag(tabs, 'shopping')).toHaveLength(0);
  });
});
