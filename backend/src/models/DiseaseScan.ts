import mongoose, { Document, Schema } from 'mongoose';

export interface IDiseaseScan extends Document {
  userId: mongoose.Types.ObjectId;
  plantId?: mongoose.Types.ObjectId;
  imageUrl: string;
  prediction?: string;
  confidence?: number;
  symptoms?: string[];
  generalGuidance?: string[];
  modelVersion?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

const diseaseScanSchema = new Schema<IDiseaseScan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant' },
    imageUrl: { type: String, required: true },
    prediction: { type: String },
    confidence: { type: Number },
    symptoms: [{ type: String }],
    generalGuidance: [{ type: String }],
    modelVersion: { type: String },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const DiseaseScan = mongoose.model<IDiseaseScan>('DiseaseScan', diseaseScanSchema);
