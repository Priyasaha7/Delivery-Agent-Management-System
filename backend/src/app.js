const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');
const redis = require('./config/redis');
const agentRoutes = require('./routes/agentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  let dbStatus = 'ok';
  let dbError = null;

  try {
    await pool.query('SELECT 1');
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message;
  }

  res.json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    service: 'delivery-agent-api',
    database: {
      status: dbStatus,
      error: dbError
    },
    redis: {
      status: redis && redis.status === 'ready' ? 'ready' : (redis ? redis.status : 'disabled')
    },
    timestamp: new Date().toISOString()
  });
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
