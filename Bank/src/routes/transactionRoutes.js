import express from 'express';
import {
  createTransactionController,
  getTransactionController,
  getTransactionsByAccountController,
  getAllTransactionsController,
  getTransactionStatsController
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', createTransactionController);
router.get('/', getAllTransactionsController);
router.get('/:id', getTransactionController);
router.get('/account/:accountId', getTransactionsByAccountController);
router.get('/account/:accountId/stats', getTransactionStatsController);

export default router;
