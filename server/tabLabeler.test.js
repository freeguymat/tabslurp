const { addLabel, removeLabel, getLabelsForTab, labelTabs, filterByLabel, clearLabels, getAllLabels } = require('./tabLabeler');

beforeEach(() => clearLabels());

const tab1 = { url: 'https://github.com', title: 'GitHub' };
const tab2 = { url: 'https://news.ycombinator.com', title: 'HN' };
const tab3 = { url: 'https://reddit.com', title: 'Reddit' };

describe('addLabel', () => {
  test('adds a label to a tab', () => {
    const result = addLabel(tab1, 'work');
    expect(result).toContain('work');
  });

  test('does not duplicate labels', () => {
    addLabel(tab1, 'work');
    const result = addLabel(tab1, 'work');
    expect(result.filter(l => l === 'work').length).toBe(1);
  });

  test('throws on invalid tab', () => {
    expect(() => addLabel(null, 'work')).toThrow();
  });

  test('throws on invalid label', () => {
    expect(() => addLabel(tab1, '')).toThrow();
  });
});

describe('removeLabel', () => {
  test('removes an existing label', () => {
    addLabel(tab1, 'work');
    const result = removeLabel(tab1, 'work');
    expect(result).not.toContain('work');
  });

  test('returns empty array if no labels left', () => {
    addLabel(tab1, 'work');
    const result = removeLabel(tab1, 'work');
    expect(result).toEqual([]);
  });
});

describe('getLabelsForTab', () => {
  test('returns labels for tab', () => {
    addLabel(tab1, 'dev');
    expect(getLabelsForTab(tab1)).toContain('dev');
  });

  test('returns empty array for unlabeled tab', () => {
    expect(getLabelsForTab(tab2)).toEqual([]);
  });
});

describe('labelTabs', () => {
  test('labels multiple tabs', () => {
    const result = labelTabs([tab1, tab2], 'reading');
    expect(result[0].labels).toContain('reading');
    expect(result[1].labels).toContain('reading');
  });

  test('throws if tabs is not an array', () => {
    expect(() => labelTabs('bad', 'x')).toThrow();
  });
});

describe('filterByLabel', () => {
  test('returns only tabs with given label', () => {
    addLabel(tab1, 'work');
    addLabel(tab3, 'fun');
    const result = filterByLabel([tab1, tab2, tab3], 'work');
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe(tab1.url);
  });
});

describe('getAllLabels', () => {
  test('returns all unique labels', () => {
    addLabel(tab1, 'work');
    addLabel(tab2, 'news');
    addLabel(tab3, 'work');
    const all = getAllLabels();
    expect(all).toContain('work');
    expect(all).toContain('news');
    expect(all.length).toBe(2);
  });
});
