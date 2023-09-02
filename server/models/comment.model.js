const mongoose = require("mongoose");
const MODEL_REFERENCES = require("./_refs");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.USER,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: MODEL_REFERENCES.COURSE,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model(MODEL_REFERENCES.COMMENT, CommentSchema);

module.exports = Comment;
