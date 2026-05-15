// tabSessionManager.js — save and restore named tab sessions

const sessions = {};

function getSessionKey(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function saveSession(name, tabs) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Session name is required');
  }
  if (!Array.isArray(tabs) || tabs.length === 0) {
    throw new Error('Tabs must be a non-empty array');
  }
  const key = getSessionKey(name);
  sessions[key] = {
    name: name.trim(),
    tabs,
    savedAt: new Date().toISOString(),
  };
  return sessions[key];
}

function getSession(name) {
  const key = getSessionKey(name);
  return sessions[key] || null;
}

function listSessions() {
  return Object.values(sessions).map(({ name, savedAt, tabs }) => ({
    name,
    savedAt,
    tabCount: tabs.length,
  }));
}

function deleteSession(name) {
  const key = getSessionKey(name);
  if (!sessions[key]) return false;
  delete sessions[key];
  return true;
}

function restoreSession(name) {
  const session = getSession(name);
  if (!session) return null;
  return {
    name: session.name,
    tabs: session.tabs,
    restoredAt: new Date().toISOString(),
  };
}

function clearAllSessions() {
  Object.keys(sessions).forEach(k => delete sessions[k]);
}

module.exports = {
  getSessionKey,
  saveSession,
  getSession,
  listSessions,
  deleteSession,
  restoreSession,
  clearAllSessions,
};
