import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createAccount = async (accountData) => {
  const { userId, accountNumber, accountType, currency } = accountData;
  const id = uuidv4();
  
  const result = await pool.query(
    `INSERT INTO accounts (id, user_id, account_number, account_type, currency, balance, status)
     VALUES ($1, $2, $3, $4, $5, 0.00, 'ACTIVE')
     RETURNING *`,
    [id, userId, accountNumber, accountType, currency || 'USD']
  );
  
  return result.rows[0];
};

export const getAccountById = async (id) => {
  const result = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
  return result.rows[0];
};

export const getAccountsByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export const getAllAccounts = async () => {
  const result = await pool.query('SELECT * FROM accounts ORDER BY created_at DESC');
  return result.rows;
};

export const updateAccount = async (id, accountData) => {
  const { accountType, status } = accountData;
  
  const result = await pool.query(
    `UPDATE accounts SET account_type = COALESCE($1, account_type), 
                        status = COALESCE($2, status),
                        updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 RETURNING *`,
    [accountType, status, id]
  );
  
  return result.rows[0];
};

export const updateBalance = async (id, amount) => {
  const result = await pool.query(
    `UPDATE accounts SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 RETURNING *`,
    [amount, id]
  );
  
  return result.rows[0];
};

export const deleteAccount = async (id) => {
  const result = await pool.query('DELETE FROM accounts WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getBalance = async (id) => {
  const result = await pool.query('SELECT balance FROM accounts WHERE id = $1', [id]);
  return result.rows[0]?.balance || 0;
};
