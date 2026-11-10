const redis = require('../config/redis');

const DEFAULT_TTL = 300;

async function getCache(key) {
  if (!redis || redis.status !== 'ready') return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`Redis get error for key ${key}:`, err.message);
    return null;
  }
}

async function setCache(key, value, ttl = DEFAULT_TTL) {
  if (!redis || redis.status !== 'ready') return false;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
    return true;
  } catch (err) {
    console.warn(`Redis set error for key ${key}:`, err.message);
    return false;
  }
}

async function deleteCache(key) {
  if (!redis || redis.status !== 'ready') return false;
  try {
    await redis.del(key);
    return true;
  } catch (err) {
    console.warn(`Redis delete error for key ${key}:`, err.message);
    return false;
  }
}

async function clearPattern(pattern) {
  if (!redis || redis.status !== 'ready') return false;
  try {
    const keys = await redis.keys(pattern);
    if (keys && keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (err) {
    console.warn(`Redis clear pattern error for ${pattern}:`, err.message);
    return false;
  }
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  clearPattern
};
