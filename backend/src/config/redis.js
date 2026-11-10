const Redis = require('ioredis');
require('dotenv').config();

let redis = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) {
        return null;
      }
      return Math.min(times * 100, 1000);
    }
  });

  redis.connect().catch((err) => {
    console.warn('Redis connection failed. Running without cache:', err.message);
  });

  redis.on('error', (err) => {
    console.warn('Redis error:', err.message);
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });
} catch (err) {
  console.warn('Could not initialize Redis client:', err.message);
  redis = null;
}

module.exports = redis;
