const { countByDomain, countByProtocol, topDomains, computeStats } = require('./tabStats');

const sampleTabs = [
  { title: 'GitHub', url: 'https://github.com/foo' },
  { title: 'GitHub Issues', url: 'https://github.com/foo/issues' },
  { title: 'MDN', url: 'https://developer.mozilla.org/en-US/' },
  { title: 'Google', url: 'https://google.com' },
  { title: 'Local', url: 'http://localhost:3000' },
];

describe('countByDomain', () => {
  it('counts tabs per domain', () => {
    const result = countByDomain(sampleTabs);
    expect(result['github.com']).toBe(2);
    expect(result['developer.mozilla.org']).toBe(1);
  });
});

describe('countByProtocol', () => {
  it('counts tabs per protocol', () => {
    const result = countByProtocol(sampleTabs);
    expect(result['https']).toBe(4);
    expect(result['http']).toBe(1);
  });

  it('handles invalid urls gracefully', () => {
    const tabs = [{ title: 'Bad', url: 'not-a-url' }];
    const result = countByProtocol(tabs);
    expect(result['unknown']).toBe(1);
  });
});

describe('topDomains', () => {
  it('returns top domains sorted by count', () => {
    const result = topDomains(sampleTabs, 3);
    expect(result[0].domain).toBe('github.com');
    expect(result[0].count).toBe(2);
    expect(result.length).toBeLessThanOrEqual(3);
  });
});

describe('computeStats', () => {
  it('returns full stats object', () => {
    const result = computeStats(sampleTabs);
    expect(result.total).toBe(5);
    expect(result.uniqueDomains).toBe(4);
    expect(result.byProtocol.https).toBe(4);
    expect(Array.isArray(result.topDomains)).toBe(true);
  });

  it('handles empty array', () => {
    const result = computeStats([]);
    expect(result.total).toBe(0);
    expect(result.uniqueDomains).toBe(0);
  });

  it('handles non-array input', () => {
    const result = computeStats(null);
    expect(result.total).toBe(0);
  });
});
