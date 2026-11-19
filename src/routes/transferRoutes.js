import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  createTransferController,
  getTransferController,
  getTransfersByAccountController,
  getAllTransfersController,
  deleteTransferController
} from '../controllers/transferController.js';

const router = express.Router();

router.post('/', authenticate, createTransferController);
router.get('/', authenticate, authorizeRoles('ADMIN'), getAllTransfersController);
router.get('/:id', authenticate, getTransferController);
router.get('/account/:accountId', authenticate, getTransfersByAccountController);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteTransferController);

export default router;
