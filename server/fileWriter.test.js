const fs = require('fs');
const path = require('path');
const os = require('os');
const { writeMarkdownFile, generateFilename, listExportedFiles, ensureOutputDir } = require('./fileWriter');

describe('generateFilename', () => {
  it('should return a string ending in .md', () => {
    const name = generateFilename();
    expect(name).toMatch(/\.md$/);
  });

  it('should include the prefix', () => {
    const name = generateFilename('mytabs');
    expect(name).toMatch(/^mytabs-/);
  });

  it('should default prefix to tabs', () => {
    const name = generateFilename();
    expect(name).toMatch(/^tabs-/);
  });
});

describe('writeMarkdownFile', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabslurp-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should write content to a file', () => {
    const content = '# My Tabs\n- [Example](https://example.com)';
    const { filePath } = writeMarkdownFile(content, { outputDir: tmpDir });
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, 'utf8')).toBe(content);
  });

  it('should create outputDir if it does not exist', () => {
    const newDir = path.join(tmpDir, 'nested', 'output');
    writeMarkdownFile('# test', { outputDir: newDir });
    expect(fs.existsSync(newDir)).toBe(true);
  });

  it('should return filename and filePath', () => {
    const result = writeMarkdownFile('# test', { outputDir: tmpDir });
    expect(result).toHaveProperty('filePath');
    expect(result).toHaveProperty('filename');
  });
});

describe('listExportedFiles', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabslurp-list-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should return empty array if dir does not exist', () => {
    expect(listExportedFiles('/nonexistent/path/xyz')).toEqual([]);
  });

  it('should list only .md files', () => {
    fs.writeFileSync(path.join(tmpDir, 'tabs.md'), '# test');
    fs.writeFileSync(path.join(tmpDir, 'notes.txt'), 'ignore me');
    const files = listExportedFiles(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0].filename).toBe('tabs.md');
  });
});
