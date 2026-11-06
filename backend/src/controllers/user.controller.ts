import { Response } from 'express';
import { User } from '../models/User';
import { successResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  static async updateProfile(req: AuthRequest, res: Response) {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        avatar: req.body.avatar,
      },
      { new: true, runValidators: true }
    );
    return successResponse(res, 200, 'Profile updated successfully', user);
  }

  static async deleteAccount(req: AuthRequest, res: Response) {
    await User.findByIdAndDelete(req.user._id);
    return successResponse(res, 200, 'Account deleted successfully');
  }
}
