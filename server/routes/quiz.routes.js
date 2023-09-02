const express = require("express");
const {
  isLoggedIn,
  isTeacher,
  isValidId,
  isStudent,
} = require("../middleware/custom-middleware");
const { check, validationResult } = require("express-validator");
const Quiz = require("../models/quiz.model");
const Submission = require("../models/submission.model");
const Course = require("../models/course.model");
const router = express.Router();

const quizChecks = [
  check("title")
    .isString()
    .isLength({ min: 4 })
    .withMessage("Title should be valid"),
  check("questions")
    .isArray({ min: 1 })
    .withMessage("A quiz should have at least 1 question"),
  check("question.*.q")
    .isLength({ min: 4 })
    .withMessage("Question should be valid"),
  check("question.*.answers")
    .isArray({ min: 2 })
    .withMessage("At least 2 options should be given for a question"),
];

router.post(
  "/createQuiz/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  quizChecks,
  async (req, res) => {
    try {
      const passCheck = validationResult(req);
      if (!passCheck.isEmpty()) {
        res.status(400).json({ message: passCheck.errors });
        return;
      }

      const course = await Course.findOne({ _id: req.params.id });
      if (!course) return res.status(404).json({ message: "Course not found" });

      const quiz = await new Quiz({
        title: req.body.title,
        questions: req.body.questions,
        course: req.params.id,
        teacher: course.owner,
      }).save();
      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.put(
  "/updateQuiz/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  quizChecks,
  async (req, res) => {
    try {
      const passCheck = validationResult(req);
      if (!passCheck.isEmpty()) {
        res.status(400).json({ message: passCheck.errors });
        return;
      }

      const quiz = await Quiz.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            questions: req.body.questions,
          },
        },
        { new: true }
      );
      res.json(quiz);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.delete(
  "/deleteQuiz/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  async (req, res) => {
    try {
      await Quiz.findOneAndDelete({ _id: req.params.id });
      res.json({ message: "Quiz deleted" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get(
  "/getQuiz/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({ _id: req.params.id });
      res.json(quiz);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get("/getTeacherQuizzes/:id", isValidId, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacher: req.params.id }).populate(
      "course"
    );
    res.json(quizzes);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getCourseQuizzes/:id", isValidId, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.id }).populate(
      "course"
    );
    res.json(quizzes);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get(
  "/getQuestions/:id",
  isLoggedIn,
  isStudent,
  isValidId,
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({ _id: req.params.id }).populate(
        "course teacher"
      );
      const questions = quiz.toJSON().questions.map((q) => ({
        ...q,
        answers: q.answers.map((a) => ({ answer: a.answer })),
      }));
      res.json({
        title: quiz.title,
        questions: questions,
        course: quiz.course,
        teacher: quiz.teacher,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.post(
  "/submitQuiz/:id",
  isLoggedIn,
  isStudent,
  isValidId,
  [check("answers").isArray().withMessage("Answers must be valid")],
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({ _id: req.params.id });
      const submission = await new Submission({
        user: req.user._id,
        quiz: quiz._id,
        answers: req.body.answers,
      }).save();

      // check answers and count points
      let points = 0;
      submission.toJSON().answers.forEach((answer) => {
        const question = quiz.questions.find((q) => {
          return q._id.toString() === answer.qId.toString();
        });
        if (!question) return;
        const correctAnswerIndex = question.answers.findIndex(
          (a) => a.isCorrect
        );
        if (correctAnswerIndex === -1) return;
        if (Number(answer.answerIndex) === correctAnswerIndex) {
          points++;
        }
      });

      res.json({ points, submission, quiz });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get(
  "/getAllSubmissions/:id",
  isLoggedIn,
  isTeacher,
  isValidId,
  async (req, res) => {
    try {
      const submissions = await Submission.find({ quiz: req.params.id });
      res.json(submissions);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get("/getSubmission/:id", isLoggedIn, isValidId, async (req, res) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.id });
    res.json(submission);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
