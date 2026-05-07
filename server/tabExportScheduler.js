/**
 * tabExportScheduler.js
 * Manages scheduled/recurring tab export jobs.
 * Stores schedule config in memory (could be persisted later).
 */

const { v4: uuidv4 } = require('uuid');

// In-memory schedule store: { [id]: scheduleEntry }
const schedules = {};

/**
 * Valid interval units
 */
const VALID_INTERVALS = ['minutes', 'hours', 'days'];

/**
 * Create a new export schedule entry.
 * @param {object} options
 * @param {string} options.label - Human-readable label for the schedule
 * @param {number} options.intervalValue - Numeric interval amount
 * @param {string} options.intervalUnit - 'minutes' | 'hours' | 'days'
 * @param {object} [options.exportOptions] - Options to pass to the export (filters, sort, etc.)
 * @returns {{ id: string, label: string, intervalValue: number, intervalUnit: string, createdAt: string, lastRun: null|string, enabled: boolean }}
 */
function createSchedule({ label, intervalValue, intervalUnit, exportOptions = {} }) {
  if (!label || typeof label !== 'string') {
    throw new Error('Schedule label is required and must be a string');
  }
  if (!Number.isInteger(intervalValue) || intervalValue < 1) {
    throw new Error('intervalValue must be a positive integer');
  }
  if (!VALID_INTERVALS.includes(intervalUnit)) {
    throw new Error(`intervalUnit must be one of: ${VALID_INTERVALS.join(', ')}`);
  }

  const id = uuidv4();
  const entry = {
    id,
    label: label.trim(),
    intervalValue,
    intervalUnit,
    exportOptions,
    createdAt: new Date().toISOString(),
    lastRun: null,
    enabled: true,
  };
  schedules[id] = entry;
  return entry;
}

/**
 * Get all schedules.
 * @returns {object[]}
 */
function getSchedules() {
  return Object.values(schedules);
}

/**
 * Get a single schedule by ID.
 * @param {string} id
 * @returns {object|null}
 */
function getScheduleById(id) {
  return schedules[id] || null;
}

/**
 * Update a schedule entry (partial update).
 * @param {string} id
 * @param {object} updates
 * @returns {object} Updated schedule
 */
function updateSchedule(id, updates) {
  const entry = schedules[id];
  if (!entry) throw new Error(`Schedule not found: ${id}`);

  if (updates.intervalUnit !== undefined && !VALID_INTERVALS.includes(updates.intervalUnit)) {
    throw new Error(`intervalUnit must be one of: ${VALID_INTERVALS.join(', ')}`);
  }
  if (updates.intervalValue !== undefined && (!Number.isInteger(updates.intervalValue) || updates.intervalValue < 1)) {
    throw new Error('intervalValue must be a positive integer');
  }

  const allowed = ['label', 'intervalValue', 'intervalUnit', 'exportOptions', 'enabled'];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      entry[key] = updates[key];
    }
  }
  return entry;
}

/**
 * Record that a schedule was just run.
 * @param {string} id
 * @returns {object} Updated schedule
 */
function recordRun(id) {
  const entry = schedules[id];
  if (!entry) throw new Error(`Schedule not found: ${id}`);
  entry.lastRun = new Date().toISOString();
  return entry;
}

/**
 * Delete a schedule by ID.
 * @param {string} id
 * @returns {boolean} True if deleted, false if not found
 */
function deleteSchedule(id) {
  if (!schedules[id]) return false;
  delete schedules[id];
  return true;
}

/**
 * Get the next run time for a schedule based on lastRun and interval.
 * @param {object} schedule
 * @returns {Date}
 */
function getNextRunTime(schedule) {
  const base = schedule.lastRun ? new Date(schedule.lastRun) : new Date(schedule.createdAt);
  const ms = intervalToMs(schedule.intervalValue, schedule.intervalUnit);
  return new Date(base.getTime() + ms);
}

/**
 * Convert interval value + unit to milliseconds.
 * @param {number} value
 * @param {string} unit
 * @returns {number}
 */
function intervalToMs(value, unit) {
  const multipliers = { minutes: 60_000, hours: 3_600_000, days: 86_400_000 };
  return value * (multipliers[unit] || 0);
}

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  recordRun,
  deleteSchedule,
  getNextRunTime,
  intervalToMs,
};
