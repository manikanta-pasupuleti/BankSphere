#!/usr/bin/env node

/**
 * API Testing Script
 * Run: node scripts/test-api.js
 */

import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: JSON.parse(data)
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => reject(error));

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  log('\n=== Online Banking System - API Tests ===\n', 'cyan');

  try {
    // Test 1: Health Check
    log('Test 1: Health Check', 'blue');
    const health = await request('GET', '/health');
    console.log(`Status: ${health.status}`);
    console.log(JSON.stringify(health.data, null, 2));
    log('✓ Health check passed\n', 'green');

    await sleep(500);

    // Test 2: Create User
    log('Test 2: Create User', 'blue');
    const userPayload = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    };
    const userRes = await request('POST', '/users', userPayload);
    console.log(`Status: ${userRes.status}`);
    console.log(JSON.stringify(userRes.data, null, 2));
    const userId = userRes.data.data.id;
    log(`✓ User created: ${userId}\n`, 'green');

    await sleep(500);

    // Test 3: Get User
    log('Test 3: Get User', 'blue');
    const getUser = await request('GET', `/users/${userId}`);
    console.log(`Status: ${getUser.status}`);
    console.log(JSON.stringify(getUser.data, null, 2));
    log('✓ User retrieved\n', 'green');

    await sleep(500);

    // Test 4: Create Account
    log('Test 4: Create Account', 'blue');
    const accountPayload = {
      userId: userId,
      accountNumber: `ACC${Date.now().toString().slice(-8)}`,
      accountType: 'SAVINGS',
      currency: 'USD'
    };
    const accountRes = await request('POST', '/accounts', accountPayload);
    console.log(`Status: ${accountRes.status}`);
    console.log(JSON.stringify(accountRes.data, null, 2));
    const accountId = accountRes.data.data.id;
    log(`✓ Account created: ${accountId}\n`, 'green');

    await sleep(500);

    // Test 5: Get Account Balance
    log('Test 5: Get Account Balance', 'blue');
    const balance = await request('GET', `/accounts/${accountId}/balance`);
    console.log(`Status: ${balance.status}`);
    console.log(JSON.stringify(balance.data, null, 2));
    log('✓ Balance retrieved\n', 'green');

    await sleep(500);

    // Test 6: Deposit Money
    log('Test 6: Deposit Money', 'blue');
    const depositPayload = {
      accountId: accountId,
      transactionType: 'DEPOSIT',
      amount: '1000.00',
      description: 'Test deposit'
    };
    const depositRes = await request('POST', '/transactions', depositPayload);
    console.log(`Status: ${depositRes.status}`);
    console.log(JSON.stringify(depositRes.data, null, 2));
    const transactionId = depositRes.data.data.id;
    log(`✓ Deposit successful: ${transactionId}\n`, 'green');

    await sleep(500);

    // Test 7: Get Updated Balance
    log('Test 7: Get Updated Balance', 'blue');
    const updatedBalance = await request('GET', `/accounts/${accountId}/balance`);
    console.log(`Status: ${updatedBalance.status}`);
    console.log(JSON.stringify(updatedBalance.data, null, 2));
    log('✓ Balance updated\n', 'green');

    await sleep(500);

    // Test 8: Withdraw Money
    log('Test 8: Withdraw Money', 'blue');
    const withdrawPayload = {
      accountId: accountId,
      transactionType: 'WITHDRAWAL',
      amount: '100.00',
      description: 'Test withdrawal'
    };
    const withdrawRes = await request('POST', '/transactions', withdrawPayload);
    console.log(`Status: ${withdrawRes.status}`);
    console.log(JSON.stringify(withdrawRes.data, null, 2));
    log('✓ Withdrawal successful\n', 'green');

    await sleep(500);

    // Test 9: Get All Transactions
    log('Test 9: Get All Transactions', 'blue');
    const transactions = await request('GET', `/transactions/account/${accountId}`);
    console.log(`Status: ${transactions.status}`);
    console.log(JSON.stringify(transactions.data, null, 2));
    log('✓ Transactions retrieved\n', 'green');

    await sleep(500);

    // Test 10: Create Second Account for Transfer
    log('Test 10: Create Second Account', 'blue');
    const account2Payload = {
      userId: userId,
      accountNumber: `ACC${Date.now().toString().slice(-8)}X`,
      accountType: 'CHECKING',
      currency: 'USD'
    };
    const account2Res = await request('POST', '/accounts', account2Payload);
    const account2Id = account2Res.data.data.id;
    console.log(`Status: ${account2Res.status}`);
    console.log(JSON.stringify(account2Res.data, null, 2));
    log(`✓ Second account created: ${account2Id}\n`, 'green');

    await sleep(500);

    // Test 11: Transfer Between Accounts
    log('Test 11: Transfer Between Accounts', 'blue');
    const transferPayload = {
      fromAccountId: accountId,
      toAccountId: account2Id,
      amount: '100.00',
      description: 'Test transfer'
    };
    const transferRes = await request('POST', '/transfers', transferPayload);
    console.log(`Status: ${transferRes.status}`);
    console.log(JSON.stringify(transferRes.data, null, 2));
    log('✓ Transfer successful\n', 'green');

    await sleep(500);

    // Test 12: Get All Transfers
    log('Test 12: Get All Transfers', 'blue');
    const transfers = await request('GET', `/transfers/account/${accountId}`);
    console.log(`Status: ${transfers.status}`);
    console.log(JSON.stringify(transfers.data, null, 2));
    log('✓ Transfers retrieved\n', 'green');

    await sleep(500);

    // Test 13: Get Database Statistics
    log('Test 13: Get Database Statistics', 'blue');
    const stats = await request('GET', '/admin/stats');
    console.log(`Status: ${stats.status}`);
    console.log(JSON.stringify(stats.data, null, 2));
    log('✓ Statistics retrieved\n', 'green');

    log('=== All Tests Completed Successfully ===\n', 'green');
  } catch (error) {
    log(`\n✗ Error: ${error.message}\n`, 'red');
    process.exit(1);
  }
}

// Run tests
runTests();
