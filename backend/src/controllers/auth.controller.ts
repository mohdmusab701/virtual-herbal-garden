import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    const data = await AuthService.register(req.body);
    return successResponse(res, 201, 'User registered successfully', data);
  }

  static async login(req: Request, res: Response) {
    const data = await AuthService.login(req.body);
    return successResponse(res, 200, 'Login successful', data);
  }

  static async getMe(req: AuthRequest, res: Response) {
    const data = await AuthService.getMe(req.user._id);
    return successResponse(res, 200, 'User profile retrieved successfully', data);
  }

  static async logout(req: Request, res: Response) {
    return successResponse(res, 200, 'Logged out successfully');
  }
}
