import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson', // Save array of completed lesson IDs
      }
    ],
  },
  { timestamps: true }
);

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
export default CourseProgress;