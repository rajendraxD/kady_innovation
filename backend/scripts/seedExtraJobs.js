// Temporary test helper: seeds extra active jobs so infinite scroll can be exercised.
// Run: node scripts/seedExtraJobs.js  (deletes itself after use is not needed; safe to re-run)
import mongoose from 'mongoose';
import { Job } from '../models/Job.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kady_hiring_portal';

const departments = ['Engineering', 'Data & AI', 'Product & Design', 'Marketing', 'Operations'];
const levels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];
const workplaces = ['Remote', 'Hybrid', 'On-site'];
const employment = ['Full-time', 'Contract', 'Part-time'];

const run = async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('[SeedExtra] Connected to', MONGO_URI);

  const existing = await Job.countDocuments();
  console.log('[SeedExtra] Existing jobs:', existing);

  const docs = Array.from({ length: 24 }, (_, i) => {
    const dep = departments[i % departments.length];
    const lvl = levels[i % levels.length];
    return {
      title: `Test Role ${String(i + 1).padStart(2, '0')} — ${dep}`,
      department: dep,
      location: 'Bengaluru / Remote',
      workplaceType: workplaces[i % workplaces.length],
      employmentType: employment[i % employment.length],
      experienceLevel: lvl,
      salaryMin: 800000 + i * 50000,
      salaryMax: 1500000 + i * 60000,
      currency: 'INR',
      description: `Auto-generated test job #${i + 1} used to validate infinite scroll pagination on the public jobs page.`,
      responsibilities: ['Build and ship features', 'Collaborate with cross-functional teams'],
      requirements: ['Self-starter', 'Strong communication'],
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      vacancies: 1,
      status: 'active',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicantsCount: 0
    };
  });

  await Job.insertMany(docs);
  const after = await Job.countDocuments();
  console.log('[SeedExtra] Inserted 24 jobs. Total jobs now:', after);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('[SeedExtra Error]', err.message);
  process.exit(1);
});
