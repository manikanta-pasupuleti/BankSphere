import express from 'express';
import { authenticate, authorizeRoles, requireSelfOrAdmin } from '../middleware/auth.js';
import {
  createUserController,
  getUserController,
  getAllUsersController,
  updateUserController,
  deleteUserController
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('ADMIN'), createUserController);
router.get('/', authenticate, authorizeRoles('ADMIN'), getAllUsersController);
router.get('/:id', authenticate, requireSelfOrAdmin, getUserController);
router.put('/:id', authenticate, requireSelfOrAdmin, updateUserController);
router.delete('/:id', authenticate, requireSelfOrAdmin, deleteUserController);

export default router;
