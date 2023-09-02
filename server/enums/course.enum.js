const COURSE_DIFFICULTY = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  ALL: "all",
};
const courseDifficulties = Object.values(COURSE_DIFFICULTY);

const COURSE_CATEGORY = {
  DESIGN: "design",
  DEVELOPMENT: "development",
  MARKETING: "marketing",
  MUSIC: "music",
  OTHER: "other",
};
const courseCategories = Object.values(COURSE_CATEGORY);

module.exports = {
  COURSE_DIFFICULTY,
  courseDifficulties,
  COURSE_CATEGORY,
  courseCategories,
};
