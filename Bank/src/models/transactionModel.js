import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createTransaction = async (transactionData) => {
  const { accountId, transactionType, amount, description } = transactionData;
  const id = uuidv4();
  
  // Get current balance
  const accountResult = await pool.query('SELECT balance FROM accounts WHERE id = $1', [accountId]);
  const balanceAfter = accountResult.rows[0].balance + (transactionType === 'DEPOSIT' ? amount : -amount);
  
  const result = await pool.query(
    `INSERT INTO transactions (id, account_id, transaction_type, amount, description, balance_after, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'COMPLETED')
     RETURNING *`,
    [id, accountId, transactionType, amount, description, balanceAfter]
  );
  
  return result.rows[0];
};

export const getTransactionById = async (id) => {
  const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
  return result.rows[0];
};

export const getTransactionsByAccountId = async (accountId, limit = 50, offset = 0) => {
  const result = await pool.query(
    `SELECT * FROM transactions WHERE account_id = $1 
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [accountId, limit, offset]
  );
  return result.rows;
};

export const getAllTransactions = async () => {
  const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
  return result.rows;
};

export const getTransactionStats = async (accountId) => {
  const result = await pool.query(
    `SELECT 
      transaction_type,
      COUNT(*) as count,
      SUM(amount) as total_amount
     FROM transactions 
     WHERE account_id = $1 
     GROUP BY transaction_type`,
    [accountId]
  );
  return result.rows;
};
