import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { DiseaseService } from "../services/disease.service";
import { successResponse, errorResponse } from "../utils/apiResponse";

export class DiseaseController {
  static async analyze(req: AuthRequest, res: Response) {
    void req;
    return errorResponse(
      res,
      503,
      "Disease detection is unavailable because no disease-trained model is configured.",
    );
  }

  static async getHistory(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const scans = await DiseaseService.getHistory(req.user._id, page, limit);
    return successResponse(res, 200, "Disease scan history retrieved", scans);
  }

  static async getById(req: AuthRequest, res: Response) {
    return successResponse(res, 200, "Not implemented fully yet");
  }
}
