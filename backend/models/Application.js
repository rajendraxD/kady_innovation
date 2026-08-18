import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      unique: true,
      index: true
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
      index: true
    },
    jobTitle: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: ''
    },
    personalInfo: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true, index: true },
      phone: { type: String, required: true, trim: true },
      city: { type: String, default: '' },
      country: { type: String, default: '' },
      portfolioUrl: { type: String, default: '' },
      linkedinUrl: { type: String, default: '' },
      githubUrl: { type: String, default: '' }
    },
    experience: {
      totalYears: { type: Number, default: 0 },
      currentCompany: { type: String, default: '' },
      currentDesignation: { type: String, default: '' },
      noticePeriodDays: { type: Number, default: 30 },
      currentCtc: { type: Number, default: 0 },
      expectedCtc: { type: Number, default: 0 }
    },
    education: {
      highestDegree: { type: String, default: '' },
      fieldOfStudy: { type: String, default: '' },
      institution: { type: String, default: '' },
      graduationYear: { type: Number, default: 2024 },
      grade: { type: String, default: '' }
    },
    skills: {
      type: [String],
      default: [],
      index: true
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume document is required']
    },
    resumeFileName: {
      type: String,
      default: 'resume.pdf'
    },
    coverLetter: {
      type: String,
      default: ''
    },
    stage: {
      type: String,
      enum: [
        'applied',
        'screening',
        'interview_1',
        'technical_round',
        'final_round',
        'offered',
        'hired',
        'rejected'
      ],
      default: 'applied',
      index: true
    },
    hrNotes: [
      {
        note: { type: String, required: true },
        author: { type: String, default: 'Admin' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    scorecard: {
      technical: { type: Number, min: 0, max: 5, default: 0 },
      communication: { type: Number, min: 0, max: 5, default: 0 },
      problemSolving: { type: Number, min: 0, max: 5, default: 0 },
      cultureFit: { type: Number, min: 0, max: 5, default: 0 },
      overall: { type: Number, min: 0, max: 5, default: 0 },
      recommendation: {
        type: String,
        enum: ['', 'Strong Hire', 'Hire', 'Hold', 'Reject'],
        default: ''
      },
      feedbackText: { type: String, default: '' }
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85
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

applicationSchema.pre('save', function () {
  if (!this.applicationNumber) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().getFullYear();
    this.applicationNumber = `APP-${datePrefix}-${randomSuffix}`;
  }
});

export const Application = mongoose.model('Application', applicationSchema);
