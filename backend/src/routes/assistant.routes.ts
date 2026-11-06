import { Router } from 'express';
import { AssistantController } from '../controllers/assistant.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.post('/chat', asyncHandler(AssistantController.chat));
router.get('/history', asyncHandler(AssistantController.getHistory));

export default router;
