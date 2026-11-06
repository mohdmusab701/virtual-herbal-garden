import { Router } from 'express';
import { Model3DController } from '../controllers/model3d.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(Model3DController.getModels));
router.get('/:id', asyncHandler(Model3DController.getModelById));
router.get('/plant/:plantId', asyncHandler(Model3DController.getByPlantId));

// Admin only routes
router.use(authMiddleware, adminMiddleware);
router.post('/', asyncHandler(Model3DController.createModel));
router.put('/:id', asyncHandler(Model3DController.updateModel));
router.delete('/:id', asyncHandler(Model3DController.deleteModel));

export default router;
