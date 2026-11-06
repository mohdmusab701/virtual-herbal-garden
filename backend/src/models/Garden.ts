import mongoose, { Document, Schema } from 'mongoose';

export interface IGardenPlant {
  plantId: mongoose.Types.ObjectId;
  addedDate: Date;
  health: number;
  lastWatered?: Date;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface IGarden extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  plants: IGardenPlant[];
  createdAt: Date;
  updatedAt: Date;
}

const gardenPlantSchema = new Schema<IGardenPlant>(
  {
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    addedDate: { type: Date, default: Date.now },
    health: { type: Number, default: 100, min: 0, max: 100 },
    lastWatered: { type: Date },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
  },
  { _id: true } // keep _id for subdocuments so we can easily remove them
);

const gardenSchema = new Schema<IGarden>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, default: 'My Garden' },
    description: { type: String },
    plants: [gardenPlantSchema],
  },
  {
    timestamps: true,
  }
);

export const Garden = mongoose.model<IGarden>('Garden', gardenSchema);
