const {
  getSessionKey,
  saveSession,
  getSession,
  listSessions,
  deleteSession,
  restoreSession,
  clearAllSessions,
} = require('./tabSessionManager');

const sampleTabs = [
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'MDN', url: 'https://developer.mozilla.org' },
];

beforeEach(() => clearAllSessions());

describe('getSessionKey', () => {
  it('lowercases and hyphenates the name', () => {
    expect(getSessionKey('My Work Stuff')).toBe('my-work-stuff');
  });

  it('trims whitespace', () => {
    expect(getSessionKey('  research  ')).toBe('research');
  });
});

describe('saveSession', () => {
  it('saves a session and returns it', () => {
    const result = saveSession('Work', sampleTabs);
    expect(result.name).toBe('Work');
    expect(result.tabs).toHaveLength(2);
    expect(result.savedAt).toBeDefined();
  });

  it('throws if name is empty', () => {
    expect(() => saveSession('', sampleTabs)).toThrow();
  });

  it('throws if tabs is empty array', () => {
    expect(() => saveSession('Work', [])).toThrow();
  });
});

describe('getSession', () => {
  it('retrieves a saved session by name', () => {
    saveSession('Research', sampleTabs);
    const session = getSession('Research');
    expect(session).not.toBeNull();
    expect(session.name).toBe('Research');
  });

  it('returns null for unknown session', () => {
    expect(getSession('nope')).toBeNull();
  });
});

describe('listSessions', () => {
  it('returns summary of all sessions', () => {
    saveSession('Alpha', sampleTabs);
    saveSession('Beta', sampleTabs);
    const list = listSessions();
    expect(list).toHaveLength(2);
    expect(list[0]).toHaveProperty('tabCount', 2);
  });
});

describe('deleteSession', () => {
  it('deletes an existing session', () => {
    saveSession('Temp', sampleTabs);
    expect(deleteSession('Temp')).toBe(true);
    expect(getSession('Temp')).toBeNull();
  });

  it('returns false for unknown session', () => {
    expect(deleteSession('ghost')).toBe(false);
  });
});

describe('restoreSession', () => {
  it('returns tabs and metadata for restore', () => {
    saveSession('Work', sampleTabs);
    const restored = restoreSession('Work');
    expect(restored.tabs).toHaveLength(2);
    expect(restored.restoredAt).toBeDefined();
  });

  it('returns null for missing session', () => {
    expect(restoreSession('missing')).toBeNull();
  });
});
