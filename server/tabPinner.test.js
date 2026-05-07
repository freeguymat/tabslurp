const {
  pinTab,
  unpinTab,
  isPinned,
  pinTabs,
  getPinnedTabs,
  getUnpinnedTabs,
  clearPinned,
  getPinnedUrls
} = require('./tabPinner');

beforeEach(() => clearPinned());

const makeTab = (url, title = 'Tab') => ({ url, title });

describe('pinTab', () => {
  it('pins a valid tab', () => {
    const result = pinTab(makeTab('https://example.com'));
    expect(result.success).toBe(true);
    expect(result.url).toBe('https://example.com');
  });

  it('returns error for invalid tab', () => {
    expect(pinTab(null).success).toBe(false);
    expect(pinTab({}).success).toBe(false);
  });
});

describe('unpinTab', () => {
  it('unpins a pinned tab', () => {
    const tab = makeTab('https://example.com');
    pinTab(tab);
    const result = unpinTab(tab);
    expect(result.success).toBe(true);
  });

  it('returns false when tab was not pinned', () => {
    const result = unpinTab(makeTab('https://notpinned.com'));
    expect(result.success).toBe(false);
  });
});

describe('isPinned', () => {
  it('returns true for pinned tab', () => {
    const tab = makeTab('https://pinned.com');
    pinTab(tab);
    expect(isPinned(tab)).toBe(true);
  });

  it('returns false for unpinned tab', () => {
    expect(isPinned(makeTab('https://nope.com'))).toBe(false);
  });
});

describe('pinTabs', () => {
  it('pins multiple tabs', () => {
    const tabs = [makeTab('https://a.com'), makeTab('https://b.com')];
    const { pinned, errors } = pinTabs(tabs);
    expect(pinned).toHaveLength(2);
    expect(errors).toHaveLength(0);
  });

  it('handles invalid input', () => {
    expect(pinTabs(null)).toEqual({ pinned: [], errors: [] });
  });
});

describe('getPinnedTabs / getUnpinnedTabs', () => {
  it('splits tabs into pinned and unpinned', () => {
    const tabs = [makeTab('https://a.com'), makeTab('https://b.com')];
    pinTab(tabs[0]);
    expect(getPinnedTabs(tabs)).toHaveLength(1);
    expect(getUnpinnedTabs(tabs)).toHaveLength(1);
  });
});

describe('getPinnedUrls', () => {
  it('returns array of pinned urls', () => {
    pinTab(makeTab('https://x.com'));
    expect(getPinnedUrls()).toContain('https://x.com');
  });
});
