import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { authLimiter } from '../src/middleware/rateLimit.js';

test('authentication limiter rejects requests after its configured limit', async () => {
  const app = express();
  app.post('/login', authLimiter, (req, res) => {
    res.status(200).json({ success: true });
  });

  let finalStatus = 200;

  for (let attempt = 0; attempt < 21; attempt += 1) {
    const response = await request(app).post('/login');
    finalStatus = response.status;
  }

  assert.equal(finalStatus, 429);
});
