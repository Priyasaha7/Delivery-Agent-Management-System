const { pool } = require('../config/db');
const { getCache, setCache, deleteCache, clearPattern } = require('../utils/cache');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateAgentInput(data, isUpdate = false) {
  const errors = [];
  const { full_name, phone, email, service_area, status } = data;

  if (!isUpdate || full_name !== undefined) {
    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
      errors.push('Full name is required');
    }
  }

  if (!isUpdate || phone !== undefined) {
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      errors.push('Phone number is required');
    }
  }

  if (!isUpdate || email !== undefined) {
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('A valid email address is required');
    }
  }

  if (!isUpdate || service_area !== undefined) {
    if (!service_area || typeof service_area !== 'string' || !service_area.trim()) {
      errors.push('Service area is required');
    }
  }

  if (status !== undefined) {
    if (!['active', 'inactive'].includes(status)) {
      errors.push("Status must be either 'active' or 'inactive'");
    }
  }

  return errors;
}

async function invalidateAgentCaches(agentId = null) {
  await clearPattern('agents:list*');
  await deleteCache('agents:stats');
  if (agentId) {
    await deleteCache(`agent:${agentId}`);
  }
}

async function getAgents(req, res) {
  try {
    const { status, service_area, search } = req.query;

    const cacheKey = `agents:list:${status || 'all'}:${service_area || 'all'}:${search || 'none'}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json({ success: true, count: cached.length, data: cached, cached: true });
    }

    let query = 'SELECT * FROM agents WHERE 1=1';
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (service_area) {
      params.push(`%${service_area.trim()}%`);
      query += ` AND service_area ILIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search.trim()}%`);
      query += ` AND (full_name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length} OR service_area ILIKE $${params.length})`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    await setCache(cacheKey, result.rows, 300);

    res.setHeader('X-Cache', 'MISS');
    return res.json({ success: true, count: result.rows.length, data: result.rows, cached: false });
  } catch (error) {
    console.error('getAgents error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error while fetching agents' });
  }
}

async function getAgentById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid agent ID format' });
    }

    const cacheKey = `agent:${id}`;
    const cached = await getCache(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json({ success: true, data: cached, cached: true });
    }

    const result = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Agent with ID ${id} not found` });
    }

    const agent = result.rows[0];
    await setCache(cacheKey, agent, 600);

    res.setHeader('X-Cache', 'MISS');
    return res.json({ success: true, data: agent, cached: false });
  } catch (error) {
    console.error('getAgentById error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error while fetching agent' });
  }
}

async function createAgent(req, res) {
  try {
    const errors = validateAgentInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const { full_name, phone, email, service_area, status = 'active' } = req.body;

    const existing = await pool.query('SELECT id FROM agents WHERE email = $1', [email.trim().toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'An agent with this email address already exists' });
    }

    const insertQuery = `
      INSERT INTO agents (full_name, phone, email, service_area, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      full_name.trim(),
      phone.trim(),
      email.trim().toLowerCase(),
      service_area.trim(),
      status
    ]);

    const newAgent = result.rows[0];
    await invalidateAgentCaches(newAgent.id);

    return res.status(201).json({
      success: true,
      message: 'Delivery agent created successfully',
      data: newAgent
    });
  } catch (error) {
    console.error('createAgent error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error while creating agent' });
  }
}

async function updateAgent(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid agent ID format' });
    }

    const existingAgent = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);
    if (existingAgent.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Agent with ID ${id} not found` });
    }

    const errors = validateAgentInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const current = existingAgent.rows[0];
    const full_name = req.body.full_name !== undefined ? req.body.full_name.trim() : current.full_name;
    const phone = req.body.phone !== undefined ? req.body.phone.trim() : current.phone;
    const email = req.body.email !== undefined ? req.body.email.trim().toLowerCase() : current.email;
    const service_area = req.body.service_area !== undefined ? req.body.service_area.trim() : current.service_area;
    const status = req.body.status !== undefined ? req.body.status : current.status;

    if (email !== current.email) {
      const emailCheck = await pool.query('SELECT id FROM agents WHERE email = $1 AND id != $2', [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ success: false, error: 'An agent with this email address already exists' });
      }
    }

    const updateQuery = `
      UPDATE agents
      SET full_name = $1, phone = $2, email = $3, service_area = $4, status = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [full_name, phone, email, service_area, status, id]);
    const updatedAgent = result.rows[0];

    await invalidateAgentCaches(id);

    return res.json({
      success: true,
      message: 'Delivery agent updated successfully',
      data: updatedAgent
    });
  } catch (error) {
    console.error('updateAgent error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error while updating agent' });
  }
}

async function deleteAgent(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid agent ID format' });
    }

    const existingAgent = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);
    if (existingAgent.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Agent with ID ${id} not found` });
    }

    await pool.query('DELETE FROM agents WHERE id = $1', [id]);
    await invalidateAgentCaches(id);

    return res.json({
      success: true,
      message: `Delivery agent with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('deleteAgent error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error while deleting agent' });
  }
}

async function getStats(req, res) {
  try {
    const cacheKey = 'agents:stats';
    const cached = await getCache(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json({ success: true, data: cached, cached: true });
    }

    const statsQuery = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'active')::int AS active,
        COUNT(*) FILTER (WHERE status = 'inactive')::int AS inactive,
        COUNT(DISTINCT service_area)::int AS areas
      FROM agents
    `;

    const result = await pool.query(statsQuery);
    const stats = result.rows[0];

    await setCache(cacheKey, stats, 300);

    res.setHeader('X-Cache', 'MISS');
    return res.json({ success: true, data: stats, cached: false });
  } catch (error) {
    console.error('getStats error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal server error while fetching statistics' });
  }
}

module.exports = {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  getStats
};
