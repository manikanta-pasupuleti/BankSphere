import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authModel from '../models/authModel.js';

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role || 'CUSTOMER' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, city, state, postalCode, country } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'firstName, lastName, email, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await authModel.createAuthUser({
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      address,
      city,
      state,
      postalCode,
      country
    });
    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await authModel.findUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = createToken(user);
    const publicUser = await authModel.findUserById(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: publicUser, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const meController = async (req, res) => {
  try {
    const user = await authModel.findUserById(req.user.userId);
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
