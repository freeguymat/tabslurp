const { validateTab, validateTabsPayload } = require('./tabValidator');

describe('validateTab', () => {
  const validTab = { title: 'Google', url: 'https://google.com' };

  test('accepts a valid tab', () => {
    expect(validateTab(validTab)).toEqual([]);
  });

  test('rejects missing title', () => {
    const errors = validateTab({ url: 'https://google.com' });
    expect(errors).toContain('Missing or invalid field: title');
  });

  test('rejects missing url', () => {
    const errors = validateTab({ title: 'Google' });
    expect(errors).toContain('Missing or invalid field: url');
  });

  test('rejects empty string title', () => {
    const errors = validateTab({ title: '   ', url: 'https://google.com' });
    expect(errors).toContain('Missing or invalid field: title');
  });

  test('rejects invalid url', () => {
    const errors = validateTab({ title: 'Bad', url: 'not-a-url' });
    expect(errors.some(e => e.includes('Invalid URL'))).toBe(true);
  });

  test('rejects unsupported protocol', () => {
    const errors = validateTab({ title: 'FTP', url: 'ftp://example.com' });
    expect(errors.some(e => e.includes('Unsupported protocol'))).toBe(true);
  });

  test('accepts file: protocol', () => {
    const errors = validateTab({ title: 'Local', url: 'file:///home/user/doc.html' });
    expect(errors).toEqual([]);
  });

  test('rejects non-boolean pinned', () => {
    const errors = validateTab({ ...validTab, pinned: 'yes' });
    expect(errors).toContain('pinned must be a boolean');
  });
});

describe('validateTabsPayload', () => {
  const validPayload = {
    tabs: [
      { title: 'Google', url: 'https://google.com' },
      { title: 'GitHub', url: 'https://github.com' }
    ]
  };

  test('accepts valid payload', () => {
    expect(validateTabsPayload(validPayload)).toEqual({ valid: true, errors: [] });
  });

  test('rejects null payload', () => {
    const result = validateTabsPayload(null);
    expect(result.valid).toBe(false);
  });

  test('rejects empty tabs array', () => {
    const result = validateTabsPayload({ tabs: [] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('tabs array cannot be empty');
  });

  test('rejects missing tabs field', () => {
    const result = validateTabsPayload({ data: [] });
    expect(result.valid).toBe(false);
  });

  test('includes per-tab errors with index', () => {
    const result = validateTabsPayload({ tabs: [{ title: '', url: 'https://x.com' }] });
    expect(result.errors.some(e => e.startsWith('Tab 0:'))).toBe(true);
  });
});
