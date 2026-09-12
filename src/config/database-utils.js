import pool from './database.js';

/**
 * Execute a database query with error handling
 * @param {string} query - SQL query
 * @param {array} values - Query parameters
 * @returns {Promise} Query result
 */
export const executeQuery = async (query, values = []) => {
  try {
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Check database connection
 * @returns {Promise<boolean>}
 */
export const checkConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    return result.rows.length > 0;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
};

/**
 * Get database statistics
 * @returns {Promise}
 */
export const getDatabaseStats = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM accounts) as total_accounts,
        (SELECT COUNT(*) FROM transactions) as total_transactions,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE transaction_type = 'DEPOSIT') as total_deposits,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE transaction_type = 'WITHDRAWAL') as total_withdrawals,
        (SELECT COUNT(*) FROM transfers) as total_transfers,
        (SELECT COALESCE(SUM(amount), 0) FROM transfers) as total_transfer_amount,
        (SELECT COALESCE(SUM(balance), 0) FROM accounts) as total_balance
    `);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching database statistics:', error);
    throw error;
  }
};

/**
 * Close database connection pool
 * @returns {Promise}
 */
export const closePool = async () => {
  try {
    await pool.end();
    console.log('Database connection pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

/**
 * Drop all tables (use with caution - for development only)
 * @returns {Promise}
 */
export const dropAllTables = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS transfers CASCADE');
    await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
    await pool.query('DROP TABLE IF EXISTS accounts CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
};

/**
 * Reset database (drop and reinitialize)
 * @returns {Promise}
 */
export const resetDatabase = async () => {
  try {
    await dropAllTables();
    // Re-initialize will be called from server.js
    console.log('Database reset. Tables will be recreated on next server start.');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

/**
 * Bulk insert users (useful for testing)
 * @returns {Promise}
 */
export const seedTestData = async () => {
  try {
    const testUsers = [
      ['John', 'Doe', 'john.doe@example.com', '+1234567890', '123 Main St', 'New York', 'NY', '10001', 'USA'],
      ['Jane', 'Smith', 'jane.smith@example.com', '+0987654321', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA'],
      ['Bob', 'Johnson', 'bob.johnson@example.com', '+1122334455', '789 Pine Ln', 'Chicago', 'IL', '60601', 'USA']
    ];

    for (const user of testUsers) {
      await pool.query(
        `INSERT INTO users (id, first_name, last_name, email, phone, address, city, state, postal_code, country)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        user
      );
    }

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
};

export default {
  executeQuery,
  checkConnection,
  getDatabaseStats,
  closePool,
  dropAllTables,
  resetDatabase,
  seedTestData
};
