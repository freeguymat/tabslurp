const { formatTabsAsMarkdown, formatTabLine, groupTabsByDomain } = require('./tabFormatter');

const sampleTabs = [
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'GitHub Trending', url: 'https://github.com/trending' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com' },
  { title: '', url: 'https://example.com/no-title' },
];

describe('formatTabLine', () => {
  test('formats a tab with title', () => {
    const result = formatTabLine({ title: 'GitHub', url: 'https://github.com' });
    expect(result).toBe('- [GitHub](https://github.com)');
  });

  test('falls back to url when title is empty', () => {
    const result = formatTabLine({ title: '', url: 'https://example.com' });
    expect(result).toBe('- [https://example.com](https://example.com)');
  });
});

describe('groupTabsByDomain', () => {
  test('groups tabs by hostname', () => {
    const groups = groupTabsByDomain(sampleTabs);
    expect(Object.keys(groups)).toContain('github.com');
    expect(groups['github.com']).toHaveLength(2);
    expect(groups['news.ycombinator.com']).toHaveLength(1);
  });
});

describe('formatTabsAsMarkdown', () => {
  test('produces a markdown string with a heading', () => {
    const md = formatTabsAsMarkdown(sampleTabs, { timestamp: false });
    expect(md).toContain('# Exported Tabs');
    expect(md).toContain('- [GitHub](https://github.com)');
  });

  test('uses custom title', () => {
    const md = formatTabsAsMarkdown(sampleTabs, { title: 'My Tabs', timestamp: false });
    expect(md).toContain('# My Tabs');
  });

  test('groups by domain when option is set', () => {
    const md = formatTabsAsMarkdown(sampleTabs, { groupByDomain: true, timestamp: false });
    expect(md).toContain('## github.com');
    expect(md).toContain('## news.ycombinator.com');
  });

  test('includes timestamp by default', () => {
    const md = formatTabsAsMarkdown(sampleTabs);
    expect(md).toMatch(/_Exported on .+_/);
  });
});
