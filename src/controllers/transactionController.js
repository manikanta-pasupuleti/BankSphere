import * as transactionModel from '../models/transactionModel.js';
import * as accountModel from '../models/accountModel.js';
import pool from '../config/database.js';

export const createTransactionController = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const { accountId, transactionType, amount, description } = req.body;

    if (!['DEPOSIT', 'WITHDRAWAL'].includes(transactionType)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'transactionType must be DEPOSIT or WITHDRAWAL'
      });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const account = await client.query(
      'SELECT * FROM accounts WHERE id = $1 FOR UPDATE',
      [accountId]
    );
    
    if (account.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    if (req.user.role !== 'ADMIN' && account.rows[0].user_id !== req.user.userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    if (transactionType === 'WITHDRAWAL' && Number(account.rows[0].balance) < numericAmount) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    const newBalance = transactionType === 'DEPOSIT'
      ? Number(account.rows[0].balance) + numericAmount
      : Number(account.rows[0].balance) - numericAmount;
    
    await client.query(
      'UPDATE accounts SET balance = ROUND(CAST($1 AS NUMERIC), 2), updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newBalance, accountId]
    );
    
    // Create transaction record
    const trans = await client.query(
      `INSERT INTO transactions (id, account_id, transaction_type, amount, description, balance_after, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'COMPLETED')
       RETURNING *`,
      [accountId, transactionType, numericAmount, description, newBalance]
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

    if (req.user.role !== 'ADMIN') {
      const account = await accountModel.getAccountById(transaction.account_id);
      if (!account || account.user_id !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        });
      }
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

    if (req.user.role !== 'ADMIN') {
      const account = await accountModel.getAccountById(accountId);
      if (!account || account.user_id !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        });
      }
    }
    
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

    if (req.user.role !== 'ADMIN') {
      const account = await accountModel.getAccountById(accountId);
      if (!account || account.user_id !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden'
        });
      }
    }

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
