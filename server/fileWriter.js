const fs = require('fs');
const path = require('path');

const DEFAULT_OUTPUT_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'tabslurp');

function ensureOutputDir(outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

function generateFilename(prefix = 'tabs') {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10);
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  return `${prefix}-${datePart}-${timePart}.md`;
}

function writeMarkdownFile(content, options = {}) {
  const outputDir = options.outputDir || DEFAULT_OUTPUT_DIR;
  const filename = options.filename || generateFilename(options.prefix);
  const filePath = path.join(outputDir, filename);

  ensureOutputDir(outputDir);
  fs.writeFileSync(filePath, content, 'utf8');

  return { filePath, filename };
}

function listExportedFiles(outputDir = DEFAULT_OUTPUT_DIR) {
  if (!fs.existsSync(outputDir)) {
    return [];
  }
  return fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      filename: f,
      filePath: path.join(outputDir, f),
      createdAt: fs.statSync(path.join(outputDir, f)).birthtime,
    }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

module.exports = { writeMarkdownFile, generateFilename, ensureOutputDir, listExportedFiles, DEFAULT_OUTPUT_DIR };
