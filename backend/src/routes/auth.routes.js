import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, register, logout } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const registerValidators = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'customer'])
];

const loginValidators = [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 })
];

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

export default router;


