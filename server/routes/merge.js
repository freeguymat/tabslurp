// routes/merge.js - POST /api/merge
const express = require('express');
const router = express.Router();
const { mergeTabLists, mergeAndDeduplicate, mergeByWindow, mergeSummary } = require('../tabMerger');
const { validateTabsPayload } = require('../tabValidator');

// POST /api/merge
// Body: { lists: [[...tabs], [...tabs]], deduplicate?: bool, byWindow?: bool }
router.post('/', (req, res) => {
  const { lists, deduplicate = false, byWindow = false } = req.body;

  if (!Array.isArray(lists) || lists.length < 2) {
    return res.status(400).json({ error: 'lists must be an array of at least 2 tab arrays' });
  }

  for (let i = 0; i < lists.length; i++) {
    if (!Array.isArray(lists[i])) {
      return res.status(400).json({ error: `lists[${i}] is not an array` });
    }
    const validation = validateTabsPayload({ tabs: lists[i] });
    if (!validation.valid) {
      return res.status(400).json({ error: `lists[${i}] invalid: ${validation.error}` });
    }
  }

  let result;
  if (byWindow) {
    result = mergeByWindow(lists);
  } else if (deduplicate) {
    result = mergeAndDeduplicate(...lists);
  } else {
    result = mergeTabLists(...lists);
  }

  const summary = mergeSummary(...lists);

  return res.json({
    tabs: result,
    count: result.length,
    summary
  });
});

module.exports = router;
