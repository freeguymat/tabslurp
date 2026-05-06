const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
const exportRouter = require('./routes/export');
const filesRouter = require('./routes/files');
const sortRouter = require('./routes/sort');
const filterRouter = require('./routes/filter');

app.use('/export', exportRouter);
app.use('/files', filesRouter);
app.use('/sort', sortRouter);
app.use('/filter', filterRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TabSlurp server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
