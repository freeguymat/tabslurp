const express = require('express');
const router = express.Router();
const { validateTabsPayload } = require('../tabValidator');
const { truncateTabs, truncationSummary } = require('../tabTruncator');

// POST /truncate
// Body: { tabs: [...], options: { titleMax, urlMax } }
router.post('/', (req, res) => {
  const { tabs, options = {} } = req.body;

  const validation = validateTabsPayload(tabs);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { titleMax, urlMax } = options;
  const truncateOptions = {};

  if (titleMax !== undefined) {
    const parsed = parseInt(titleMax, 10);
    if (isNaN(parsed) || parsed < 10) {
      return res.status(400).json({ error: 'titleMax must be a number >= 10' });
    }
    truncateOptions.titleMax = parsed;
  }

  if (urlMax !== undefined) {
    const parsed = parseInt(urlMax, 10);
    if (isNaN(parsed) || parsed < 10) {
      return res.status(400).json({ error: 'urlMax must be a number >= 10' });
    }
    truncateOptions.urlMax = parsed;
  }

  const truncated = truncateTabs(tabs, truncateOptions);
  const summary = truncationSummary(truncated);

  res.json({
    tabs: truncated,
    summary,
  });
});

module.exports = router;
