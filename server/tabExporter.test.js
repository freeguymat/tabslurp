const {
  exportAsMarkdown,
  exportAsJson,
  exportAsCsv,
  exportTabs,
  SUPPORTED_FORMATS
} = require('./tabExporter');

const sampleTabs = [
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'MDN Docs', url: 'https://developer.mozilla.org' },
  { title: 'Untitled Tab', url: 'chrome://newtab' }
];

describe('exportAsMarkdown', () => {
  it('returns markdown list of tabs', () => {
    const result = exportAsMarkdown(sampleTabs);
    expect(result).toContain('- [GitHub](https://github.com)');
    expect(result).toContain('- [MDN Docs](https://developer.mozilla.org)');
  });

  it('handles empty array', () => {
    expect(exportAsMarkdown([])).toBe('');
  });

  it('falls back to Untitled for missing title', () => {
    const result = exportAsMarkdown([{ url: 'https://example.com' }]);
    expect(result).toContain('[Untitled]');
  });

  it('returns empty string for non-array input', () => {
    expect(exportAsMarkdown(null)).toBe('');
  });
});

describe('exportAsJson', () => {
  it('returns valid JSON string', () => {
    const result = exportAsJson(sampleTabs);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(3);
    expect(parsed[0]).toEqual({ title: 'GitHub', url: 'https://github.com' });
  });

  it('returns [] for non-array input', () => {
    expect(exportAsJson(null)).toBe('[]');
  });
});

describe('exportAsCsv', () => {
  it('includes header row', () => {
    const result = exportAsCsv(sampleTabs);
    expect(result.startsWith('title,url')).toBe(true);
  });

  it('wraps fields in quotes', () => {
    const result = exportAsCsv([{ title: 'Hello', url: 'https://hello.com' }]);
    expect(result).toContain('"Hello","https://hello.com"');
  });

  it('escapes double quotes in titles', () => {
    const result = exportAsCsv([{ title: 'Say "hi"', url: 'https://x.com' }]);
    expect(result).toContain('"Say ""hi"""');
  });

  it('returns only header for empty array', () => {
    expect(exportAsCsv([])).toBe('title,url');
  });
});

describe('exportTabs', () => {
  it('exports as markdown by default', () => {
    const result = exportTabs(sampleTabs);
    expect(result.format).toBe('markdown');
    expect(result.content).toContain('- [GitHub]');
  });

  it('exports as json', () => {
    const result = exportTabs(sampleTabs, 'json');
    expect(result.format).toBe('json');
    expect(() => JSON.parse(result.content)).not.toThrow();
  });

  it('exports as csv', () => {
    const result = exportTabs(sampleTabs, 'csv');
    expect(result.format).toBe('csv');
    expect(result.content).toContain('title,url');
  });

  it('throws for unsupported format', () => {
    expect(() => exportTabs(sampleTabs, 'xml')).toThrow('Unsupported format');
  });

  it('throws if tabs is not an array', () => {
    expect(() => exportTabs(null)).toThrow('tabs must be an array');
  });

  it('SUPPORTED_FORMATS includes expected values', () => {
    expect(SUPPORTED_FORMATS).toContain('markdown');
    expect(SUPPORTED_FORMATS).toContain('json');
    expect(SUPPORTED_FORMATS).toContain('csv');
  });
});
