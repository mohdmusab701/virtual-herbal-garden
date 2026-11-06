import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Plant } from '../models/Plant';
import { User } from '../models/User';
import { hashPassword } from '../utils/password';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/herbiva_ai';

const medicinalPlants = [
  {
    name: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    commonNames: ['Holy Basil'],
    category: 'medicinal',
    sunlight: 'high',
    waterRequirement: 'medium',
    soil: 'Well-drained, fertile soil with pH 6.0-7.5',
    temperature: '20-35°C (68-95°F)',
    humidity: '40-60%',
    description: 'Tulsi is one of the most sacred plants in Indian tradition, widely cultivated for its aromatic leaves and traditional significance.',
    traditionalInformation: 'In Ayurvedic tradition, Tulsi is known as "The Queen of Herbs". Note: This information is for educational purposes only.',
    growingGuide: 'Grows well in warm, sunny conditions. Plant seeds in well-drained soil. Pinch growing tips to encourage bushy growth.',
    safetyInformation: 'Generally safe, but may affect blood-thinning medications.',
  },
  {
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    commonNames: ['Indian Lilac'],
    category: 'medicinal',
    sunlight: 'full',
    waterRequirement: 'low',
    soil: 'Well-drained sandy or loamy soil',
    temperature: '21-32°C (70-90°F)',
    humidity: '30-50%',
    description: 'Neem is a fast-growing evergreen tree known for its drought resistance and traditional applications.',
    traditionalInformation: 'Every part of the tree has been used in various traditional preparations. It is commonly known as the "village pharmacy".',
    growingGuide: 'Prefer full sun and well-drained soil. They are drought-resistant once established.',
    safetyInformation: 'Neem oil should not be consumed internally by pregnant women or young children.',
  },
  {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    commonNames: ['Aloe'],
    category: 'indoor',
    sunlight: 'medium',
    waterRequirement: 'low',
    soil: 'Sandy, well-draining cactus mix',
    temperature: '13-27°C (55-80°F)',
    humidity: '30-50%',
    description: 'A succulent plant species known for its thick, fleshy leaves containing a clear gel.',
    traditionalInformation: 'The gel from its leaves has been widely used in traditional skincare and wellness practices.',
    growingGuide: 'Plant in a container with drainage holes using cactus/succulent potting mix. Water deeply but infrequently.',
    safetyInformation: 'The outer leaf latex contains aloin, which acts as a strong laxative. Only consume purified inner gel.',
  },
  {
    name: 'Mint',
    scientificName: 'Mentha spicata',
    commonNames: ['Spearmint', 'Garden Mint'],
    category: 'aromatic',
    sunlight: 'medium',
    waterRequirement: 'high',
    soil: 'Rich, moist, slightly acidic soil',
    temperature: '15-21°C (55-70°F)',
    humidity: '40-60%',
    description: 'A popular aromatic herb known for its refreshing scent and cooling taste.',
    traditionalInformation: 'Traditionally used to soothe digestive issues and as a culinary herb.',
    growingGuide: 'Mint spreads aggressively. It is best grown in containers to prevent it from taking over the garden.',
    safetyInformation: 'Generally safe for culinary use. Large medicinal doses should be avoided by pregnant women.',
  },
  {
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    commonNames: ['Ginger root'],
    category: 'medicinal',
    sunlight: 'low',
    waterRequirement: 'high',
    soil: 'Rich, moist, well-draining potting mix',
    temperature: '22-25°C (71-77°F)',
    humidity: '70-90%',
    description: 'A flowering plant whose rhizome is widely used as a spice and a folk medicine.',
    traditionalInformation: 'Used globally in traditional practices for digestive comfort and general wellness.',
    growingGuide: 'Plant rhizomes in shallow trenches. Requires high humidity and protection from strong winds and direct afternoon sun.',
    safetyInformation: 'May interact with blood thinners. Use moderation if you have gallstones.',
  },
  {
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    commonNames: ['Indian saffron'],
    category: 'medicinal',
    sunlight: 'medium',
    waterRequirement: 'high',
    soil: 'Well-drained, rich organic soil',
    temperature: '20-30°C (68-86°F)',
    humidity: '60-80%',
    description: 'A rhizomatous herbaceous perennial plant of the ginger family.',
    traditionalInformation: 'Contains curcumin. Extensively used in Ayurveda for its beneficial properties.',
    growingGuide: 'Similar to ginger. Needs warm temperatures, regular watering, and partial shade.',
    safetyInformation: 'Dietary amounts are safe. High doses may act as a blood thinner.',
  },
  {
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    commonNames: ['Water Hyssop'],
    category: 'medicinal',
    sunlight: 'medium',
    waterRequirement: 'high',
    soil: 'Wet, boggy or completely submerged',
    temperature: '22-28°C (72-82°F)',
    humidity: '70-90%',
    description: 'A non-aromatic herb that grows in wet, tropical environments.',
    traditionalInformation: 'Traditionally used in Ayurveda to support cognitive function and memory.',
    growingGuide: 'Requires constant moisture. Can be grown in bogs, water gardens, or very wet soil.',
    safetyInformation: 'May cause stomach upset if taken on an empty stomach.',
  },
  {
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    commonNames: ['Indian Ginseng', 'Winter Cherry'],
    category: 'medicinal',
    sunlight: 'full',
    waterRequirement: 'low',
    soil: 'Sandy, well-draining alkaline soil',
    temperature: '20-35°C (68-95°F)',
    humidity: '20-40%',
    description: 'An evergreen shrub that grows in India, the Middle East, and parts of Africa.',
    traditionalInformation: 'An important adaptogen in Ayurvedic tradition, used to help the body manage stress.',
    growingGuide: 'Drought tolerant. Avoid waterlogged soil. Harvest roots after berries turn red.',
    safetyInformation: 'Avoid during pregnancy. May interact with thyroid and blood pressure medications.',
  },
  {
    name: 'Lemongrass',
    scientificName: 'Cymbopogon citratus',
    commonNames: ['Fever grass'],
    category: 'aromatic',
    sunlight: 'full',
    waterRequirement: 'medium',
    soil: 'Rich, loamy soil',
    temperature: '20-30°C (68-86°F)',
    humidity: '50-70%',
    description: 'A tropical island plant in the grass family, known for its strong lemon scent.',
    traditionalInformation: 'Used in traditional teas for its calming properties and digestive support.',
    growingGuide: 'Thrives in full sun and warmth. Must be brought indoors during winter in cold climates.',
    safetyInformation: 'Generally safe in food amounts. Essential oil must be diluted before topical use.',
  },
  {
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    commonNames: ['English Lavender'],
    category: 'aromatic',
    sunlight: 'full',
    waterRequirement: 'low',
    soil: 'Sandy, alkaline, extremely well-draining',
    temperature: '15-25°C (60-77°F)',
    humidity: '20-40%',
    description: 'A popular perennial herb known for its beautiful purple flowers and relaxing fragrance.',
    traditionalInformation: 'Traditionally used in aromatherapy to promote relaxation and sleep.',
    growingGuide: 'Requires excellent drainage. Prune lightly in spring and after flowering to maintain shape.',
    safetyInformation: 'Safe for most people. Some may have allergic skin reactions to the essential oil.',
  }
];

const runSeed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Plant.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing plants and users');

    // Seed plants
    const plants = await Plant.insertMany(medicinalPlants);
    console.log(`🌱 Successfully seeded ${plants.length} plants`);

    // Create an admin user
    const adminPassword = await hashPassword('admin123');
    await User.create({
      name: 'Admin User',
      email: 'admin@herbiva.ai',
      password: adminPassword,
      role: 'admin'
    });
    console.log('👑 Admin user created (admin@herbiva.ai / admin123)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();
