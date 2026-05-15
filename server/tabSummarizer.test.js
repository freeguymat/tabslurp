const {
  countUniqueDomains,
  topDomain,
  buildSummaryLine,
  buildMarkdownSummary,
  summarizeGroups,
} = require('./tabSummarizer');

const sampleTabs = [
  { title: 'GitHub Home', url: 'https://github.com' },
  { title: 'GitHub Repo', url: 'https://github.com/user/repo' },
  { title: 'MDN Docs', url: 'https://developer.mozilla.org/docs' },
  { title: 'Node.js', url: 'https://nodejs.org' },
];

describe('countUniqueDomains', () => {
  it('counts distinct domains', () => {
    expect(countUniqueDomains(sampleTabs)).toBe(3);
  });

  it('returns 0 for empty list', () => {
    expect(countUniqueDomains([])).toBe(0);
  });
});

describe('topDomain', () => {
  it('returns the most frequent domain', () => {
    expect(topDomain(sampleTabs)).toBe('github.com');
  });

  it('returns null for empty list', () => {
    expect(topDomain([])).toBeNull();
  });
});

describe('buildSummaryLine', () => {
  it('produces a readable summary string', () => {
    const line = buildSummaryLine(sampleTabs);
    expect(line).toContain('4 tabs');
    expect(line).toContain('3 domains');
    expect(line).toContain('github.com');
  });

  it('handles a single tab', () => {
    const line = buildSummaryLine([sampleTabs[0]]);
    expect(line).toContain('1 tab');
    expect(line).toContain('1 domain');
  });

  it('returns fallback for empty input', () => {
    expect(buildSummaryLine([])).toBe('No tabs to summarize.');
  });
});

describe('buildMarkdownSummary', () => {
  it('includes the label as a heading', () => {
    const md = buildMarkdownSummary(sampleTabs, 'My Export');
    expect(md).toContain('## My Export');
  });

  it('lists up to 5 sample tabs', () => {
    const many = Array.from({ length: 8 }, (_, i) => ({
      title: `Tab ${i}`, url: `https://example${i}.com`,
    }));
    const md = buildMarkdownSummary(many);
    expect(md).toContain('...and 3 more.');
  });

  it('handles empty tabs gracefully', () => {
    expect(buildMarkdownSummary([])).toContain('_No tabs._');
  });
});

describe('summarizeGroups', () => {
  it('returns one entry per group', () => {
    const groups = {
      'github.com': [sampleTabs[0], sampleTabs[1]],
      'nodejs.org': [sampleTabs[3]],
    };
    const result = summarizeGroups(groups);
    expect(result).toHaveLength(2);
    expect(result[0].group).toBe('github.com');
    expect(result[0].count).toBe(2);
    expect(typeof result[0].summary).toBe('string');
  });
});
