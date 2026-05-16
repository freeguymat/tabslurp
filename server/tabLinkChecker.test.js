const {
  isValidUrl,
  classifyUrl,
  checkTab,
  checkTabs,
  getLinkCheckSummary,
} = require('./tabLinkChecker');

describe('isValidUrl', () => {
  it('returns true for http urls', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });
  it('returns true for https urls', () => {
    expect(isValidUrl('https://example.com/path')).toBe(true);
  });
  it('returns false for chrome:// urls', () => {
    expect(isValidUrl('chrome://settings')).toBe(false);
  });
  it('returns false for garbage strings', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });
});

describe('classifyUrl', () => {
  it('classifies external urls', () => {
    expect(classifyUrl('https://github.com')).toBe('external');
  });
  it('classifies localhost as local', () => {
    expect(classifyUrl('http://localhost:3000')).toBe('local');
  });
  it('classifies 127.0.0.1 as local', () => {
    expect(classifyUrl('http://127.0.0.1:8080')).toBe('local');
  });
  it('classifies .local domains as local', () => {
    expect(classifyUrl('http://myapp.local')).toBe('local');
  });
  it('classifies invalid urls', () => {
    expect(classifyUrl('chrome://newtab')).toBe('invalid');
  });
});

describe('checkTab', () => {
  it('returns valid true for external url', () => {
    const result = checkTab({ url: 'https://example.com', title: 'Example' });
    expect(result.valid).toBe(true);
    expect(result.classification).toBe('external');
    expect(result.reachable).toBeNull();
  });
  it('returns valid false for invalid url', () => {
    const result = checkTab({ url: 'chrome://settings', title: 'Settings' });
    expect(result.valid).toBe(false);
    expect(result.classification).toBe('invalid');
  });
  it('handles missing url', () => {
    const result = checkTab({ title: 'No URL' });
    expect(result.valid).toBe(false);
  });
});

describe('checkTabs', () => {
  it('returns array of results', () => {
    const tabs = [
      { url: 'https://example.com', title: 'A' },
      { url: 'chrome://newtab', title: 'B' },
    ];
    const results = checkTabs(tabs);
    expect(results).toHaveLength(2);
    expect(results[0].valid).toBe(true);
    expect(results[1].valid).toBe(false);
  });
  it('returns empty array for non-array input', () => {
    expect(checkTabs(null)).toEqual([]);
  });
});

describe('getLinkCheckSummary', () => {
  it('summarizes results correctly', () => {
    const results = [
      { classification: 'external' },
      { classification: 'local' },
      { classification: 'invalid' },
      { classification: 'external' },
    ];
    const summary = getLinkCheckSummary(results);
    expect(summary.total).toBe(4);
    expect(summary.external).toBe(2);
    expect(summary.local).toBe(1);
    expect(summary.invalid).toBe(1);
    expect(summary.private).toBe(0);
  });
});
