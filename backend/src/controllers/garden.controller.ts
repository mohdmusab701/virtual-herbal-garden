import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { GardenService } from '../services/garden.service';
import { successResponse } from '../utils/apiResponse';

export class GardenController {
  static async getGardens(req: AuthRequest, res: Response) {
    const gardens = await GardenService.getMyGardens(req.user._id);
    return successResponse(res, 200, 'Gardens retrieved successfully', gardens);
  }

  static async getGardenById(req: AuthRequest, res: Response) {
    const garden = await GardenService.getGardenById(req.params.id, req.user._id);
    return successResponse(res, 200, 'Garden retrieved successfully', garden);
  }

  static async createGarden(req: AuthRequest, res: Response) {
    const garden = await GardenService.createGarden(req.user._id, req.body);
    return successResponse(res, 201, 'Garden created successfully', garden);
  }

  static async addPlant(req: AuthRequest, res: Response) {
    const garden = await GardenService.addPlantToGarden(req.params.id, req.user._id, req.body);
    return successResponse(res, 200, 'Plant added to garden', garden);
  }

  static async removePlant(req: AuthRequest, res: Response) {
    const garden = await GardenService.removePlantFromGarden(req.params.id, req.user._id, req.params.plantId);
    return successResponse(res, 200, 'Plant removed from garden', garden);
  }

  static async getStats(req: AuthRequest, res: Response) {
    const stats = await GardenService.getGardenStats(req.params.id, req.user._id);
    return successResponse(res, 200, 'Garden stats retrieved', stats);
  }
}
