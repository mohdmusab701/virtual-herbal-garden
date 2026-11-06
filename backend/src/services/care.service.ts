import { CareTask } from '../models/CareTask';

export class CareService {
  static async getTasks(userId: string, query: any) {
    const filter: any = { userId };
    
    if (query.completed !== undefined) {
      filter.completed = query.completed === 'true';
    }
    if (query.plantId) {
      filter.plantId = query.plantId;
    }
    if (query.gardenId) {
      filter.gardenId = query.gardenId;
    }
    
    return CareTask.find(filter)
      .populate('plantId', 'name image')
      .sort({ scheduledDate: 1 });
  }

  static async getTodayTasks(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    return CareTask.find({
      userId,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('plantId', 'name image');
  }

  static async createTask(userId: string, data: any) {
    return CareTask.create({ userId, ...data });
  }

  static async updateTask(id: string, userId: string, data: any) {
    const task = await CareTask.findOneAndUpdate(
      { _id: id, userId },
      data,
      { new: true, runValidators: true }
    );
    if (!task) throw new Error('Task not found');
    return task;
  }

  static async markComplete(id: string, userId: string) {
    const task = await CareTask.findOneAndUpdate(
      { _id: id, userId },
      { completed: true, completedAt: new Date() },
      { new: true }
    );
    if (!task) throw new Error('Task not found');
    return task;
  }

  static async deleteTask(id: string, userId: string) {
    const task = await CareTask.findOneAndDelete({ _id: id, userId });
    if (!task) throw new Error('Task not found');
    return task;
  }
}
