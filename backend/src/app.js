const express = require('express');
const cors = require('cors');
const agentRoutes = require('./routes/agentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'delivery-agent-api', timestamp: new Date().toISOString() });
});

app.use('/api/agents', agentRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err);
  res.status(500).json({ success: false, error: 'An unexpected error occurred' });
});

module.exports = app;
