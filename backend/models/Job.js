import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      index: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    workplaceType: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote'
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time'
    },
    experienceLevel: {
      type: String,
      enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'],
      default: 'Mid-level'
    },
    salaryMin: {
      type: Number,
      default: 0
    },
    salaryMax: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    responsibilities: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: [],
      index: true
    },
    vacancies: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'closed'],
      default: 'active',
      index: true
    },
    deadline: {
      type: Date
    },
    applicantsCount: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    retentionDays: {
      type: Number,
      default: 60
    }
  },
  {
    timestamps: true
  }
);


jobSchema.index({ title: 'text', description: 'text', department: 'text' });

export const Job = mongoose.model('Job', jobSchema);
