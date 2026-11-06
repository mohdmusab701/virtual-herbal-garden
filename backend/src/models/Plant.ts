import mongoose, { Document, Schema } from 'mongoose';

export interface IPlant extends Document {
  name: string;
  scientificName: string;
  commonNames?: string[];
  category: 'medicinal' | 'aromatic' | 'indoor' | 'outdoor' | 'other';
  description: string;
  image?: string;
  sunlight: 'low' | 'medium' | 'high' | 'full';
  waterRequirement: 'low' | 'medium' | 'high';
  soil: string;
  temperature: string;
  humidity: string;
  traditionalInformation: string;
  growingGuide: string;
  safetyInformation?: string;
  model3d?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const plantSchema = new Schema<IPlant>(
  {
    name: { type: String, required: true },
    scientificName: { type: String, required: true },
    commonNames: [{ type: String }],
    category: {
      type: String,
      enum: ['medicinal', 'aromatic', 'indoor', 'outdoor', 'other'],
      required: true,
    },
    description: { type: String, required: true },
    image: { type: String },
    sunlight: {
      type: String,
      enum: ['low', 'medium', 'high', 'full'],
      required: true,
    },
    waterRequirement: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    soil: { type: String, required: true },
    temperature: { type: String, required: true },
    humidity: { type: String, required: true },
    traditionalInformation: { type: String, required: true },
    growingGuide: { type: String, required: true },
    safetyInformation: { type: String },
    model3d: { type: Schema.Types.ObjectId, ref: 'Model3D' },
  },
  {
    timestamps: true,
  }
);

plantSchema.index({ name: 'text', scientificName: 'text', commonNames: 'text' });

export const Plant = mongoose.model<IPlant>('Plant', plantSchema);
