const {
  buildShareText,
  buildShareMarkdown,
  buildShareJson,
  shareTab,
  shareTabs,
  buildShareBundle
} = require('./tabSharer');

const sampleTab = { title: 'GitHub', url: 'https://github.com' };
const missingTitle = { url: 'https://example.com' };

describe('buildShareText', () => {
  it('returns title and url on separate lines', () => {
    expect(buildShareText(sampleTab)).toBe('GitHub\nhttps://github.com');
  });

  it('falls back to Untitled if no title', () => {
    expect(buildShareText(missingTitle)).toContain('Untitled');
  });
});

describe('buildShareMarkdown', () => {
  it('returns markdown link', () => {
    expect(buildShareMarkdown(sampleTab)).toBe('[GitHub](https://github.com)');
  });
});

describe('buildShareJson', () => {
  it('returns valid JSON string', () => {
    const result = buildShareJson(sampleTab);
    const parsed = JSON.parse(result);
    expect(parsed.title).toBe('GitHub');
    expect(parsed.url).toBe('https://github.com');
  });
});

describe('shareTab', () => {
  it('defaults to markdown format', () => {
    const result = shareTab(sampleTab);
    expect(result.format).toBe('markdown');
    expect(result.content).toContain('[GitHub]');
  });

  it('returns text format when requested', () => {
    const result = shareTab(sampleTab, 'text');
    expect(result.format).toBe('text');
    expect(result.content).toContain('GitHub');
  });

  it('returns json format when requested', () => {
    const result = shareTab(sampleTab, 'json');
    expect(result.format).toBe('json');
    expect(JSON.parse(result.content).url).toBe('https://github.com');
  });

  it('throws if tab has no url', () => {
    expect(() => shareTab({ title: 'No URL' })).toThrow();
  });
});

describe('shareTabs', () => {
  it('maps over all tabs', () => {
    const tabs = [sampleTab, missingTitle];
    const result = shareTabs(tabs, 'text');
    expect(result).toHaveLength(2);
    expect(result[0].format).toBe('text');
  });

  it('throws if not an array', () => {
    expect(() => shareTabs(null)).toThrow();
  });
});

describe('buildShareBundle', () => {
  it('joins tabs into a single bundle string', () => {
    const tabs = [sampleTab, { title: 'MDN', url: 'https://developer.mozilla.org' }];
    const result = buildShareBundle(tabs, 'markdown');
    expect(result.count).toBe(2);
    expect(result.bundle).toContain('[GitHub]');
    expect(result.bundle).toContain('[MDN]');
  });

  it('uses newline separator for text format', () => {
    const tabs = [sampleTab];
    const result = buildShareBundle(tabs, 'text');
    expect(result.format).toBe('text');
  });
});
