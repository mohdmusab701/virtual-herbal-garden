import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', asyncHandler(AdminController.getDashboard));
router.get('/users', asyncHandler(AdminController.getUsers));
router.get('/scans', asyncHandler(AdminController.getScans));
router.get('/disease-scans', asyncHandler(AdminController.getDiseaseScans));

export default router;
