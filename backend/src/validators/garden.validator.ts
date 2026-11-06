import { z } from 'zod';

export const createGardenSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Garden name is required'),
    description: z.string().optional(),
  }),
});

export const addPlantToGardenSchema = z.object({
  body: z.object({
    plantId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid plant ID'),
    position: z
      .object({
        x: z.number().default(0),
        y: z.number().default(0),
        z: z.number().default(0),
      })
      .optional(),
  }),
});
