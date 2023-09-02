const mongoose = require("mongoose");
const MODEL_REFERENCES = require("./_refs");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema(
  {
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const QuestionSchema = new Schema({
  q: { type: String, required: true },
  answers: { type: [AnswerSchema], default: [] },
});

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.COURSE,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.TEACHER,
    },
    questions: {
      type: [QuestionSchema],
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model(MODEL_REFERENCES.QUIZ, QuizSchema);

module.exports = Quiz;
