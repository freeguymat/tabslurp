const {
  setTranslation,
  getTranslation,
  removeTranslation,
  hasTranslation,
  applyTranslations,
  clearTranslations,
  getTranslationSummary,
} = require('./tabTranslator');

beforeEach(() => clearTranslations());

const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://news.ycombinator.com', title: 'Hacker News' };

describe('setTranslation', () => {
  it('stores a translation for a tab', () => {
    const result = setTranslation(tab1, 'Ejemplo');
    expect(result.translatedTitle).toBe('Ejemplo');
  });

  it('throws if tab has no url', () => {
    expect(() => setTranslation({ title: 'No URL' }, 'X')).toThrow();
  });

  it('throws if translatedTitle is empty', () => {
    expect(() => setTranslation(tab1, '   ')).toThrow();
  });
});

describe('getTranslation', () => {
  it('returns null when no translation exists', () => {
    expect(getTranslation(tab1)).toBeNull();
  });

  it('returns the translated title after setting', () => {
    setTranslation(tab1, 'Ejemplo');
    expect(getTranslation(tab1)).toBe('Ejemplo');
  });
});

describe('removeTranslation', () => {
  it('removes an existing translation', () => {
    setTranslation(tab1, 'Ejemplo');
    expect(removeTranslation(tab1)).toBe(true);
    expect(getTranslation(tab1)).toBeNull();
  });

  it('returns false if no translation to remove', () => {
    expect(removeTranslation(tab2)).toBe(false);
  });
});

describe('hasTranslation', () => {
  it('returns false before setting', () => {
    expect(hasTranslation(tab1)).toBe(false);
  });

  it('returns true after setting', () => {
    setTranslation(tab1, 'Ejemplo');
    expect(hasTranslation(tab1)).toBe(true);
  });
});

describe('applyTranslations', () => {
  it('replaces title with translation and preserves originalTitle', () => {
    setTranslation(tab1, 'Ejemplo');
    const result = applyTranslations([tab1, tab2]);
    expect(result[0].title).toBe('Ejemplo');
    expect(result[0].originalTitle).toBe('Example');
    expect(result[1].title).toBe('Hacker News');
    expect(result[1].originalTitle).toBeUndefined();
  });
});

describe('getTranslationSummary', () => {
  it('returns correct counts', () => {
    setTranslation(tab1, 'Ejemplo');
    const summary = getTranslationSummary([tab1, tab2]);
    expect(summary.total).toBe(2);
    expect(summary.translated).toBe(1);
    expect(summary.untranslated).toBe(1);
  });
});
