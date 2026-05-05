# tabslurp

> Browser extension + local server to export and organize open tabs into markdown.

## Installation

```bash
npm install -g tabslurp
tabslurp install-extension
```

## Usage

Start the local server, then click the tabslurp icon in your browser to export your open tabs.

```bash
tabslurp start
```

This will launch a local server on `http://localhost:9876`. Open the browser extension, choose your tabs, and hit **Slurp**. Your tabs are saved as a markdown file:

```markdown
# Tabs — 2024-06-10 14:32

- [GitHub - tabslurp](https://github.com/you/tabslurp)
- [MDN Web Docs: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Hacker News](https://news.ycombinator.com)
```

Output files are saved to `~/tabslurp/` by default. You can configure the output directory:

```bash
tabslurp start --output ~/notes/tabs
```

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `--port` | `9876` | Port for the local server |
| `--output` | `~/tabslurp` | Directory for exported markdown files |
| `--group` | `false` | Group tabs by domain |

## Browser Support

- Chrome / Chromium
- Firefox
- Edge

## License

[MIT](LICENSE)