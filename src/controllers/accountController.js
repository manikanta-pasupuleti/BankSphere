import * as accountModel from '../models/accountModel.js';

export const createAccountController = async (req, res) => {
  try {
    const { userId, accountNumber, accountType, currency } = req.body;
    
    const account = await accountModel.createAccount({
      userId,
      accountNumber,
      accountType,
      currency
    });
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAccountController = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await accountModel.getAccountById(id);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAccountsByUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const accounts = await accountModel.getAccountsByUserId(userId);
    
    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllAccountsController = async (req, res) => {
  try {
    const accounts = await accountModel.getAllAccounts();
    
    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateAccountController = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountType, status } = req.body;
    
    const account = await accountModel.updateAccount(id, {
      accountType,
      status
    });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      data: account
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteAccountController = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await accountModel.deleteAccount(id);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
      data: account
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBalanceController = async (req, res) => {
  try {
    const { id } = req.params;
    const balance = await accountModel.getBalance(id);
    
    res.status(200).json({
      success: true,
      data: { accountId: id, balance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
