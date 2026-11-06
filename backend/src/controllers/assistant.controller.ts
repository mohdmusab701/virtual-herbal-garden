import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AssistantService } from '../services/assistant.service';
import { successResponse } from '../utils/apiResponse';

export class AssistantController {
  static async chat(req: AuthRequest, res: Response) {
    const response = await AssistantService.chat(req.user._id, req.body.message);
    return successResponse(res, 200, 'Assistant response', response);
  }

  static async getHistory(req: AuthRequest, res: Response) {
    const history = await AssistantService.getHistory(req.user._id);
    return successResponse(res, 200, 'Chat history retrieved', history);
  }
}
