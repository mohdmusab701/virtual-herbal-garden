import { Router } from 'express';
import { CareController } from '../controllers/care.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createCareTaskSchema, updateCareTaskSchema } from '../validators/care.validator';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authMiddleware);

router.get('/tasks', asyncHandler(CareController.getTasks));
router.get('/tasks/today', asyncHandler(CareController.getTodayTasks));
router.post('/tasks', validate(createCareTaskSchema), asyncHandler(CareController.createTask));
router.put('/tasks/:id', validate(updateCareTaskSchema), asyncHandler(CareController.updateTask));
router.patch('/tasks/:id/complete', asyncHandler(CareController.markComplete));
router.delete('/tasks/:id', asyncHandler(CareController.deleteTask));

export default router;
