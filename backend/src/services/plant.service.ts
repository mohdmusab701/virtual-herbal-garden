import { Plant } from '../models/Plant';

export class PlantService {
  static async getAllPlants(query: any) {
    const { page = 1, limit = 12, search, category } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};
    if (search) {
      filter.$text = { $search: search as string };
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    const plants = await Plant.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Plant.countDocuments(filter);

    return {
      plants,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  static async getPlantById(id: string) {
    const plant = await Plant.findById(id).populate('model3d');
    if (!plant) {
      throw new Error('Plant not found');
    }
    return plant;
  }

  static async createPlant(data: any) {
    return Plant.create(data);
  }

  static async updatePlant(id: string, data: any) {
    const plant = await Plant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!plant) {
      throw new Error('Plant not found');
    }
    return plant;
  }

  static async deletePlant(id: string) {
    const plant = await Plant.findByIdAndDelete(id);
    if (!plant) {
      throw new Error('Plant not found');
    }
    return plant;
  }
}
