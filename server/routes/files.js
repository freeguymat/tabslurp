const express = require('express');
const router = express.Router();
const { listExportedFiles, DEFAULT_OUTPUT_DIR } = require('../fileWriter');
const fs = require('fs');
const path = require('path');

/**
 * Resolves and validates that a filename is safely within the output directory.
 * Returns the full file path, or null if the path would escape the directory.
 */
function resolveSafePath(outputDir, filename) {
  const safeName = path.basename(filename);
  const filePath = path.join(path.resolve(outputDir), safeName);
  if (!filePath.startsWith(path.resolve(outputDir))) {
    return null;
  }
  return filePath;
}

// GET /files — list all exported markdown files
router.get('/', (req, res) => {
  try {
    const outputDir = req.query.dir || DEFAULT_OUTPUT_DIR;
    const files = listExportedFiles(outputDir);
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /files/:filename — download a specific exported file
router.get('/:filename', (req, res) => {
  try {
    const outputDir = req.query.dir || DEFAULT_OUTPUT_DIR;
    const filePath = resolveSafePath(outputDir, req.params.filename);

    if (!filePath) {
      return res.status(400).json({ success: false, error: 'Invalid filename' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    const safeName = path.basename(filePath);
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.send(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /files/:filename — delete an exported file
router.delete('/:filename', (req, res) => {
  try {
    const outputDir = req.query.dir || DEFAULT_OUTPUT_DIR;
    const filePath = resolveSafePath(outputDir, req.params.filename);

    if (!filePath) {
      return res.status(400).json({ success: false, error: 'Invalid filename' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    const safeName = path.basename(filePath);
    fs.unlinkSync(filePath);
    res.json({ success: true, message: `Deleted ${safeName}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
