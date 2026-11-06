import mongoose, { Document, Schema } from 'mongoose';

export interface ICareTask extends Document {
  userId: mongoose.Types.ObjectId;
  plantId: mongoose.Types.ObjectId;
  gardenId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  taskType: 'watering' | 'sunlight' | 'fertilizing' | 'soil_check' | 'general';
  scheduledDate: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

const careTaskSchema = new Schema<ICareTask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plantId: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    gardenId: { type: Schema.Types.ObjectId, ref: 'Garden', required: true },
    title: { type: String, required: true },
    description: { type: String },
    taskType: {
      type: String,
      enum: ['watering', 'sunlight', 'fertilizing', 'soil_check', 'general'],
      required: true,
    },
    scheduledDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const CareTask = mongoose.model<ICareTask>('CareTask', careTaskSchema);
