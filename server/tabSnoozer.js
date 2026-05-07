// tabSnoozer.js — snooze tabs to resurface them later

const snoozed = new Map();

function getSnoozedKey(tab) {
  return tab.url;
}

function snoozeTab(tab, wakeAt) {
  if (!tab || !tab.url) throw new Error('Invalid tab');
  if (!wakeAt || isNaN(new Date(wakeAt).getTime())) {
    throw new Error('Invalid wakeAt timestamp');
  }
  const key = getSnoozedKey(tab);
  const entry = {
    tab,
    wakeAt: new Date(wakeAt).toISOString(),
    snoozedAt: new Date().toISOString(),
  };
  snoozed.set(key, entry);
  return entry;
}

function unsnoozeTab(url) {
  if (!snoozed.has(url)) return null;
  const entry = snoozed.get(url);
  snoozed.delete(url);
  return entry;
}

function isSnoozed(url) {
  return snoozed.has(url);
}

function getSnoozedTabs() {
  return Array.from(snoozed.values());
}

function getAwokenTabs(now = new Date()) {
  const nowTime = new Date(now).getTime();
  return Array.from(snoozed.values()).filter(
    (entry) => new Date(entry.wakeAt).getTime() <= nowTime
  );
}

function clearSnoozed() {
  snoozed.clear();
}

function getSnoozeSummary() {
  const all = getSnoozedTabs();
  const awoken = getAwokenTabs();
  return {
    total: all.length,
    awoken: awoken.length,
    pending: all.length - awoken.length,
  };
}

module.exports = {
  snoozeTab,
  unsnoozeTab,
  isSnoozed,
  getSnoozedTabs,
  getAwokenTabs,
  clearSnoozed,
  getSnoozeSummary,
};
