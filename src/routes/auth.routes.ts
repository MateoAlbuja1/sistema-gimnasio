import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { validateTask } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/user.schema';

const router = Router();

router.post('/register', validateTask(registerSchema), register);
router.post('/login', validateTask(loginSchema), login);
router.get('/profile', verifyToken, getProfile);

export default router;
