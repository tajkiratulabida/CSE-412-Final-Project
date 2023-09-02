import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  pageVariants,
  pageTransition,
} from "../../shared/PageAnimation/PageAnimation";
import CoursesService from "./../../../service/courses.service";
import FilesService from "./../../../service/upload.service";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Loader from "./../../shared/Spinner/Loader";

class EditCourseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: {
        title: "",
        lead: "",
        description: "",
        category: "",
        difficultyLevel: "",
        whatYouWillLearn: [],
        price: "",
        duration: "",
        requirements: [],
        imageUrl: "",
        owner: this.props.teacherInfo ? this.props.teacherInfo._id : "",
      },
      lessons: [{ title: "", content: "", youtubeUrl: "", document: "" }],
      uploadingActive: false,
      fileUploading: [],
    };
    this.coursesService = new CoursesService();
    this.filesService = new FilesService();
  }

  componentDidMount = () => {
    const course_id = this.props.match.params.course_id;

    this.coursesService
      .getCourse(course_id)
      .then((res) => {
        const { lessons, ...rest } = res.data;
        const { course } = rest;
        this.setState({ course, lessons });
      })
      .catch(() => {
        this.props.history.push("/profile");
        this.props.handleToast(
          true,
          "An error has occurred, please try again later",
          "#f8d7da"
        );
      });
  };

  handleInputChange = (e) =>
    this.setState({
      course: { ...this.state.course, [e.target.name]: e.target.value },
    });

  handleLessonInputChange = (name, value, index) => {
    const newLessonArray = [...this.state.lessons];
    const object = newLessonArray[index];
    if (!object) return;
    object[name] = value;
    newLessonArray[index] = object;
    this.setState({ ...this.state, lessons: newLessonArray });
  };

  handleAddLesson = () => {
    if (this.state.fileUploading.length) return;
    const newLessonArray = this.state.lessons ? [...this.state.lessons] : [];
    newLessonArray.push({
      title: "",
      content: "",
      youtubeUrl: "",
      document: "",
    });
    this.setState({ ...this.state, lessons: newLessonArray });
  };
  handleRemoveLesson = (index) => {
    if (this.state.fileUploading.length) return;
    const newLessonArray = [...this.state.lessons];
    if (!newLessonArray[index]) return;
    newLessonArray.splice(index, 1);
    this.setState({ ...this.state, lessons: newLessonArray });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const course_id = this.props.match.params.course_id;
    const courseData = { ...this.state.course, lessons: this.state.lessons };

    this.coursesService
      .editCourse(course_id, courseData)
      .then(() => {
        this.props.history.push("/courses");
        this.props.handleToast(true, "Edit successful!", "#d4edda");
      })
      .catch(() => {
        this.props.history.push(`/teachers/${this.props.teacherInfo._id}`);
        this.props.handleToast(
          true,
          "An error has occurred, please try again later",
          "#f8d7da"
        );
      });
  };

  handleImageUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);

    this.setState({ uploadingActive: true });

    this.filesService
      .uploadImage(uploadData)
      .then((response) => {
        this.setState({
          course: { ...this.state.course, imageUrl: response.data.secure_url },
          uploadingActive: false,
        });
      })
      .catch((err) =>
        this.props.handleToast(true, err.response.data.message, "#f8d7da")
      );
  };

  handleLessonFileUpload = (e, index) => {
    const uploadData = new FormData();
    uploadData.append("file", e.target.files[0]);

    const fileUpArr = [...this.state.fileUploading];
    if (!fileUpArr.includes(index)) fileUpArr.push(index);
    this.setState({ fileUploading: fileUpArr });

    this.filesService
      .uploadFile(uploadData)
      .then((response) => {
        const newLessonArray = [...this.state.lessons];
        const object = newLessonArray[index];
        if (!object) return;
        object["document"] = response.data.secure_url;
        newLessonArray[index] = object;
        const fileUpArr = [...this.state.fileUploading];
        const fui = fileUpArr.findIndex((fi) => fi === index);
        if (fui !== -1) fileUpArr.splice(index, 1);
        this.setState({
          lessons: newLessonArray,
          fileUploading: fileUpArr,
        });
      })
      .catch((err) =>
        this.props.handleToast(true, err.response.data.message, "#f8d7da")
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
              <h1 className="mt-5">Edit Course</h1>
              <hr />
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={this.state.course.title}
                    onChange={this.handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>
                    Image (file: jpg or png)&nbsp;
                    {this.state.uploadingActive && <Loader />}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={this.handleImageUpload}
                  />
                </Form.Group>

                <Form.Group controlId="lead">
                  <Form.Label>Lead Paragraph</Form.Label>
                  <Form.Control
                    type="text"
                    name="lead"
                    value={this.state.course.lead}
                    onChange={this.handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={this.state.course.description}
                    onChange={this.handleInputChange}
                    required
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="category">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        as="select"
                        name="category"
                        value={this.state.course.category}
                        onChange={this.handleInputChange}
                      >
                        <option>Choose one option</option>
                        <option value="Design">Design</option>
                        <option value="Development">Development</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Music">Music</option>
                        <option value="Other">Other</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="difficultyLevel">
                      <Form.Label>Level</Form.Label>
                      <Form.Control
                        as="select"
                        name="difficultyLevel"
                        value={this.state.course.difficultyLevel}
                        onChange={this.handleInputChange}
                      >
                        <option>Choose one option</option>
                        <option value="All levels">All levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermidiate">Intermidiate</option>
                        <option value="Advanced">Advanced</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="whatYouWillLearn">
                  <Form.Label>Main Topics</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="whatYouWillLearn"
                    value={this.state.course.whatYouWillLearn}
                    onChange={this.handleInputChange}
                    required
                  />
                  <Form.Text id="whatYouWillLearn" muted>
                    Separate topics with commas
                  </Form.Text>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="price">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={this.state.course.price}
                        onChange={this.handleInputChange}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="duration">
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={this.state.course.duration}
                        onChange={this.handleInputChange}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="requirements">
                  <Form.Label>Requirements</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="requirements"
                    value={this.state.course.requirements}
                    onChange={this.handleInputChange}
                  />
                  <Form.Text id="requirements" muted>
                    Separate requirements with commas
                  </Form.Text>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Lessons</Form.Label>
                  {this.state.lessons?.map((lesson, index) => (
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
                </Form.Group>

                <Button
                  className="mt-3 add-course"
                  type="submit"
                  disabled={this.state.uploadingActive}
                >
                  {this.state.uploadingActive
                    ? "Image loading..."
                    : "Confirm Edition"}
                </Button>
              </Form>
              {this.state.uploadingActive || (
                <Link
                  to={`/teachers/${this.props.teacherInfo._id}`}
                  className="btn btn-outline-dark mt-5"
                  disabled
                >
                  Go back
                </Link>
              )}
            </Col>
          </Row>
        </Container>
      </motion.div>
    );
  }
}

export default EditCourseForm;
