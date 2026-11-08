const request = require('supertest');
const app = require('../src/index');

describe('NoteSprint Health API', () => {
  it('GET /api/health returns 200 with environment status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});

