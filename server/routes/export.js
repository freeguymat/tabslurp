const express = require('express');
const fs = require('fs');
const path = require('path');
const { formatTabsAsMarkdown } = require('../tabFormatter');

const router = express.Router();

/**
 * POST /export
 * Body: { tabs: Array<{title, url}>, options?: { groupByDomain, title } }
 * Saves a markdown file and returns its path + preview.
 */
router.post('/', (req, res) => {
  const { tabs, options = {} } = req.body;

  if (!Array.isArray(tabs) || tabs.length === 0) {
    return res.status(400).json({ error: 'tabs must be a non-empty array' });
  }

  for (const tab of tabs) {
    if (typeof tab.url !== 'string' || !tab.url.startsWith('http')) {
      return res.status(400).json({ error: `invalid tab url: ${tab.url}` });
    }
  }

  let markdown;
  try {
    markdown = formatTabsAsMarkdown(tabs, options);
  } catch (err) {
    return res.status(500).json({ error: 'failed to format tabs', detail: err.message });
  }

  const outputDir = path.resolve(__dirname, '../../exports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `tabs-${Date.now()}.md`;
  const filepath = path.join(outputDir, filename);

  try {
    fs.writeFileSync(filepath, markdown, 'utf8');
  } catch (err) {
    return res.status(500).json({ error: 'failed to write file', detail: err.message });
  }

  return res.status(201).json({
    message: 'Export successful',
    filename,
    filepath,
    tabCount: tabs.length,
    preview: markdown.slice(0, 300),
  });
});

module.exports = router;
