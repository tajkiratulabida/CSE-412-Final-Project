import React, { Component, Fragment } from "react";
import { motion } from "framer-motion";
import {
  pageVariants,
  pageTransition,
} from "../../shared/PageAnimation/PageAnimation";
import CoursesService from "../../../service/courses.service";
import QuizService from "../../../service/quiz.service";
import Loader from "../../shared/Spinner/Loader";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./New-Quiz-form.css";

const getInitialQuestion = () => {
  const initialQuestion = {
    q: "",
    answers: Array(4)
      .fill(null)
      .map((_, idx) => ({ answer: "", isCorrect: idx === 0 })),
  };
  return initialQuestion;
};

class NewQuizForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      questions: [getInitialQuestion()],
      courses: [],
      course_id: "",
      createLoading: false,
    };
    this.courseService = new CoursesService();
    this.quizService = new QuizService();
  }

  componentDidMount = () => {
    this.courseService
      .getTeacherCourses(this.props.teacherInfo._id)
      .then((res) => {
        this.setState({ courses: res.data, course_id: res.data[0]?._id });
      })
      .catch((err) => {
        this.props.handleToast(
          true,
          err.response.data.message[0].msg,
          "#f8d7da"
        );
      });
  };

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  handleCourseChange = (e) => {
    this.setState({
      course_id: e.target.value,
    });
  };

  handleQuestionChange = (e, index) => {
    this.setState((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], q: e.target.value };
      return { ...prev, questions: newQuestions };
    });
  };

  handleChangeAnswerText = (e, qIndex, aIndex) => {
    this.setState((prev) => {
      const newQuestions = [...prev.questions];
      const newAnswers = [...newQuestions[qIndex].answers];
      newAnswers[aIndex].answer = e.target.value;
      newQuestions[qIndex] = { ...newQuestions[qIndex], answers: newAnswers };
      return { ...prev, questions: newQuestions };
    });
  };

  handleChangeCorrect = (e, qIndex, aIndex) => {
    console.log(qIndex, aIndex);
    this.setState((prev) => {
      const newQuestions = [...prev.questions];
      const newAnswers = newQuestions[qIndex].answers.map((ans) => ({
        ...ans,
        isCorrect: false,
      }));
      console.log(newAnswers);
      newAnswers[aIndex].isCorrect = true;
      console.log(newAnswers);
      newQuestions[qIndex] = { ...newQuestions[qIndex], answers: newAnswers };
      console.log(newQuestions);
      return { ...prev, questions: newQuestions };
    });
  };

  handleAddQuestion = () => {
    this.setState((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.push(getInitialQuestion());
      return { ...prev, questions: newQuestions };
    });
  };
  handleRemoveQuestion = (index) => {
    this.setState((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const quizData = {
      title: this.state.title,
      questions: this.state.questions,
    };

    this.quizService
      .createQuiz(this.state.course_id, quizData)
      .then(() => {
        this.props.history.push(`/teachers/${this.props.teacherInfo._id}`);
        this.props.handleToast(true, "New quiz created!", "#d4edda");
      })
      .catch((err) =>
        this.props.handleToast(
          true,
          err.response.data.message[0].msg,
          "#f8d7da"
        )
      );
  };

  render() {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }}>
              <h1 className="mt-5">Create New Quiz</h1>
              <hr />
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                    placeholder="Quiz title"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="course_id">
                  <Form.Label>Course</Form.Label>
                  <Form.Control
                    as="select"
                    name="course_id"
                    value={this.state.course_id}
                    onChange={this.handleCourseChange}
                  >
                    <option>Choose a course</option>
                    {this.state.courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Questions</Form.Label>

                  {this.state.questions.map((question, index) => (
                    <Fragment key={index.toString()}>
                      <Form.Text>Question {index + 1}</Form.Text>
                      <Form.Group controlId="q">
                        <Form.Control
                          type="text"
                          name="q"
                          value={question.q}
                          onChange={(e) => this.handleQuestionChange(e, index)}
                          placeholder="Question"
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        {question.answers.map((ans, aIndex) => (
                          <Fragment key={aIndex.toString()}>
                            <Row>
                              <Col md={8}>
                                <Form.Control
                                  type="text"
                                  name="answer"
                                  value={ans.answer}
                                  onChange={(e) =>
                                    this.handleChangeAnswerText(
                                      e,
                                      index,
                                      aIndex
                                    )
                                  }
                                  placeholder="Answer"
                                  required
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Check // prettier-ignore
                                  type="checkbox"
                                  id={`isCorrect_${index}_${aIndex}`}
                                  label="Is correct"
                                  checked={ans.isCorrect}
                                  onChange={(e) =>
                                    this.handleChangeCorrect(e, index, aIndex)
                                  }
                                />
                              </Col>
                            </Row>
                          </Fragment>
                        ))}
                      </Form.Group>
                    </Fragment>
                  ))}

                  <Button
                    type="button"
                    className="mt-2 add-question"
                    disabled={this.state.createLoading}
                    onClick={this.handleAddQuestion}
                  >
                    Add question
                  </Button>
                </Form.Group>

                {/* <Form.Group>
                  <Form.Label>Lessons</Form.Label>
                  {this.state.lessons.map((lesson, index) => (
                    <Fragment key={index.toString()}>
                      <Form.Text>Lesson {index + 1}</Form.Text>
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            as="input"
                            name="title"
                            value={lesson.title}
                            placeholder="Title"
                            onChange={(e) =>
                              this.handleLessonInputChange(
                                e.target.name,
                                e.target.value,
                                index
                              )
                            }
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            as="input"
                            name="youtubeUrl"
                            value={lesson.youtubeUrl}
                            placeholder="Youtube URL"
                            onChange={(e) =>
                              this.handleLessonInputChange(
                                e.target.name,
                                e.target.value,
                                index
                              )
                            }
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Label>
                            File (pdf)&nbsp;
                            {this.state.fileUploading.includes(index) && (
                              <Loader />
                            )}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="application/pdf"
                            multiple={false}
                            onChange={(e) =>
                              this.handleLessonFileUpload(e, index)
                            }
                          />
                        </Col>
                        <Col md={6}>
                          <Button
                            className="mt-4 btn-danger"
                            disabled={this.state.fileUploading.length}
                            onClick={() => this.handleRemoveLesson(index)}
                          >
                            Remove Lesson
                          </Button>
                        </Col>
                      </Row>
                    </Fragment>
                  ))}

                  <Button
                    type="button"
                    className="mt-2 add-lesson"
                    disabled={this.state.fileUploading.length}
                    onClick={this.handleAddLesson}
                  >
                    Add lesson
                  </Button>
                </Form.Group> */}

                <Button
                  className="mt-3 add-course"
                  type="submit"
                  disabled={this.state.createLoading}
                >
                  Create quiz
                </Button>
              </Form>
              {!this.state.createLoading ? (
                <Link
                  to={`/teachers/${this.props.teacherInfo._id}`}
                  className="btn btn-outline-dark mt-5"
                  disabled
                >
                  Go back
                </Link>
              ) : null}
            </Col>
          </Row>
        </Container>
      </motion.div>
    );
  }
}

export default NewQuizForm;
