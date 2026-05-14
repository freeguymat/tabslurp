const { rateTab, unrateTab, getRating, isRated, rateTabs, getTopRated, getAllRatings, clearRatings, ratingSummary, isValidRating } = require('./tabRater');

beforeEach(() => clearRatings());

const tab1 = { url: 'https://github.com', title: 'GitHub' };
const tab2 = { url: 'https://news.ycombinator.com', title: 'HN' };
const tab3 = { url: 'https://example.com', title: 'Example' };

describe('isValidRating', () => {
  it('accepts 1-5', () => {
    [1, 2, 3, 4, 5].forEach(v => expect(isValidRating(v)).toBe(true));
  });
  it('rejects 0, 6, floats, strings', () => {
    [0, 6, 3.5, 'four', null].forEach(v => expect(isValidRating(v)).toBe(false));
  });
});

describe('rateTab', () => {
  it('stores a rating', () => {
    const result = rateTab(tab1, 5);
    expect(result.rating).toBe(5);
    expect(result.url).toBe(tab1.url);
  });
  it('overwrites existing rating', () => {
    rateTab(tab1, 3);
    rateTab(tab1, 5);
    expect(getRating(tab1).rating).toBe(5);
  });
  it('throws on invalid tab', () => {
    expect(() => rateTab(null, 3)).toThrow();
  });
  it('throws on invalid rating', () => {
    expect(() => rateTab(tab1, 6)).toThrow();
  });
});

describe('unrateTab', () => {
  it('removes a rating and returns true', () => {
    rateTab(tab1, 4);
    expect(unrateTab(tab1)).toBe(true);
    expect(isRated(tab1)).toBe(false);
  });
  it('returns false if not rated', () => {
    expect(unrateTab(tab2)).toBe(false);
  });
});

describe('getTopRated', () => {
  it('returns tabs at or above minRating', () => {
    rateTab(tab1, 5);
    rateTab(tab2, 3);
    rateTab(tab3, 4);
    const top = getTopRated(4);
    expect(top.length).toBe(2);
    expect(top[0].rating).toBeGreaterThanOrEqual(4);
  });
});

describe('ratingSummary', () => {
  it('computes average and counts', () => {
    rateTab(tab1, 4);
    rateTab(tab2, 2);
    const summary = ratingSummary([tab1, tab2, tab3]);
    expect(summary.rated).toBe(2);
    expect(summary.unrated).toBe(1);
    expect(summary.averageRating).toBe(3);
  });
  it('returns null average when none rated', () => {
    expect(ratingSummary([tab1]).averageRating).toBeNull();
  });
});
