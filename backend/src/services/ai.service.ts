import axios from "axios";
import FormData from "form-data";
import { z } from "zod";
import { env } from "../config/env";

const predictionResponseSchema = z.object({
  success: z.literal(true),
  predictions: z.array(
    z.object({
      label: z.string().trim().min(1),
      confidence: z.number().min(0).max(1),
      bbox: z.array(z.number()).length(4).optional(),
    }),
  ),
  model: z.string().trim().min(1),
});

const healthResponseSchema = z.object({
  status: z.string(),
  model_loaded: z.boolean(),
  weights_file: z.string().nullable(),
  weights_available: z.boolean().optional(),
  weights_expected: z.string().optional(),
  inference_ready: z.boolean().optional(),
  species_count: z.number(),
});

interface PlantIdentificationResult {
  plant?: string;
  confidence?: number;
  boundingBoxes: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    class: string;
    conf: number;
  }>;
  model: string;
  isMock: boolean;
}

export class AIService {
  private static readonly TIMEOUT_MS = 30000;

  static async identifyPlant(
    imageBuffer: Buffer,
    _originalName: string,
    contentType: string,
  ): Promise<PlantIdentificationResult> {
    if (env.MOCK_AI_MODE && env.NODE_ENV === "development") {
      return {
        plant: "Simulated plant result",
        boundingBoxes: [],
        model: "development-mock",
        isMock: true,
      };
    }

    if (env.MOCK_AI_MODE) {
      throw new Error(
        "Plant identification is unavailable because simulated results are restricted to development mode.",
      );
    }

    try {
      const form = new FormData();
      const safeFilename =
        contentType === "image/png"
          ? "upload.png"
          : contentType === "image/webp"
            ? "upload.webp"
            : "upload.jpg";
      form.append("file", imageBuffer, {
        filename: safeFilename,
        contentType,
      });

      const response = await axios.post(
        `${env.AI_SERVICE_URL.replace(/\/+$/, "")}/predict/plant`,
        form,
        {
          headers: form.getHeaders(),
          timeout: AIService.TIMEOUT_MS,
          maxBodyLength: env.MAX_IMAGE_SIZE_MB * 1024 * 1024,
        },
      );

      const parsed = predictionResponseSchema.safeParse(response.data);
      if (!parsed.success)
        throw new Error("AI service returned an invalid prediction response.");

      const topPrediction = parsed.data.predictions[0];
      return {
        plant: topPrediction?.label,
        confidence: topPrediction?.confidence,
        boundingBoxes: parsed.data.predictions.flatMap((prediction) =>
          prediction.bbox &&
          prediction.bbox[2] > prediction.bbox[0] &&
          prediction.bbox[3] > prediction.bbox[1]
            ? [
                {
                  x: prediction.bbox[0],
                  y: prediction.bbox[1],
                  w: prediction.bbox[2] - prediction.bbox[0],
                  h: prediction.bbox[3] - prediction.bbox[1],
                  class: prediction.label,
                  conf: prediction.confidence,
                },
              ]
            : [],
        ),
        model: parsed.data.model,
        isMock: false,
      };
    } catch (error: any) {
      if (
        error instanceof Error &&
        error.message.startsWith("AI service returned")
      )
        throw error;
      if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
        throw new Error(
          "Plant identification is unavailable because the AI service cannot be reached.",
        );
      }
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("Plant identification timed out. Please try again.");
      }
      if (error.response?.status === 503) {
        throw new Error(
          "Plant identification is unavailable because compatible trained model weights are not ready.",
        );
      }
      if ([400, 413, 415].includes(error.response?.status)) {
        throw new Error(
          error.response.status === 413
            ? "The uploaded image exceeds the configured size limit."
            : "The uploaded file is not a supported, valid image. Use a JPEG, PNG, or WebP image.",
        );
      }
      throw new Error(
        "Plant identification failed because the AI service returned an error.",
      );
    }
  }

  static async detectDisease(
    _imageBuffer: Buffer,
    _originalName: string,
  ): Promise<never> {
    throw new Error(
      "Disease detection is currently unavailable. No disease-trained model is available.",
    );
  }

  static async checkHealth(): Promise<{
    status: string;
    model_loaded: boolean;
    weights_file: string | null;
    weights_available?: boolean;
    weights_expected?: string;
    inference_ready?: boolean;
    species_count: number;
  }> {
    try {
      const response = await axios.get(`${env.AI_SERVICE_URL}/health`, {
        timeout: 5000,
      });
      const parsed = healthResponseSchema.safeParse(response.data);
      if (parsed.success) return parsed.data;
    } catch {
      // The fallback below avoids leaking transport or service details.
    }
    return {
      status: "unreachable",
      model_loaded: false,
      weights_file: null,
      weights_available: false,
      inference_ready: false,
      species_count: 0,
    };
  }
}
