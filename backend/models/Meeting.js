import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true
    },
    candidateName: {
      type: String,
      required: true
    },
    candidateEmail: {
      type: String,
      required: true
    },
    jobTitle: {
      type: String,
      required: true
    },
    round: {
      type: String,
      enum: ['Initial Screening', 'Technical Round', 'System Design', 'Managerial Round', 'HR / Final Round'],
      default: 'Technical Round'
    },
    interviewerName: {
      type: String,
      required: true
    },
    interviewerEmail: {
      type: String,
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true
    },
    durationMinutes: {
      type: Number,
      default: 45
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/kady-interview-session'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    notes: {
      type: String,
      default: ''
    },
    feedback: {
      rating: { type: Number, min: 0, max: 5, default: 0 },
      comments: { type: String, default: '' },
      recommendation: {
        type: String,
        enum: ['', 'Strong Hire', 'Hire', 'Hold', 'Reject'],
        default: ''
      }
    }
  },
  {
    timestamps: true
  }
);

export const Meeting = mongoose.model('Meeting', meetingSchema);
