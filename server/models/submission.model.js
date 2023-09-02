const mongoose = require("mongoose");
const MODEL_REFERENCES = require("./_refs");
const Schema = mongoose.Schema;

const SubmissionAnswerSchema = new Schema(
  {
    qId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    answerIndex: {
      type: Number, // index
      default: -1,
    },
  },
  { _id: false }
);

const SubmissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: MODEL_REFERENCES.USER,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: MODEL_REFERENCES.QUIZ,
    },
    answers: {
      type: [SubmissionAnswerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model(
  MODEL_REFERENCES.SUBMISSION,
  SubmissionSchema
);

module.exports = Submission;
