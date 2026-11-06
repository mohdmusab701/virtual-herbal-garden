import { Request, Response } from 'express';
import { Model3D } from '../models/Model3D';
import { successResponse } from '../utils/apiResponse';

export class Model3DController {
  static async getModels(req: Request, res: Response) {
    const models = await Model3D.find().populate('plantId', 'name');
    return successResponse(res, 200, 'Models retrieved', models);
  }

  static async getModelById(req: Request, res: Response) {
    const model = await Model3D.findById(req.params.id).populate('plantId', 'name');
    if (!model) throw new Error('Model not found');
    return successResponse(res, 200, 'Model retrieved', model);
  }

  static async getByPlantId(req: Request, res: Response) {
    const model = await Model3D.findOne({ plantId: req.params.plantId });
    if (!model) throw new Error('Model not found for this plant');
    return successResponse(res, 200, 'Model retrieved', model);
  }

  // Admin routes
  static async createModel(req: Request, res: Response) {
    const model = await Model3D.create(req.body);
    return successResponse(res, 201, 'Model created', model);
  }

  static async updateModel(req: Request, res: Response) {
    const model = await Model3D.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!model) throw new Error('Model not found');
    return successResponse(res, 200, 'Model updated', model);
  }

  static async deleteModel(req: Request, res: Response) {
    const model = await Model3D.findByIdAndDelete(req.params.id);
    if (!model) throw new Error('Model not found');
    return successResponse(res, 200, 'Model deleted');
  }
}
