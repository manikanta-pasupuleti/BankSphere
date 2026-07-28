import express from 'express';
import {
  createTransferController,
  getTransferController,
  getTransfersByAccountController,
  getAllTransfersController,
  deleteTransferController
} from '../controllers/transferController.js';

const router = express.Router();

router.post('/', createTransferController);
router.get('/', getAllTransfersController);
router.get('/:id', getTransferController);
router.get('/account/:accountId', getTransfersByAccountController);
router.delete('/:id', deleteTransferController);

export default router;
