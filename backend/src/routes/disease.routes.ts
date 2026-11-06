import { Router } from 'express';
import { DiseaseController } from '../controllers/disease.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.post('/analyze', upload.single('image'), asyncHandler(DiseaseController.analyze));
router.get('/', asyncHandler(DiseaseController.getHistory));
router.get('/:id', asyncHandler(DiseaseController.getById));

export default router;
