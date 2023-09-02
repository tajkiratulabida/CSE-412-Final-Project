const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Course = require("../models/course.model");
const {
  isLoggedIn,
  isTeacher,
  isValidId,
  isStudent,
} = require("../middleware/custom-middleware");
const Enrollment = require("../models/enrollment.model");
const {
  courseCategories,
  courseDifficulties,
} = require("../enums/course.enum");
const Teacher = require("../models/teacher.model");

router.get("/sampleCourses", async (_req, res) => {
  try {
    const response = await Course.aggregate([{ $sample: { size: 8 } }]);
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getAllCourses", async (_req, res) => {
  try {
    const response = await Course.find().populate("owner");
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getTeacherCourses/:id", isValidId, async (req, res) => {
  try {
    const response = await Course.find({ owner: req.params.id });
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/enroll/:id", isStudent, isValidId, async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrolled = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });
    if (enrolled) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await new Enrollment({
      user: req.user._id,
      course: course._id,
    }).save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getOneCourse/:id", isValidId, async (req, res) => {
  try {
    let enrolled;
    if (req.user) {
      enrolled = await Enrollment.findOne({
        user: req.user._id,
        course: req.params.id,
      });
    }

    let selection =
      "imageUrl title lead category difficultyLevel description whatYouWillLearn price duration requirements owner";
    if (enrolled) selection += " lessons";

    const course = await Course.findOne({ _id: req.params.id })
      .select(selection)
      .populate("owner");

    res.json({ course, enrolled });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post(
  "/newCourse",
  isLoggedIn,
  isTeacher,
  [
    check("title")
      .isLength({ min: 10 })
      .withMessage("Title should have min 10 characters.")
      .custom((value) => {
        return Course.findOne({ title: value }).then((course) => {
          if (course) {
            return Promise.reject("The title already exists, try another one");
          }
        });
      }),

    check("lead")
      .isLength({ min: 5 })
      .withMessage("Enter any lead paragraph field"),

    check("description")
      .isLength({ min: 20 })
      .withMessage("Write a few words that describe your course"),

    check("whatYouWillLearn")
      .isLength({ min: 5 })
      .withMessage("Include some topics"),

    check("requirements")
      .isLength({ min: 5 })
      .withMessage("Include some requirements"),

    check("category")
      .isIn(courseCategories)
      .withMessage("You must choose a category"),

    check("difficultyLevel")
      .isIn(courseDifficulties)
      .withMessage("You must choose a level"),
    check("lessons")
      .isArray({ min: 1 })
      .withMessage("At least one lesson is required"),
    check("lessons.*.title")
      .isString()
      .isLength({ min: 5 })
      .withMessage("A lesson needs a title"),
    check("lessons.*.content").isString().optional(),
    check("lessons.*.youtubeUrl").isString().optional(),
    check("lessons.*.document").isString().optional(),
  ],
  async (req, res) => {
    try {
      const passCheck = validationResult(req);

      if (!passCheck.isEmpty()) {
        res.status(400).json({ message: passCheck.errors });
        return;
      }

      const teacher = await Teacher.findOne({ user: req.user._id });
      if (!teacher) {
        res.status(409).json({ message: "Teacher profile does not exist" });
        return;
      }

      const mainTopicsArr = req.body.whatYouWillLearn
        .split(",")
        .map((elm) => elm.charAt(0).toUpperCase() + elm.substring(1));
      const requirementsArr = req.body.requirements
        .split(",")
        .map((elm) => elm.charAt(0).toUpperCase() + elm.substring(1));

      const course = await Course.create({
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        lead: req.body.lead,
        category: req.body.category,
        difficultyLevel: req.body.difficultyLevel,
        description: req.body.description,
        whatYouWillLearn: mainTopicsArr,
        price: req.body.price,
        requirements: requirementsArr,
        lessons: req.body.lessons,
        duration: req.body.duration,
        owner: teacher._id,
      });

      res.status(201).json(course);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.put(
  "/editCourse/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  async (req, res) => {
    try {
      const mainTopicsArr =
        typeof req.body.whatYouWillLearn === "string"
          ? req.body.whatYouWillLearn
              .split(",")
              .map((elm) => elm.charAt(0).toUpperCase() + elm.substring(1))
          : req.body.whatYouWillLearn;
      const requirementsArr =
        typeof req.body.requirements === "string"
          ? req.body.requirements
              .split(",")
              .map((elm) => elm.charAt(0).toUpperCase() + elm.substring(1))
          : req.body.requirements;

      const course = await Course.findByIdAndUpdate(req.params.id, {
        $set: {
          imageUrl: req.body.imageUrl,
          title: req.body.title,
          lead: req.body.lead,
          category: req.body.category,
          difficultyLevel: req.body.difficultyLevel,
          description: req.body.description,
          whatYouWillLearn: mainTopicsArr,
          price: req.body.price,
          requirements: requirementsArr,
          lessons: req.body.lessons,
          duration: req.body.duration,
        },
      });

      res.json(course);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.delete(
  "/deleteTeacherCourses/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  async (req, res) => {
    try {
      await Course.deleteMany({ owner: req.params.id });
      res.json({ message: "Successfully deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.delete(
  "/deleteCourse/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  async (req, res) => {
    try {
      await Course.findByIdAndDelete(req.params.id);
      res.json({ message: "Course Deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = router;
