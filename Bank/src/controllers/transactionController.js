import * as transactionModel from '../models/transactionModel.js';
import * as accountModel from '../models/accountModel.js';
import pool from '../config/database.js';

export const createTransactionController = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const { accountId, transactionType, amount, description } = req.body;
    
    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }
    
    // Get account balance
    const account = await client.query('SELECT * FROM accounts WHERE id = $1', [accountId]);
    
    if (account.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    // Check balance for withdrawal
    if (transactionType === 'WITHDRAWAL' && account.rows[0].balance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Update balance
    const newBalance = transactionType === 'DEPOSIT' 
      ? account.rows[0].balance + parseFloat(amount)
      : account.rows[0].balance - parseFloat(amount);
    
    await client.query(
      'UPDATE accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newBalance, accountId]
    );
    
    // Create transaction record
    const trans = await client.query(
      `INSERT INTO transactions (id, account_id, transaction_type, amount, description, balance_after, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'COMPLETED')
       RETURNING *`,
      [accountId, transactionType, amount, description, newBalance]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Transaction completed successfully',
      data: trans.rows[0]
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

export const getTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionModel.getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTransactionsByAccountController = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const transactions = await transactionModel.getTransactionsByAccountId(
      accountId,
      parseInt(limit),
      parseInt(offset)
    );
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllTransactionsController = async (req, res) => {
  try {
    const transactions = await transactionModel.getAllTransactions();
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTransactionStatsController = async (req, res) => {
  try {
    const { accountId } = req.params;
    const stats = await transactionModel.getTransactionStats(accountId);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
