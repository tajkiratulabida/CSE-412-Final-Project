const mongoose = require("mongoose");
const MODEL_REFERENCES = require("./_refs");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.USER,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.COURSE,
    },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model(
  MODEL_REFERENCES.ENROLLMENT,
  EnrollmentSchema
);

module.exports = Enrollment;
