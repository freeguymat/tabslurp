const express = require('express');
const router = express.Router();
const { listExportedFiles, DEFAULT_OUTPUT_DIR } = require('../fileWriter');
const fs = require('fs');
const path = require('path');

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
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(outputDir, safeName);

    if (!filePath.startsWith(outputDir)) {
      return res.status(400).json({ success: false, error: 'Invalid filename' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

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
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(outputDir, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: `Deleted ${safeName}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
