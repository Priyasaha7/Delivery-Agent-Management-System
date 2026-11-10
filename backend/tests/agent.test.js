const request = require('supertest');

const mockRows = [
  {
    id: 1,
    full_name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    service_area: 'North Delhi',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockQuery = jest.fn();
jest.mock('../src/config/db', () => ({
  pool: {
    query: (...args) => mockQuery(...args),
    on: jest.fn()
  }
}));

const mockRedisStore = new Map();
jest.mock('../src/config/redis', () => ({
  status: 'ready',
  get: jest.fn(async (key) => mockRedisStore.get(key) || null),
  set: jest.fn(async (key, val) => {
    mockRedisStore.set(key, val);
    return 'OK';
  }),
  del: jest.fn(async (...keys) => {
    keys.forEach((k) => mockRedisStore.delete(k));
    return keys.length;
  }),
  keys: jest.fn(async (pattern) => {
    const prefix = pattern.replace('*', '');
    return Array.from(mockRedisStore.keys()).filter((k) => k.startsWith(prefix));
  }),
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue()
}));

const app = require('../src/app');

describe('Delivery Agent API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisStore.clear();
  });

  describe('GET /health', () => {
    it('should return server health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /api/agents', () => {
    it('should fail with 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({ full_name: 'John Doe' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should fail with 400 on invalid email format', async () => {
      const res = await request(app)
        .post('/api/agents')
        .send({
          full_name: 'John Doe',
          phone: '1234567890',
          email: 'invalid-email',
          service_area: 'Central'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with 409 if email already exists', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const res = await request(app)
        .post('/api/agents')
        .send({
          full_name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          email: 'rahul.sharma@example.com',
          service_area: 'North Delhi'
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already exists');
    });

    it('should successfully create a new agent', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockRows[0]] });

      const res = await request(app)
        .post('/api/agents')
        .send({
          full_name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          email: 'rahul.sharma@example.com',
          service_area: 'North Delhi',
          status: 'active'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('rahul.sharma@example.com');
    });
  });

  describe('GET /api/agents', () => {
    it('should return list of agents (cache MISS on first call, HIT on second)', async () => {
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const res1 = await request(app).get('/api/agents');
      expect(res1.status).toBe(200);
      expect(res1.headers['x-cache']).toBe('MISS');
      expect(res1.body.data.length).toBe(1);

      const res2 = await request(app).get('/api/agents');
      expect(res2.status).toBe(200);
      expect(res2.headers['x-cache']).toBe('HIT');
      expect(res2.body.data.length).toBe(1);
    });
  });

  describe('GET /api/agents/:id', () => {
    it('should return 404 when agent is not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/api/agents/999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return agent details by ID', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockRows[0]] });

      const res = await request(app).get('/api/agents/1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(1);
      expect(res.headers['x-cache']).toBe('MISS');
    });
  });

  describe('PUT /api/agents/:id', () => {
    it('should return 404 if updating non-existent agent', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/agents/999')
        .send({ full_name: 'Updated Name' });

      expect(res.status).toBe(404);
    });

    it('should update agent successfully', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [mockRows[0]] })
        .mockResolvedValueOnce({ rows: [{ ...mockRows[0], full_name: 'Rahul Updated' }] });

      const res = await request(app)
        .put('/api/agents/1')
        .send({ full_name: 'Rahul Updated' });

      expect(res.status).toBe(200);
      expect(res.body.data.full_name).toBe('Rahul Updated');
    });
  });

  describe('DELETE /api/agents/:id', () => {
    it('should return 404 if deleting non-existent agent', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).delete('/api/agents/999');
      expect(res.status).toBe(404);
    });

    it('should delete agent and invalidate cache', async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [mockRows[0]] })
        .mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app).delete('/api/agents/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
