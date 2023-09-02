const mongoose = require("mongoose");
const MODEL_REFERENCES = require("./_refs");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: (text) => text.charAt(0).toUpperCase() + text.substring(1),
    },
    surname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: (text) => text.charAt(0).toUpperCase() + text.substring(1),
    },
    jobOccupation: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    },
    socials: {
      linkedin: { type: String },
      website: { type: String },
      youtube: { type: String },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.USER,
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model(MODEL_REFERENCES.TEACHER, TeacherSchema);

module.exports = Teacher;
