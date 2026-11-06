import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.put('/me', asyncHandler(UserController.updateProfile));
router.delete('/me', asyncHandler(UserController.deleteAccount));

export default router;
