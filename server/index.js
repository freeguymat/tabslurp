const express = require('express');
const cors = require('cors');

const exportRouter = require('./routes/export');
const filesRouter = require('./routes/files');

const PORT = process.env.PORT || 57327;

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0' });
});

app.use('/export', exportRouter);
app.use('/files', filesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('[tabslurp error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`tabslurp server running on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;
