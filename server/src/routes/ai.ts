import { Router } from 'express';
import { chatWithAI, generateTherapistPersona } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';
import { crisisAlertMiddleware } from '../middleware/crisis';

const router = Router();

router.post('/chat', authMiddleware as any, crisisAlertMiddleware as any, chatWithAI as any);
router.post('/create-agent', authMiddleware as any, generateTherapistPersona as any);

export default router;
