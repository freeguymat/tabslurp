const {
  computePriorityScore,
  assignPriorityLevel,
  prioritizeTab,
  prioritizeTabs,
  prioritySummary
} = require('./tabPrioritizer');

const sampleTabs = [
  { url: 'https://github.com/user/repo', title: 'My Project', pinned: false },
  { url: 'http://example.com', title: 'Example', pinned: false },
  { url: 'chrome://newtab', title: 'New Tab', pinned: false },
  { url: 'https://docs.google.com/doc', title: 'Important Doc', pinned: true }
];

describe('computePriorityScore', () => {
  it('gives higher score to https pinned tab', () => {
    const score = computePriorityScore(sampleTabs[3], { boostPinned: true });
    expect(score).toBeGreaterThanOrEqual(3);
  });

  it('gives lower score to chrome:// tab', () => {
    const score = computePriorityScore(sampleTabs[2]);
    expect(score).toBeLessThan(2);
  });

  it('boosts score for domains in boostDomains list', () => {
    const base = computePriorityScore(sampleTabs[0]);
    const boosted = computePriorityScore(sampleTabs[0], { boostDomains: ['github.com'] });
    expect(boosted).toBeGreaterThan(base);
  });
});

describe('assignPriorityLevel', () => {
  it('returns high for score >= 4', () => {
    expect(assignPriorityLevel(4)).toBe('high');
    expect(assignPriorityLevel(5)).toBe('high');
  });

  it('returns medium for score 2-3', () => {
    expect(assignPriorityLevel(2)).toBe('medium');
    expect(assignPriorityLevel(3)).toBe('medium');
  });

  it('returns low for score < 2', () => {
    expect(assignPriorityLevel(0)).toBe('low');
    expect(assignPriorityLevel(1)).toBe('low');
  });
});

describe('prioritizeTab', () => {
  it('adds priorityScore and priorityLevel to tab', () => {
    const result = prioritizeTab(sampleTabs[0]);
    expect(result).toHaveProperty('priorityScore');
    expect(result).toHaveProperty('priorityLevel');
    expect(['high', 'medium', 'low']).toContain(result.priorityLevel);
  });
});

describe('prioritizeTabs', () => {
  it('returns tabs sorted by priority descending', () => {
    const result = prioritizeTabs(sampleTabs);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].priorityScore).toBeGreaterThanOrEqual(result[i + 1].priorityScore);
    }
  });
});

describe('prioritySummary', () => {
  it('counts tabs by priority level', () => {
    const prioritized = prioritizeTabs(sampleTabs);
    const summary = prioritySummary(prioritized);
    expect(summary).toHaveProperty('high');
    expect(summary).toHaveProperty('medium');
    expect(summary).toHaveProperty('low');
    const total = summary.high + summary.medium + summary.low;
    expect(total).toBe(sampleTabs.length);
  });
});
