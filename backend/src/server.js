require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('./app');
const { pool } = require('./config/db');
const redis = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function autoMigrate() {
  try {
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('Database schema verified');

    const countRes = await pool.query('SELECT COUNT(*)::int AS total FROM agents');
    if (countRes.rows[0].total === 0) {
      const sampleAgents = [
        ['Rahul Sharma', '+91 98765 43210', 'rahul.sharma@example.com', 'North Delhi', 'active'],
        ['Priya Patel', '+91 98765 43211', 'priya.patel@example.com', 'South Mumbai', 'active'],
        ['Amit Kumar', '+91 98765 43212', 'amit.kumar@example.com', 'East Bengaluru', 'inactive'],
        ['Sneha Rao', '+91 98765 43213', 'sneha.rao@example.com', 'Central Pune', 'active'],
        ['Vikram Singh', '+91 98765 43214', 'vikram.singh@example.com', 'West Hyderabad', 'active']
      ];

      for (const [name, phone, email, area, status] of sampleAgents) {
        await pool.query(
          `INSERT INTO agents (full_name, phone, email, service_area, status)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) DO NOTHING`,
          [name, phone, email, area, status]
        );
      }
      console.log('Initial sample agents seeded successfully');
    }
  } catch (err) {
    console.warn('Database initialization note:', err.message);
  }
}

const server = app.listen(PORT, async () => {
  console.log(`Delivery Agent API server running on port ${PORT}`);
  await autoMigrate();
});

async function gracefulShutdown(signal) {
  console.log(`${signal} received: closing HTTP server and resources...`);
  server.close(async () => {
    try {
      await pool.end();
      if (redis && redis.status === 'ready') {
        await redis.quit();
      }
      console.log('Database and cache connections closed cleanly.');
      process.exit(0);
    } catch (err) {
      console.error('Error during graceful shutdown:', err.message);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
