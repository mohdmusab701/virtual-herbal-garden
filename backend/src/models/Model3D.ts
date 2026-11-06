import mongoose, { Document, Schema } from 'mongoose';

export interface IModel3D extends Document {
  plantId: mongoose.Types.ObjectId;
  name: string;
  modelUrl: string;
  thumbnailUrl?: string;
  format: 'glb' | 'gltf';
  fileSize?: number;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

const model3dSchema = new Schema<IModel3D>(
  {
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    name: { type: String, required: true },
    modelUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    format: { type: String, enum: ['glb', 'gltf'], required: true, default: 'glb' },
    fileSize: { type: Number },
    version: { type: String, default: '1.0' },
  },
  {
    timestamps: true,
  }
);

export const Model3D = mongoose.model<IModel3D>('Model3D', model3dSchema);
