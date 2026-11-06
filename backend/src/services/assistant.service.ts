import { ChatMessage } from '../models/ChatMessage';
import { CareTask } from '../models/CareTask';

export class AssistantService {
  static async chat(userId: string, message: string) {
    // Save user message
    await ChatMessage.create({
      userId,
      role: 'user',
      message
    });

    // Generate mock assistant response
    let response = "I'm your herbal garden assistant. I can help you with plant care, identification, and managing your virtual garden.";
    
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('water') || lowercaseMessage.includes('watering')) {
      const todayTasks = await CareTask.find({ 
        userId, 
        taskType: 'watering',
        completed: false
      }).populate('plantId', 'name');
      
      if (todayTasks.length > 0) {
        const plantNames = todayTasks.map((t: any) => t.plantId?.name).filter(Boolean).join(', ');
        response = `You need to water the following plants today: ${plantNames}.`;
      } else {
        response = "You don't have any pending watering tasks for today. Great job!";
      }
    } else if (lowercaseMessage.includes('tulsi') || lowercaseMessage.includes('basil')) {
      response = "Tulsi (Holy Basil) requires full sunlight and moderate watering. Ensure the soil is well-drained to prevent root rot.";
    }

    // Save assistant message
    const assistantMsg = await ChatMessage.create({
      userId,
      role: 'assistant',
      message: response
    });

    return assistantMsg;
  }

  static async getHistory(userId: string) {
    return ChatMessage.find({ userId }).sort({ createdAt: 1 }).limit(50);
  }
}
