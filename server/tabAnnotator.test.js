const {
  annotateTab,
  getAnnotations,
  removeAnnotation,
  clearAnnotations,
  annotateTabsBulk,
  getAnnotationSummary
} = require('./tabAnnotator');

const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://other.com', title: 'Other' };

beforeEach(() => {
  clearAnnotations(tab1);
  clearAnnotations(tab2);
});

test('annotateTab adds an annotation', () => {
  const result = annotateTab(tab1, 'Read later');
  expect(result.text).toBe('Read later');
  expect(result.createdAt).toBeDefined();
});

test('getAnnotations returns all annotations for a tab', () => {
  annotateTab(tab1, 'First note');
  annotateTab(tab1, 'Second note');
  const list = getAnnotations(tab1);
  expect(list).toHaveLength(2);
  expect(list[0].text).toBe('First note');
});

test('getAnnotations returns empty array for unannotated tab', () => {
  expect(getAnnotations(tab2)).toEqual([]);
});

test('removeAnnotation removes by index', () => {
  annotateTab(tab1, 'Keep');
  annotateTab(tab1, 'Delete me');
  removeAnnotation(tab1, 1);
  const list = getAnnotations(tab1);
  expect(list).toHaveLength(1);
  expect(list[0].text).toBe('Keep');
});

test('removeAnnotation throws on bad index', () => {
  annotateTab(tab1, 'Only one');
  expect(() => removeAnnotation(tab1, 5)).toThrow('out of range');
});

test('clearAnnotations removes all for tab', () => {
  annotateTab(tab1, 'a');
  annotateTab(tab1, 'b');
  const removed = clearAnnotations(tab1);
  expect(removed).toHaveLength(2);
  expect(getAnnotations(tab1)).toEqual([]);
});

test('annotateTabsBulk annotates multiple tabs', () => {
  const results = annotateTabsBulk([tab1, tab2], 'bulk note');
  expect(results).toHaveLength(2);
  expect(results[0].annotation.text).toBe('bulk note');
});

test('annotateTab throws on empty text', () => {
  expect(() => annotateTab(tab1, '  ')).toThrow('non-empty string');
});

test('getAnnotationSummary returns correct counts', () => {
  annotateTab(tab1, 'x');
  annotateTab(tab1, 'y');
  annotateTab(tab2, 'z');
  const summary = getAnnotationSummary();
  expect(summary.totalUrls).toBeGreaterThanOrEqual(2);
  expect(summary.totalAnnotations).toBeGreaterThanOrEqual(3);
});
