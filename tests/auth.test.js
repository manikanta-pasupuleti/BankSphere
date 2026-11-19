import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { authenticate, authorizeRoles } from '../src/middleware/auth.js';

const secret = 'test-secret';

test('authenticate rejects requests without a bearer token', () => {
  const req = { headers: {} };
  let statusCode;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };

  authenticate(req, res, () => assert.fail('next should not run'));

  assert.equal(statusCode, 401);
});

test('authenticate accepts a valid JWT', () => {
  const token = jwt.sign(
    { userId: 'customer-1', role: 'CUSTOMER' },
    secret
  );
  process.env.JWT_SECRET = secret;

  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {};
  let nextCalled = false;

  authenticate(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(req.user.userId, 'customer-1');
});

test('authorizeRoles rejects customers from admin routes', () => {
  const req = { user: { role: 'CUSTOMER' } };
  let statusCode;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };

  authorizeRoles('ADMIN')(req, res, () => assert.fail('next should not run'));

  assert.equal(statusCode, 403);
});
