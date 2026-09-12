import express from 'express';
import {
  createUserController,
  getUserController,
  getAllUsersController,
  updateUserController,
  deleteUserController
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUserController);
router.get('/', getAllUsersController);
router.get('/:id', getUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
