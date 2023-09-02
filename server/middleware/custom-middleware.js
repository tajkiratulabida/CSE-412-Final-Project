const mongoose = require("mongoose");
const { USER_ROLE } = require("../enums/user.enum");

module.exports = {
  isLoggedIn: (req, res, next) =>
    req.isAuthenticated()
      ? next()
      : res.status(403).json({ message: "Log in to access" }),
  isTeacher: (req, res, next) =>
    req.user.role === USER_ROLE.TEACHER
      ? next()
      : res.status(403).json({ message: "Unauthorized" }),
  isAdmin: (req, res, next) =>
    req.user.role === USER_ROLE.ADMIN
      ? next()
      : res.status(403).json({ message: "Unauthorized" }),
  isStudent: (req, res, next) =>
    req.user.role === USER_ROLE.STUDENT
      ? next()
      : res.status(403).json({ message: "Unauthorized" }),
  isValidId: (req, res, next) =>
    mongoose.Types.ObjectId.isValid(req.params.id)
      ? next()
      : res.status(404).json({ message: "Invalid ID" }),
};
