import mongoose, { Document, Schema } from "mongoose";

export interface IPlantScan extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl?: string;
  plantId?: mongoose.Types.ObjectId;
  predictedName?: string;
  scientificName?: string;
  confidence?: number;
  boundingBoxes?: any[];
  modelVersion?: string;
  isMock: boolean;
  status: "processing" | "completed" | "failed";
  createdAt: Date;
}

const plantScanSchema = new Schema<IPlantScan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String },
    plantId: { type: Schema.Types.ObjectId, ref: "Plant" },
    predictedName: { type: String },
    scientificName: { type: String },
    confidence: { type: Number },
    boundingBoxes: [{ type: Schema.Types.Mixed }],
    modelVersion: { type: String },
    isMock: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const PlantScan = mongoose.model<IPlantScan>(
  "PlantScan",
  plantScanSchema,
);
