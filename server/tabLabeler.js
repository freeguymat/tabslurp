// Assign and manage custom labels (categories) for tabs

const labels = new Map();

function getLabelKey(tab) {
  return tab.url;
}

function addLabel(tab, label) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  if (!label || typeof label !== 'string') throw new Error('Label must be a non-empty string');
  const key = getLabelKey(tab);
  const existing = labels.get(key) || [];
  if (!existing.includes(label)) {
    existing.push(label);
    labels.set(key, existing);
  }
  return existing;
}

function removeLabel(tab, label) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  const key = getLabelKey(tab);
  const existing = labels.get(key) || [];
  const updated = existing.filter(l => l !== label);
  if (updated.length > 0) {
    labels.set(key, updated);
  } else {
    labels.delete(key);
  }
  return updated;
}

function getLabelsForTab(tab) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  return labels.get(getLabelKey(tab)) || [];
}

function labelTabs(tabs, label) {
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');
  return tabs.map(tab => ({
    ...tab,
    labels: addLabel(tab, label)
  }));
}

function filterByLabel(tabs, label) {
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');
  return tabs.filter(tab => {
    const tabLabels = labels.get(getLabelKey(tab)) || [];
    return tabLabels.includes(label);
  });
}

function clearLabels() {
  labels.clear();
}

function getAllLabels() {
  const all = new Set();
  for (const lblList of labels.values()) {
    lblList.forEach(l => all.add(l));
  }
  return Array.from(all);
}

module.exports = { addLabel, removeLabel, getLabelsForTab, labelTabs, filterByLabel, clearLabels, getAllLabels };
