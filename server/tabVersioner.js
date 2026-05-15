// tabVersioner.js — track version snapshots of tab lists over time

const snapshots = {};

function getVersionKey(name) {
  return `version:${name}`;
}

function createSnapshot(name, tabs) {
  if (!name || typeof name !== 'string') throw new Error('Snapshot name required');
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');

  const key = getVersionKey(name);
  if (!snapshots[key]) snapshots[key] = [];

  const version = {
    version: snapshots[key].length + 1,
    createdAt: new Date().toISOString(),
    tabCount: tabs.length,
    tabs: tabs.map(t => ({ ...t }))
  };

  snapshots[key].push(version);
  return version;
}

function getSnapshots(name) {
  const key = getVersionKey(name);
  return snapshots[key] || [];
}

function getSnapshot(name, version) {
  const list = getSnapshots(name);
  return list.find(s => s.version === version) || null;
}

function getLatestSnapshot(name) {
  const list = getSnapshots(name);
  return list.length ? list[list.length - 1] : null;
}

function deleteSnapshot(name, version) {
  const key = getVersionKey(name);
  if (!snapshots[key]) return false;
  const before = snapshots[key].length;
  snapshots[key] = snapshots[key].filter(s => s.version !== version);
  return snapshots[key].length < before;
}

function clearSnapshots(name) {
  const key = getVersionKey(name);
  delete snapshots[key];
}

function versionSummary(name) {
  const list = getSnapshots(name);
  return {
    name,
    totalVersions: list.length,
    latest: list.length ? list[list.length - 1].version : null,
    oldest: list.length ? list[0].createdAt : null
  };
}

module.exports = {
  createSnapshot,
  getSnapshots,
  getSnapshot,
  getLatestSnapshot,
  deleteSnapshot,
  clearSnapshots,
  versionSummary
};
