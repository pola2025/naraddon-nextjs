import mongoose from 'mongoose';

const examinerProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['funding', 'certification', 'export', 'manufacturing', 'startup', 'general'],
      default: 'general',
    },
    brandIcon: {
      type: String,
      default: 'fas fa-building',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    consultCount: {
      type: Number,
      default: 0,
    },
    imageKey: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    imageAlt: {
      type: String,
      trim: true,
    },
    expertiseTags: [String],
    expertiseDescription: {
      type: String,
      trim: true,
    },
    expertiseDetail: [String],
    specialties: [String],
    sortOrder: {
      type: Number,
      default: 0,
    },
    legacyKey: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'examinerprofiles',
  }
);

// 인덱스 설정
examinerProfileSchema.index({ isPublished: 1, sortOrder: 1 });
examinerProfileSchema.index({ category: 1 });
examinerProfileSchema.index({ imageKey: 1 });
examinerProfileSchema.index({ legacyKey: 1 });

const ExaminerProfile =
  mongoose.models.ExaminerProfile || mongoose.model('ExaminerProfile', examinerProfileSchema);

export default ExaminerProfile;