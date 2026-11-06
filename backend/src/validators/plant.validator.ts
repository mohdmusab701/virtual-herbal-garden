import { z } from 'zod';

export const createPlantSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    scientificName: z.string().min(1, 'Scientific name is required'),
    commonNames: z.array(z.string()).optional(),
    category: z.enum(['medicinal', 'aromatic', 'indoor', 'outdoor', 'other']),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    image: z.string().url('Must be a valid URL').optional(),
    sunlight: z.enum(['low', 'medium', 'high', 'full']),
    waterRequirement: z.enum(['low', 'medium', 'high']),
    soil: z.string().min(1, 'Soil information is required'),
    temperature: z.string().min(1, 'Temperature information is required'),
    humidity: z.string().min(1, 'Humidity information is required'),
    traditionalInformation: z.string().min(10, 'Traditional information is required'),
    growingGuide: z.string().min(10, 'Growing guide is required'),
    safetyInformation: z.string().optional(),
  }),
});

export const updatePlantSchema = z.object({
  body: createPlantSchema.shape.body.partial(),
});
