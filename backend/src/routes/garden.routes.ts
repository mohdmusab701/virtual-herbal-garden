import { Router } from 'express';
import { GardenController } from '../controllers/garden.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createGardenSchema, addPlantToGardenSchema } from '../validators/garden.validator';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler(GardenController.getGardens));
router.post('/', validate(createGardenSchema), asyncHandler(GardenController.createGarden));
router.get('/:id', asyncHandler(GardenController.getGardenById));
router.get('/:id/stats', asyncHandler(GardenController.getStats));
router.post('/:id/plants', validate(addPlantToGardenSchema), asyncHandler(GardenController.addPlant));
router.delete('/:id/plants/:plantId', asyncHandler(GardenController.removePlant));

export default router;
