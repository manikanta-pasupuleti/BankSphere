import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  createAccountController,
  getAccountController,
  getAccountsByUserController,
  getAllAccountsController,
  updateAccountController,
  deleteAccountController,
  getBalanceController
} from '../controllers/accountController.js';

const router = express.Router();

router.post('/', authenticate, createAccountController);
router.get('/', authenticate, authorizeRoles('ADMIN'), getAllAccountsController);
router.get('/:id/balance', authenticate, getBalanceController);
router.get('/user/:userId', authenticate, getAccountsByUserController);
router.get('/:id', authenticate, getAccountController);
router.put('/:id', authenticate, updateAccountController);
router.delete('/:id', authenticate, deleteAccountController);

export default router;
