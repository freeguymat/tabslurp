const { groupByDomain, groupByWindow, groupByProtocol, groupTabs, VALID_STRATEGIES } = require('./tabGrouper');

const sampleTabs = [
  { title: 'GitHub',   url: 'https://github.com/user/repo', windowId: 1 },
  { title: 'GitHub 2', url: 'https://github.com/user/other', windowId: 2 },
  { title: 'MDN',      url: 'https://developer.mozilla.org/docs', windowId: 1 },
  { title: 'Local',    url: 'http://localhost:3000', windowId: 2 },
];

describe('groupByDomain', () => {
  it('groups tabs under their domain keys', () => {
    const result = groupByDomain(sampleTabs);
    expect(Object.keys(result)).toContain('github.com');
    expect(result['github.com']).toHaveLength(2);
    expect(result['developer.mozilla.org']).toHaveLength(1);
  });
});

describe('groupByWindow', () => {
  it('groups tabs by windowId', () => {
    const result = groupByWindow(sampleTabs);
    expect(result['1']).toHaveLength(2);
    expect(result['2']).toHaveLength(2);
  });

  it('uses "unknown" when windowId is missing', () => {
    const tabs = [{ title: 'No window', url: 'https://example.com' }];
    const result = groupByWindow(tabs);
    expect(result['unknown']).toHaveLength(1);
  });
});

describe('groupByProtocol', () => {
  it('separates https and http tabs', () => {
    const result = groupByProtocol(sampleTabs);
    expect(result['https']).toHaveLength(3);
    expect(result['http']).toHaveLength(1);
  });

  it('puts invalid URLs in "other"', () => {
    const tabs = [{ title: 'Bad', url: 'not-a-url' }];
    const result = groupByProtocol(tabs);
    expect(result['other']).toHaveLength(1);
  });
});

describe('groupTabs', () => {
  it('delegates to the correct strategy', () => {
    const result = groupTabs(sampleTabs, 'domain');
    expect(result['github.com']).toHaveLength(2);
  });

  it('defaults to domain strategy', () => {
    const result = groupTabs(sampleTabs);
    expect(result['github.com']).toBeDefined();
  });

  it('throws on invalid strategy', () => {
    expect(() => groupTabs(sampleTabs, 'color')).toThrow(/Invalid strategy/);
  });

  it('throws if tabs is not an array', () => {
    expect(() => groupTabs(null, 'domain')).toThrow();
  });

  it('exports VALID_STRATEGIES list', () => {
    expect(VALID_STRATEGIES).toContain('domain');
    expect(VALID_STRATEGIES).toContain('window');
    expect(VALID_STRATEGIES).toContain('protocol');
  });
});
