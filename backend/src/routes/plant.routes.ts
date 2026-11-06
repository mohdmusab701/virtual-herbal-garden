import { Router } from 'express';
import { PlantController } from '../controllers/plant.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validation.middleware';
import { createPlantSchema, updatePlantSchema } from '../validators/plant.validator';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(PlantController.getPlants));
router.get('/:id', asyncHandler(PlantController.getPlantById));

// Admin only routes
router.use(authMiddleware, adminMiddleware);
router.post('/', validate(createPlantSchema), asyncHandler(PlantController.createPlant));
router.put('/:id', validate(updatePlantSchema), asyncHandler(PlantController.updatePlant));
router.delete('/:id', asyncHandler(PlantController.deletePlant));

export default router;
