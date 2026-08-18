import { connectDB } from '../config/db.js';
import { seedInitialData } from '../utils/seedData.js';

const run = async () => {
  await connectDB();
  await seedInitialData();
  console.log('Seeding complete. Exiting...');
  process.exit(0);
};

run().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
