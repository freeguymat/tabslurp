// tabAnnotator.js — attach inline annotations to tabs

const annotations = {};

function getAnnotationKey(tab) {
  return tab.url;
}

function annotateTab(tab, text) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  if (typeof text !== 'string' || text.trim() === '') throw new Error('Annotation text must be a non-empty string');
  const key = getAnnotationKey(tab);
  if (!annotations[key]) annotations[key] = [];
  const entry = { text: text.trim(), createdAt: Date.now() };
  annotations[key].push(entry);
  return entry;
}

function getAnnotations(tab) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  return annotations[getAnnotationKey(tab)] || [];
}

function removeAnnotation(tab, index) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  const key = getAnnotationKey(tab);
  const list = annotations[key];
  if (!list || index < 0 || index >= list.length) throw new Error('Annotation index out of range');
  return list.splice(index, 1)[0];
}

function clearAnnotations(tab) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  const key = getAnnotationKey(tab);
  const removed = annotations[key] || [];
  delete annotations[key];
  return removed;
}

function annotateTabsBulk(tabs, text) {
  return tabs.map(tab => ({ tab, annotation: annotateTab(tab, text) }));
}

function getAnnotationSummary() {
  const keys = Object.keys(annotations);
  return {
    totalUrls: keys.length,
    totalAnnotations: keys.reduce((sum, k) => sum + annotations[k].length, 0)
  };
}

module.exports = {
  annotateTab,
  getAnnotations,
  removeAnnotation,
  clearAnnotations,
  annotateTabsBulk,
  getAnnotationSummary
};
