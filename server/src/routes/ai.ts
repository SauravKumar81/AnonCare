import { Router } from 'express';
import { chatWithAI } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';
import { crisisAlertMiddleware } from '../middleware/crisis';

const router = Router();

router.post('/chat', authMiddleware as any, crisisAlertMiddleware as any, chatWithAI as any);

export default router;
