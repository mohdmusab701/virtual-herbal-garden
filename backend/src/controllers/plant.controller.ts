import { Request, Response } from 'express';
import { PlantService } from '../services/plant.service';
import { successResponse } from '../utils/apiResponse';

export class PlantController {
  static async getPlants(req: Request, res: Response) {
    const data = await PlantService.getAllPlants(req.query);
    return successResponse(res, 200, 'Plants retrieved successfully', data);
  }

  static async getPlantById(req: Request, res: Response) {
    const data = await PlantService.getPlantById(req.params.id);
    return successResponse(res, 200, 'Plant retrieved successfully', data);
  }

  static async createPlant(req: Request, res: Response) {
    const data = await PlantService.createPlant(req.body);
    return successResponse(res, 201, 'Plant created successfully', data);
  }

  static async updatePlant(req: Request, res: Response) {
    const data = await PlantService.updatePlant(req.params.id, req.body);
    return successResponse(res, 200, 'Plant updated successfully', data);
  }

  static async deletePlant(req: Request, res: Response) {
    await PlantService.deletePlant(req.params.id);
    return successResponse(res, 200, 'Plant deleted successfully');
  }
}
