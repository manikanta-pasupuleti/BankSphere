import * as transferModel from '../models/transferModel.js';
import pool from '../config/database.js';

export const createTransferController = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const { fromAccountId, toAccountId, amount, description } = req.body;
    
    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    // Get from account
    const fromAccount = await client.query('SELECT * FROM accounts WHERE id = $1', [fromAccountId]);
    if (fromAccount.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Source account not found'
      });
    }
    
    // Get to account
    const toAccount = await client.query('SELECT * FROM accounts WHERE id = $1', [toAccountId]);
    if (toAccount.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Destination account not found'
      });
    }
    
    // Check balance
    if (fromAccount.rows[0].balance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Update balances
    await client.query(
      'UPDATE accounts SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [amount, fromAccountId]
    );
    
    await client.query(
      'UPDATE accounts SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [amount, toAccountId]
    );
    
    // Create transfer record
    const transfer = await client.query(
      `INSERT INTO transfers (id, from_account_id, to_account_id, amount, description, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'COMPLETED')
       RETURNING *`,
      [fromAccountId, toAccountId, amount, description]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Transfer completed successfully',
      data: transfer.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    client.release();
  }
};

export const getTransferController = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await transferModel.getTransferById(id);
    
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transfer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTransfersByAccountController = async (req, res) => {
  try {
    const { accountId } = req.params;
    const transfers = await transferModel.getTransfersByAccountId(accountId);
    
    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllTransfersController = async (req, res) => {
  try {
    const transfers = await transferModel.getAllTransfers();
    
    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteTransferController = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await transferModel.deleteTransfer(id);
    
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Transfer deleted successfully',
      data: transfer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
