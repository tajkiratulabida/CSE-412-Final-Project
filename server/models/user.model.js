const mongoose = require("mongoose");
const MODEL_REFERENCES = require("./_refs");
const { userRoles, USER_ROLE } = require("../enums/user.enum");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: userRoles,
      default: USER_ROLE.STUDENT,
    },
    imageUrl: {
      type: String,
      default:
        "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png",
    },
    favCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: MODEL_REFERENCES.COURSE,
      },
    ],
    favTeachers: [
      {
        type: Schema.Types.ObjectId,
        ref: MODEL_REFERENCES.TEACHER,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model(MODEL_REFERENCES.USER, UserSchema);

module.exports = User;
