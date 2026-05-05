/**
 * Validates tab data received from the browser extension
 */

const REQUIRED_FIELDS = ['title', 'url'];
const MAX_TABS = 500;
const VALID_PROTOCOLS = ['http:', 'https:', 'file:'];

function validateTab(tab) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!tab[field] || typeof tab[field] !== 'string' || tab[field].trim() === '') {
      errors.push(`Missing or invalid field: ${field}`);
    }
  }

  if (tab.url) {
    try {
      const parsed = new URL(tab.url);
      if (!VALID_PROTOCOLS.includes(parsed.protocol)) {
        errors.push(`Unsupported protocol: ${parsed.protocol}`);
      }
    } catch {
      errors.push(`Invalid URL: ${tab.url}`);
    }
  }

  if (tab.windowId !== undefined && typeof tab.windowId !== 'number') {
    errors.push('windowId must be a number');
  }

  if (tab.pinned !== undefined && typeof tab.pinned !== 'boolean') {
    errors.push('pinned must be a boolean');
  }

  return errors;
}

function validateTabsPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload must be an object'] };
  }

  if (!Array.isArray(payload.tabs)) {
    return { valid: false, errors: ['tabs must be an array'] };
  }

  if (payload.tabs.length === 0) {
    return { valid: false, errors: ['tabs array cannot be empty'] };
  }

  if (payload.tabs.length > MAX_TABS) {
    return { valid: false, errors: [`Too many tabs: max is ${MAX_TABS}`] };
  }

  const allErrors = [];
  payload.tabs.forEach((tab, index) => {
    const tabErrors = validateTab(tab);
    tabErrors.forEach(err => allErrors.push(`Tab ${index}: ${err}`));
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors
  };
}

module.exports = { validateTab, validateTabsPayload };
