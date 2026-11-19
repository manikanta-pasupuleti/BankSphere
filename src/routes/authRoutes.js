import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  registerController,
  loginController,
  meController
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', authenticate, meController);

export default router;
