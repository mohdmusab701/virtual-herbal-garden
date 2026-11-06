import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import { ScanController } from '../controllers/scan.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { errorResponse } from '../utils/apiResponse';

const router = Router();

const uploadScanImage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single('image')(req, res, (error: unknown) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(
        res,
        413,
        'The uploaded image exceeds the configured size limit.',
      );
    }
    return errorResponse(
      res,
      400,
      'Upload a JPEG, PNG, or WebP image using the image field.',
    );
  });
};

router.use(authMiddleware);

router.post('/identify', uploadScanImage, asyncHandler(ScanController.identify));
router.get('/', asyncHandler(ScanController.getHistory));
router.get('/:id', asyncHandler(ScanController.getById));
router.delete('/:id', asyncHandler(ScanController.delete));

export default router;
