import express from 'express';
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

router.post('/', createAccountController);
router.get('/', getAllAccountsController);
router.get('/:id', getAccountController);
router.get('/:id/balance', getBalanceController);
router.get('/user/:userId', getAccountsByUserController);
router.put('/:id', updateAccountController);
router.delete('/:id', deleteAccountController);

export default router;
