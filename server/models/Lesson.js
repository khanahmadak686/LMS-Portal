import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a lesson title'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Please upload a video lecture'],
    },
    pdfUrl: {
      type: String, // PDF notes (Optional)
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;