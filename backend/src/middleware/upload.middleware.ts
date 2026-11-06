import multer from 'multer';
import { Request } from 'express';
import { env } from '../config/env';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only jpg, png, and webp formats are allowed!'));
    }
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_IMAGE_SIZE_MB * 1024 * 1024,
  },
});
