import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createTransfer = async (transferData) => {
  const { fromAccountId, toAccountId, amount, description } = transferData;
  const id = uuidv4();
  
  const result = await pool.query(
    `INSERT INTO transfers (id, from_account_id, to_account_id, amount, description, status)
     VALUES ($1, $2, $3, $4, $5, 'PENDING')
     RETURNING *`,
    [id, fromAccountId, toAccountId, amount, description]
  );
  
  return result.rows[0];
};

export const getTransferById = async (id) => {
  const result = await pool.query('SELECT * FROM transfers WHERE id = $1', [id]);
  return result.rows[0];
};

export const getTransfersByAccountId = async (accountId) => {
  const result = await pool.query(
    `SELECT * FROM transfers 
     WHERE from_account_id = $1 OR to_account_id = $1 
     ORDER BY created_at DESC`,
    [accountId]
  );
  return result.rows;
};

export const getAllTransfers = async () => {
  const result = await pool.query('SELECT * FROM transfers ORDER BY created_at DESC');
  return result.rows;
};

export const updateTransferStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE transfers SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  
  return result.rows[0];
};

export const deleteTransfer = async (id) => {
  const result = await pool.query('DELETE FROM transfers WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
