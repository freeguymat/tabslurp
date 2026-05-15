const { extractKeywords, keywordOverlap, clusterTabs, clusterSummary } = require('./tabClustering');

describe('extractKeywords', () => {
  it('lowercases and removes stop words', () => {
    const kw = extractKeywords('The Best Guide to JavaScript');
    expect(kw).toContain('best');
    expect(kw).toContain('guide');
    expect(kw).toContain('javascript');
    expect(kw).not.toContain('the');
    expect(kw).not.toContain('to');
  });

  it('returns empty array for empty string', () => {
    expect(extractKeywords('')).toEqual([]);
  });

  it('filters short words', () => {
    expect(extractKeywords('a is ok')).toEqual([]);
  });
});

describe('keywordOverlap', () => {
  it('returns 1 for identical sets', () => {
    const s = new Set(['react', 'hooks']);
    expect(keywordOverlap(s, s)).toBe(1);
  });

  it('returns 0 for disjoint sets', () => {
    expect(keywordOverlap(new Set(['react']), new Set(['python']))).toBe(0);
  });

  it('returns 0 for two empty sets', () => {
    expect(keywordOverlap(new Set(), new Set())).toBe(0);
  });

  it('computes partial overlap', () => {
    const a = new Set(['react', 'hooks', 'state']);
    const b = new Set(['react', 'hooks', 'redux']);
    expect(keywordOverlap(a, b)).toBeCloseTo(0.5);
  });
});

describe('clusterTabs', () => {
  const tabs = [
    { title: 'React Hooks Guide', url: 'https://react.dev/hooks' },
    { title: 'React State Management', url: 'https://react.dev/state' },
    { title: 'Python Tutorial', url: 'https://python.org/tutorial' },
    { title: 'Python Basics', url: 'https://python.org/basics' },
  ];

  it('returns empty array for no tabs', () => {
    expect(clusterTabs([])).toEqual([]);
  });

  it('clusters tabs by domain', () => {
    const clusters = clusterTabs(tabs, { groupByDomainFirst: true });
    expect(clusters.length).toBe(2);
    const sizes = clusters.map(c => c.tabs.length).sort();
    expect(sizes).toEqual([2, 2]);
  });

  it('each cluster has a seed tab', () => {
    const clusters = clusterTabs(tabs);
    clusters.forEach(c => expect(c.seed).toBeDefined());
  });

  it('all tabs are assigned to exactly one cluster', () => {
    const clusters = clusterTabs(tabs);
    const total = clusters.reduce((sum, c) => sum + c.tabs.length, 0);
    expect(total).toBe(tabs.length);
  });
});

describe('clusterSummary', () => {
  it('returns correct summary', () => {
    const clusters = [
      { seed: {}, tabs: [{}, {}] },
      { seed: {}, tabs: [{}] },
    ];
    const summary = clusterSummary(clusters);
    expect(summary.totalClusters).toBe(2);
    expect(summary.totalTabs).toBe(3);
    expect(summary.largestCluster).toBe(2);
    expect(summary.singletonClusters).toBe(1);
  });
});
