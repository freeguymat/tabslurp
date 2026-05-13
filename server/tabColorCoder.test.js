const {
  getColorForProtocol,
  getColorForDomain,
  colorCodeTab,
  colorCodeTabs,
  groupByColor,
  colorSummary,
} = require('./tabColorCoder');

const sampleTabs = [
  { id: 1, title: 'GitHub', url: 'https://github.com/user/repo' },
  { id: 2, title: 'Google', url: 'https://google.com' },
  { id: 3, title: 'Local File', url: 'file:///home/user/doc.html' },
  { id: 4, title: 'Insecure', url: 'http://example.com' },
];

describe('getColorForProtocol', () => {
  test('returns green for https', () => {
    expect(getColorForProtocol('https://example.com')).toBe('green');
  });
  test('returns orange for http', () => {
    expect(getColorForProtocol('http://example.com')).toBe('orange');
  });
  test('returns yellow for file protocol', () => {
    expect(getColorForProtocol('file:///home/user/file.html')).toBe('yellow');
  });
  test('returns gray for unknown protocol', () => {
    expect(getColorForProtocol('ftp://example.com')).toBe('gray');
  });
  test('returns gray for invalid url', () => {
    expect(getColorForProtocol('not-a-url')).toBe('gray');
  });
});

describe('getColorForDomain', () => {
  test('returns a color string from palette', () => {
    const color = getColorForDomain('github.com');
    expect(typeof color).toBe('string');
    expect(color.length).toBeGreaterThan(0);
  });
  test('returns same color for same domain', () => {
    expect(getColorForDomain('github.com')).toBe(getColorForDomain('github.com'));
  });
  test('returns gray for empty domain', () => {
    expect(getColorForDomain('')).toBe('gray');
  });
});

describe('colorCodeTab', () => {
  test('assigns a color to a tab', () => {
    const result = colorCodeTab(sampleTabs[0]);
    expect(result).toHaveProperty('color');
    expect(typeof result.color).toBe('string');
  });
  test('uses protocol strategy when specified', () => {
    const result = colorCodeTab(sampleTabs[0], 'protocol');
    expect(result.color).toBe('green');
  });
  test('returns gray for tab without url', () => {
    expect(colorCodeTab({ id: 99, title: 'No URL' }).color).toBe('gray');
  });
});

describe('colorCodeTabs', () => {
  test('annotates all tabs with colors', () => {
    const result = colorCodeTabs(sampleTabs);
    expect(result).toHaveLength(sampleTabs.length);
    result.forEach(t => expect(t).toHaveProperty('color'));
  });
  test('returns empty array for non-array input', () => {
    expect(colorCodeTabs(null)).toEqual([]);
  });
});

describe('groupByColor', () => {
  test('groups tabs by their assigned color', () => {
    const groups = groupByColor(sampleTabs);
    expect(typeof groups).toBe('object');
    const allTabs = Object.values(groups).flat();
    expect(allTabs).toHaveLength(sampleTabs.length);
  });
});

describe('colorSummary', () => {
  test('returns summary with color and count', () => {
    const summary = colorSummary(sampleTabs);
    expect(Array.isArray(summary)).toBe(true);
    summary.forEach(entry => {
      expect(entry).toHaveProperty('color');
      expect(entry).toHaveProperty('count');
    });
  });
});
