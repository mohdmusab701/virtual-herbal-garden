import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CareService } from '../services/care.service';
import { successResponse } from '../utils/apiResponse';

export class CareController {
  static async getTasks(req: AuthRequest, res: Response) {
    const tasks = await CareService.getTasks(req.user._id, req.query);
    return successResponse(res, 200, 'Care tasks retrieved', tasks);
  }

  static async getTodayTasks(req: AuthRequest, res: Response) {
    const tasks = await CareService.getTodayTasks(req.user._id);
    return successResponse(res, 200, 'Today\'s care tasks retrieved', tasks);
  }

  static async createTask(req: AuthRequest, res: Response) {
    const task = await CareService.createTask(req.user._id, req.body);
    return successResponse(res, 201, 'Care task created', task);
  }

  static async updateTask(req: AuthRequest, res: Response) {
    const task = await CareService.updateTask(req.params.id, req.user._id, req.body);
    return successResponse(res, 200, 'Care task updated', task);
  }

  static async markComplete(req: AuthRequest, res: Response) {
    const task = await CareService.markComplete(req.params.id, req.user._id);
    return successResponse(res, 200, 'Care task marked as complete', task);
  }

  static async deleteTask(req: AuthRequest, res: Response) {
    await CareService.deleteTask(req.params.id, req.user._id);
    return successResponse(res, 200, 'Care task deleted');
  }
}
