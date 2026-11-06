import { DiseaseScan } from '../models/DiseaseScan';

export class DiseaseService {
  static async createScan(userId: string, imageUrl: string) {
    return DiseaseScan.create({
      userId,
      imageUrl,
      status: 'processing',
    });
  }

  static async updateScanResult(scanId: string, aiResult: any) {
    return DiseaseScan.findByIdAndUpdate(
      scanId,
      {
        prediction: aiResult.prediction,
        confidence: aiResult.confidence,
        symptoms: aiResult.symptoms,
        generalGuidance: aiResult.generalGuidance,
        status: 'completed',
      },
      { new: true }
    );
  }

  static async getHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return DiseaseScan.find({ userId })
      .populate('plantId', 'name scientificName image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  static getDisclaimer() {
    return "This result is for educational purposes and is not a professional diagnosis. Always consult an expert if unsure.";
  }
}
