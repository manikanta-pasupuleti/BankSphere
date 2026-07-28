import * as userModel from '../models/userModel.js';

export const createUserController = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, state, postalCode, country } = req.body;
    
    const user = await userModel.createUser({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country
    });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, city, state, postalCode, country } = req.body;
    
    const user = await userModel.updateUser(id, {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.deleteUser(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
