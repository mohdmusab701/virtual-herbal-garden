import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { CloudinaryService } from "../services/cloudinary.service";
import { AIService } from "../services/ai.service";
import { PlantScan } from "../models/PlantScan";
import { Plant } from "../models/Plant";
import { successResponse, errorResponse } from "../utils/apiResponse";

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class ScanController {
  static async identify(req: AuthRequest, res: Response) {
    if (!req.file) {
      return errorResponse(
        res,
        400,
        "Upload a JPEG, PNG, or WebP image using the image field.",
      );
    }

    const fileBuffer = req.file.buffer;
    const isJpeg =
      fileBuffer.length >= 3 &&
      fileBuffer[0] === 0xff &&
      fileBuffer[1] === 0xd8 &&
      fileBuffer[2] === 0xff;
    const isPng =
      fileBuffer.length >= 8 &&
      fileBuffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isWebp =
      fileBuffer.length >= 12 &&
      fileBuffer.toString("ascii", 0, 4) === "RIFF" &&
      fileBuffer.toString("ascii", 8, 12) === "WEBP";
    if (!isJpeg && !isPng && !isWebp) {
      return errorResponse(
        res,
        400,
        "The uploaded file is not a valid JPEG, PNG, or WebP image.",
      );
    }

    const scan = new PlantScan({
      userId: req.user._id,
      status: "processing",
    });

    try {
      let imageUrl: string | undefined;
      try {
        imageUrl = await CloudinaryService.uploadImageIfConfigured(
          req.file.buffer,
          "plant-scans",
        );
      } catch {
        console.warn(
          "Optional image storage is unavailable; scan processing will continue without a durable image URL.",
        );
      }
      if (imageUrl) scan.imageUrl = imageUrl;
      await scan.save();
      // 3. Run configured inference or return the development mock result.
      const aiResult = await AIService.identifyPlant(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      const escapedPrediction = escapeRegex(aiResult.plant || "");
      const plantInfo = aiResult.plant
        ? await Plant.findOne({
            $or: [
              {
                name: {
                  $regex: `^${escapedPrediction}$`,
                  $options: "i",
                },
              },
              {
                commonNames: {
                  $regex: `^${escapedPrediction}$`,
                  $options: "i",
                },
              },
            ],
          })
            .select(
              "name scientificName commonNames description sunlight waterRequirement growingGuide safetyInformation",
            )
            .lean()
        : null;

      // 4. Store the model result or explicitly marked development simulation.
      scan.predictedName = aiResult.plant;
      scan.confidence = aiResult.confidence;
      scan.boundingBoxes = aiResult.boundingBoxes;
      scan.modelVersion = aiResult.model;
      scan.isMock = aiResult.isMock;
      if (plantInfo) {
        scan.plantId = plantInfo._id;
        scan.scientificName = plantInfo.scientificName;
      }
      scan.status = "completed";
      await scan.save();

      return successResponse(
        res,
        200,
        aiResult.isMock
          ? "Simulated scan complete. This is not a real AI prediction."
          : "Plant identified successfully",
        { scan: scan.toObject(), info: plantInfo },
      );
    } catch (error: any) {
      scan.status = "failed";
      await scan.save();

      const message = error instanceof Error ? error.message : "";
      const knownMessages = [
        "Plant identification is unavailable because simulated results are restricted to development mode.",
        "Plant identification is unavailable because the AI service cannot be reached.",
        "Plant identification timed out. Please try again.",
        "Plant identification is unavailable because compatible trained model weights are not ready.",
        "The uploaded image exceeds the configured size limit.",
        "The uploaded file is not a supported, valid image. Use a JPEG, PNG, or WebP image.",
        "AI service returned an invalid prediction response.",
        "Plant identification failed because the AI service returned an error.",
      ];
      if (!knownMessages.includes(message)) {
        console.error(
          `Plant scan failed unexpectedly (${error instanceof Error ? error.name : "unknown error"}).`,
        );
      }
      const safeMessage = knownMessages.includes(message)
        ? message
        : "Plant identification could not be completed. Please try again later.";
      const statusCode = safeMessage.includes("unavailable") ? 503 : 502;
      return errorResponse(res, statusCode, safeMessage);
    }
  }

  static async getHistory(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const scans = await PlantScan.find({ userId: req.user._id })
      .populate("plantId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await PlantScan.countDocuments({ userId: req.user._id });

    return successResponse(res, 200, "Scan history retrieved", {
      scans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }

  static async getById(req: AuthRequest, res: Response) {
    const scan = await PlantScan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("plantId");
    if (!scan) throw new Error("Scan not found");
    return successResponse(res, 200, "Scan retrieved", scan);
  }

  static async delete(req: AuthRequest, res: Response) {
    const scan = await PlantScan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!scan) throw new Error("Scan not found");
    return successResponse(res, 200, "Scan deleted successfully");
  }
}
