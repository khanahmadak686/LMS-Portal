import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please set a course price'],
      default: 0,
    },
    thumbnail: {
      type: String,
      required: [true, 'Please add a thumbnail image URL'],
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;