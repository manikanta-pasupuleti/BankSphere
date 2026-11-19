import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  createTransactionController,
  getTransactionController,
  getTransactionsByAccountController,
  getAllTransactionsController,
  getTransactionStatsController
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', authenticate, createTransactionController);
router.get('/', authenticate, authorizeRoles('ADMIN'), getAllTransactionsController);
router.get('/:id', authenticate, getTransactionController);
router.get('/account/:accountId', authenticate, getTransactionsByAccountController);
router.get('/account/:accountId/stats', authenticate, getTransactionStatsController);

export default router;
