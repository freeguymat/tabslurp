// Tracks export history in memory (could be persisted to disk in future)
const exportHistory = [];

/**
 * Record a new export event
 * @param {Object} entry - { filename, tabCount, timestamp, filters, groupBy }
 */
function recordExport(entry) {
  const record = {
    id: exportHistory.length + 1,
    filename: entry.filename || null,
    tabCount: entry.tabCount || 0,
    timestamp: entry.timestamp || new Date().toISOString(),
    filters: entry.filters || null,
    groupBy: entry.groupBy || null,
  };
  exportHistory.push(record);
  return record;
}

/**
 * Get all export history entries
 */
function getHistory() {
  return [...exportHistory];
}

/**
 * Get the most recent N export entries
 * @param {number} limit
 */
function getRecentHistory(limit = 10) {
  return exportHistory.slice(-limit).reverse();
}

/**
 * Clear all history
 */
function clearHistory() {
  exportHistory.length = 0;
}

/**
 * Get a summary: total exports, total tabs exported
 */
function getHistorySummary() {
  const totalExports = exportHistory.length;
  const totalTabs = exportHistory.reduce((sum, e) => sum + e.tabCount, 0);
  const lastExport = exportHistory.length > 0
    ? exportHistory[exportHistory.length - 1].timestamp
    : null;
  return { totalExports, totalTabs, lastExport };
}

module.exports = { recordExport, getHistory, getRecentHistory, clearHistory, getHistorySummary };
