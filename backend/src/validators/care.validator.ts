import { z } from 'zod';

export const createCareTaskSchema = z.object({
  body: z.object({
    plantId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid plant ID'),
    gardenId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid garden ID'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    taskType: z.enum(['watering', 'sunlight', 'fertilizing', 'soil_check', 'general']),
    scheduledDate: z.string().datetime(),
  }),
});

export const updateCareTaskSchema = z.object({
  body: createCareTaskSchema.shape.body.partial().extend({
    completed: z.boolean().optional(),
  }),
});
