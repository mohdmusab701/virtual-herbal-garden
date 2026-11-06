import { Garden } from '../models/Garden';

export class GardenService {
  static async getMyGardens(userId: string) {
    return Garden.find({ userId }).populate('plants.plantId');
  }

  static async getGardenById(id: string, userId: string) {
    const garden = await Garden.findOne({ _id: id, userId }).populate('plants.plantId');
    if (!garden) throw new Error('Garden not found');
    return garden;
  }

  static async createGarden(userId: string, data: any) {
    return Garden.create({ userId, ...data });
  }

  static async addPlantToGarden(gardenId: string, userId: string, data: any) {
    const garden = await Garden.findOne({ _id: gardenId, userId });
    if (!garden) throw new Error('Garden not found');

    garden.plants.push({
      plantId: data.plantId,
      addedDate: new Date(),
      health: 100,
      position: data.position || { x: 0, y: 0, z: 0 },
    } as any);

    await garden.save();
    return garden.populate('plants.plantId');
  }

  static async removePlantFromGarden(gardenId: string, userId: string, plantId: string) {
    const garden = await Garden.findOne({ _id: gardenId, userId });
    if (!garden) throw new Error('Garden not found');

    garden.plants = garden.plants.filter(p => p.plantId.toString() !== plantId) as any;
    
    await garden.save();
    return garden.populate('plants.plantId');
  }

  static async getGardenStats(gardenId: string, userId: string) {
    const garden = await Garden.findOne({ _id: gardenId, userId }).populate('plants.plantId');
    if (!garden) throw new Error('Garden not found');

    const totalPlants = garden.plants.length;
    const healthyPlants = garden.plants.filter(p => p.health > 70).length;
    const plantsNeedingCare = garden.plants.filter(p => p.health <= 70).length;
    
    const speciesSet = new Set(garden.plants.map(p => p.plantId.toString()));
    const speciesCount = speciesSet.size;

    return {
      totalPlants,
      healthyPlants,
      plantsNeedingCare,
      speciesCount
    };
  }
}
