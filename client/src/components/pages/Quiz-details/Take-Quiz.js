import React, { Component, Fragment } from "react";
import { motion } from "framer-motion";
import Loader from "../../shared/Spinner/Loader";
import { Container, Button, Form } from "react-bootstrap";
import "./Take-Quiz.css";
import QuizService from "../../../service/quiz.service";

class TakeQuiz extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      course: undefined,
      teacher: undefined,
      questions: [],
      submissionAnswers: [],
      submitLoading: false,
      showPoints: false,
      points: undefined,
    };
    this.quizService = new QuizService();
  }

  componentDidMount = () => this.refreshQuiz();

  refreshQuiz = () => {
    const quiz_id = this.props.match.params.quiz_id;
    this.quizService
      .getQuizQuestions(quiz_id)
      .then((res) => {
        const { title, questions, course, teacher } = res.data;
        const submissionAnswers = questions.map((q) => ({
          qId: q._id,
          answerIndex: -1,
        }));
        this.setState({ questions, title, course, teacher, submissionAnswers });
      })
      .catch((_err) => {
        this.props.history.push("/courses");
        this.props.handleToast(
          true,
          "An error has occurred, please try again later",
          "#f8d7da"
        );
      });
  };

  handleClickAnswer = (qIndex, aIndex) => {
    this.setState((prev) => {
      const newAnswers = [...prev.submissionAnswers];
      const answerObj = newAnswers[qIndex];
      answerObj.answerIndex = aIndex;
      newAnswers[qIndex] = answerObj;
      return { ...prev, submissionAnswers: newAnswers };
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ submitLoading: true });

    const answers = this.state.submissionAnswers;
    this.quizService
      .submitQuiz(this.props.match.params.quiz_id, { answers })
      .then((res) => {
        const points = res.data.points;
        this.setState({ showPoints: true, points });
      })
      .catch((_err) => {
        this.props.handleToast(
          true,
          "An error has occurred, please try again later",
          "#f8d7da"
        );
      })
      .finally(() => {
        this.setState({ submitLoading: false });
      });
  };

  render() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container className="course-details ">
          {this.state.questions.length ? (
            <>
              <h3>{this.state.title}</h3>
              <h5>
                Teacher: {this.state.teacher.name}&nbsp;
                {this.state.teacher.surname}
              </h5>
              <h5 className="mb-5">Course: {this.state.course.title}</h5>
              {this.state.showPoints ? (
                <>
                  <h3>You got {this.state.points} points!</h3>
                </>
              ) : (
                <>
                  <h4 className="font-weight-bold mb-2">Questions:</h4>
                  <Form onSubmit={this.handleSubmit}>
                    {this.state.questions.map((question, index) => {
                      const answerObj = this.state.submissionAnswers.find(
                        (s) => s.qId === question._id
                      );
                      return (
                        <Fragment key={question._id}>
                          <p className="">
                            <span className="font-weight-bold">
                              {index + 1}.
                            </span>{" "}
                            {question.q}
                          </p>

                          {question.answers.map((ans, aIndex) => {
                            return (
                              <Form.Check
                                key={question._id + "_" + aIndex}
                                id={question._id + "_" + aIndex}
                                name={question._id}
                                label={<p>{ans.answer}</p>}
                                checked={answerObj.answerIndex === aIndex}
                                type="radio"
                                onChange={() =>
                                  this.handleClickAnswer(index, aIndex)
                                }
                              />
                            );
                          })}
                        </Fragment>
                      );
                    })}

                    <Button className="btn-success mt-4 btn-lg" type="submit">
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </>
          ) : (
            <Loader />
          )}
        </Container>
      </motion.div>
    );
  }
}

export default TakeQuiz;
