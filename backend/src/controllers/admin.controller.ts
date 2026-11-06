import { Request, Response } from 'express';
import { User } from '../models/User';
import { Plant } from '../models/Plant';
import { PlantScan } from '../models/PlantScan';
import { DiseaseScan } from '../models/DiseaseScan';
import { Model3D } from '../models/Model3D';
import { successResponse } from '../utils/apiResponse';

export class AdminController {
  static async getDashboard(req: Request, res: Response) {
    const [totalUsers, totalPlants, totalScans, totalDiseaseScans, total3DModels] = await Promise.all([
      User.countDocuments(),
      Plant.countDocuments(),
      PlantScan.countDocuments(),
      DiseaseScan.countDocuments(),
      Model3D.countDocuments(),
    ]);

    return successResponse(res, 200, 'Admin dashboard stats', {
      totalUsers,
      totalPlants,
      totalScans,
      totalDiseaseScans,
      total3DModels,
    });
  }

  static async getUsers(req: Request, res: Response) {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return successResponse(res, 200, 'Users retrieved', users);
  }

  static async getScans(req: Request, res: Response) {
    const scans = await PlantScan.find().populate('userId', 'name email').populate('plantId', 'name').sort({ createdAt: -1 });
    return successResponse(res, 200, 'Scans retrieved', scans);
  }

  static async getDiseaseScans(req: Request, res: Response) {
    const scans = await DiseaseScan.find().populate('userId', 'name email').populate('plantId', 'name').sort({ createdAt: -1 });
    return successResponse(res, 200, 'Disease scans retrieved', scans);
  }
}
