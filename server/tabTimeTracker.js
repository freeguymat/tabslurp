// Tracks time spent on tabs based on visit timestamps

const store = {};

function getTrackingKey(url) {
  return `track:${url}`;
}

function startTracking(tab) {
  if (!tab || !tab.url) return null;
  const key = getTrackingKey(tab.url);
  const entry = {
    url: tab.url,
    title: tab.title || '',
    startedAt: Date.now(),
    totalMs: store[key]?.totalMs || 0,
  };
  store[key] = entry;
  return entry;
}

function stopTracking(url) {
  if (!url) return null;
  const key = getTrackingKey(url);
  const entry = store[key];
  if (!entry || !entry.startedAt) return null;
  const elapsed = Date.now() - entry.startedAt;
  entry.totalMs += elapsed;
  entry.startedAt = null;
  return entry;
}

function getTracking(url) {
  if (!url) return null;
  return store[getTrackingKey(url)] || null;
}

function getTotalTime(url) {
  const entry = getTracking(url);
  if (!entry) return 0;
  const live = entry.startedAt ? Date.now() - entry.startedAt : 0;
  return entry.totalMs + live;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function getAllTracking() {
  return Object.values(store).map((entry) => ({
    url: entry.url,
    title: entry.title,
    totalMs: getTotalTime(entry.url),
    formatted: formatDuration(getTotalTime(entry.url)),
    active: !!entry.startedAt,
  }));
}

function clearTracking(url) {
  if (!url) return false;
  const key = getTrackingKey(url);
  if (!store[key]) return false;
  delete store[key];
  return true;
}

module.exports = {
  startTracking,
  stopTracking,
  getTracking,
  getTotalTime,
  formatDuration,
  getAllTracking,
  clearTracking,
};
