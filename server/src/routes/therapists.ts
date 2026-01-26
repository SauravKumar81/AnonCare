import { Router } from 'express';
import { getAllTherapists, createAppointment, getMyAppointments, cancelAppointment } from '../controllers/therapistController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getAllTherapists);
router.post('/book', authMiddleware as any, createAppointment as any);
router.get('/my-appointments', authMiddleware as any, getMyAppointments as any);
router.put('/cancel/:id', authMiddleware as any, cancelAppointment as any);

export default router;
