const {
  recordExport,
  getHistory,
  getRecentHistory,
  clearHistory,
  getHistorySummary,
} = require('./tabHistory');

beforeEach(() => {
  clearHistory();
});

describe('recordExport', () => {
  it('records an export entry with defaults', () => {
    const entry = recordExport({ filename: 'tabs-2024.md', tabCount: 5 });
    expect(entry.filename).toBe('tabs-2024.md');
    expect(entry.tabCount).toBe(5);
    expect(entry.id).toBe(1);
    expect(entry.timestamp).toBeDefined();
    expect(entry.filters).toBeNull();
    expect(entry.groupBy).toBeNull();
  });

  it('increments id with each entry', () => {
    const a = recordExport({ tabCount: 3 });
    const b = recordExport({ tabCount: 7 });
    expect(a.id).toBe(1);
    expect(b.id).toBe(2);
  });

  it('stores filters and groupBy when provided', () => {
    const entry = recordExport({ tabCount: 2, filters: { domain: 'github.com' }, groupBy: 'domain' });
    expect(entry.filters).toEqual({ domain: 'github.com' });
    expect(entry.groupBy).toBe('domain');
  });
});

describe('getHistory', () => {
  it('returns all recorded entries', () => {
    recordExport({ tabCount: 1 });
    recordExport({ tabCount: 2 });
    expect(getHistory()).toHaveLength(2);
  });

  it('returns a copy, not the internal array', () => {
    const h = getHistory();
    h.push({ fake: true });
    expect(getHistory()).toHaveLength(0);
  });
});

describe('getRecentHistory', () => {
  it('returns most recent entries in reverse order', () => {
    recordExport({ tabCount: 1 });
    recordExport({ tabCount: 2 });
    recordExport({ tabCount: 3 });
    const recent = getRecentHistory(2);
    expect(recent).toHaveLength(2);
    expect(recent[0].tabCount).toBe(3);
    expect(recent[1].tabCount).toBe(2);
  });
});

describe('getHistorySummary', () => {
  it('returns zeros when history is empty', () => {
    const summary = getHistorySummary();
    expect(summary.totalExports).toBe(0);
    expect(summary.totalTabs).toBe(0);
    expect(summary.lastExport).toBeNull();
  });

  it('computes correct totals', () => {
    recordExport({ tabCount: 4 });
    recordExport({ tabCount: 6 });
    const summary = getHistorySummary();
    expect(summary.totalExports).toBe(2);
    expect(summary.totalTabs).toBe(10);
    expect(summary.lastExport).toBeDefined();
  });
});
