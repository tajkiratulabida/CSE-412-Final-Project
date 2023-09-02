const mongoose = require("mongoose");
const MODEL_REFERENCES = require("./_refs");
const {
  courseDifficulties,
  COURSE_DIFFICULTY,
  courseCategories,
  COURSE_CATEGORY,
} = require("../enums/course.enum");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  youtubeUrl: { type: String },
  document: { type: String },
});

const CourseSchema = new Schema(
  {
    imageUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    },
    title: {
      type: String,
      unique: true,
      required: true,
      maxlength: 60,
    },
    lead: { type: String },
    category: {
      type: String,
      enum: courseCategories,
      default: COURSE_CATEGORY.OTHER,
    },
    difficultyLevel: {
      type: String,
      enum: courseDifficulties,
      default: COURSE_DIFFICULTY.ALL,
    },
    description: {
      type: String,
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    lessons: {
      type: [LessonSchema],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.TEACHER,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model(MODEL_REFERENCES.COURSE, CourseSchema);

module.exports = Course;
