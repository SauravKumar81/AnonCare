import { Router } from 'express';
import { anonymousLogin } from '../controllers/authController';

const router = Router();

router.post('/anonymous-login', anonymousLogin);

export default router;
