import runtimeEnv from "@mars/heroku-js-runtime-env";
import axios from "axios";

const env = runtimeEnv();

export default class QuizService {
  constructor() {
    this.apiHandler = axios.create({
      baseURL: `${env.REACT_APP_API_URL}/quiz`,
      withCredentials: true,
    });
  }

  createQuiz = (courseId, quizData) =>
    this.apiHandler.post(`/createQuiz/${courseId}`, quizData);
  updateQuiz = (quizId, quizData) =>
    this.apiHandler.put(`/updateQuiz/${quizId}`, quizData);
  deleteQuiz = (quizId) => this.apiHandler.delete(`/deleteQuiz/${quizId}`);
  getQuiz = (quizId) => this.apiHandler.get(`/getQuiz/${quizId}`);
  getTeacherQuizzes = (teacherId) =>
    this.apiHandler.get(`/getTeacherQuizzes/${teacherId}`);
  getCourseQuizzes = (courseId) =>
    this.apiHandler.get(`/getCourseQuizzes/${courseId}`);
  getQuizQuestions = (quizId) => this.apiHandler.get(`/getQuestions/${quizId}`);
  submitQuiz = (quizId, submissionData) =>
    this.apiHandler.post(`/submitQuiz/${quizId}`, submissionData);
  getAllSubmissions = (quizId) =>
    this.apiHandler.get(`/getAllSubmissions/${quizId}`);
  getSubmission = (submissionId) =>
    this.apiHandler.get(`/getSubmission/${submissionId}`);
}
