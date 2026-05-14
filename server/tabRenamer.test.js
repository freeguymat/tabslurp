const {
  renameTab,
  unrename,
  isRenamed,
  getCustomTitle,
  applyRenames,
  getRenameMap,
  clearRenames,
} = require('./tabRenamer');

beforeEach(() => clearRenames());

const tab = { url: 'https://example.com', title: 'Example' };

describe('renameTab', () => {
  it('renames a tab and returns updated tab', () => {
    const result = renameTab(tab, 'My Custom Title');
    expect(result.title).toBe('My Custom Title');
    expect(result.renamed).toBe(true);
    expect(result.url).toBe(tab.url);
  });

  it('trims whitespace from new title', () => {
    const result = renameTab(tab, '  Trimmed  ');
    expect(result.title).toBe('Trimmed');
  });

  it('throws on invalid tab', () => {
    expect(() => renameTab(null, 'Title')).toThrow();
  });

  it('throws on empty title', () => {
    expect(() => renameTab(tab, '   ')).toThrow();
  });
});

describe('isRenamed / unrename', () => {
  it('returns false before rename', () => {
    expect(isRenamed(tab)).toBe(false);
  });

  it('returns true after rename', () => {
    renameTab(tab, 'New Name');
    expect(isRenamed(tab)).toBe(true);
  });

  it('returns false after unrename', () => {
    renameTab(tab, 'New Name');
    unrename(tab);
    expect(isRenamed(tab)).toBe(false);
  });

  it('unrename returns false if tab was not renamed', () => {
    expect(unrename(tab)).toBe(false);
  });
});

describe('getCustomTitle', () => {
  it('returns null if not renamed', () => {
    expect(getCustomTitle(tab)).toBeNull();
  });

  it('returns custom title after rename', () => {
    renameTab(tab, 'Custom');
    expect(getCustomTitle(tab)).toBe('Custom');
  });
});

describe('applyRenames', () => {
  it('applies renames to matching tabs', () => {
    renameTab(tab, 'Renamed Example');
    const tabs = [tab, { url: 'https://other.com', title: 'Other' }];
    const result = applyRenames(tabs);
    expect(result[0].title).toBe('Renamed Example');
    expect(result[0].renamed).toBe(true);
    expect(result[1].title).toBe('Other');
    expect(result[1].renamed).toBeUndefined();
  });

  it('throws if not an array', () => {
    expect(() => applyRenames('nope')).toThrow();
  });
});

describe('getRenameMap', () => {
  it('returns a plain object of url -> title', () => {
    renameTab(tab, 'Mapped');
    const map = getRenameMap();
    expect(map['https://example.com']).toBe('Mapped');
  });
});
