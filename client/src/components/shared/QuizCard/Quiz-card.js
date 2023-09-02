import { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import "./Quiz-card.css";
import Popup from "../Popup/Popup";
import DeleteMessage from "../Delete-message/DeleteMessage";

const QuizCard = (props) => {
  const [showModal, modalState] = useState(false);

  function handleModal(visible) {
    modalState(visible);
  }

  return (
    <Col xs={{ span: 10, offset: 1 }} sm={{ span: 6, offset: 0 }} md={4} lg={3}>
      <Card className="quiz-card">
        <Card.Body>
          <Card.Title className="quiz-title mb-2">
            {props.title.substring(0, 35)}...
          </Card.Title>
          <Card.Text className="details  mb-2">{props.course.title}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-around align-items-center">
              {props.teacherInfo && props.teacher === props.teacherInfo._id ? (
                <>
                  {/* <Link
                    to={`/profile-teacher/edit-quiz/${props._id}`}
                    className="btn btn-info mr-2"
                  >
                    Edit
                  </Link> */}
                  {props.deleteQuiz ? (
                    <Button
                      onClick={() => handleModal(true)}
                      className="btn btn-danger"
                    >
                      Delete
                    </Button>
                  ) : null}
                </>
              ) : props.userInfo?.role === "student" ? (
                <>
                  <Link
                    to={`/take-quiz/${props._id}`}
                    className="btn btn-info mr-2"
                  >
                    Take quiz
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </Card.Body>
      </Card>

      <Popup show={showModal} handleModal={handleModal} color={"#f8d7da"}>
        <DeleteMessage />
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button variant="secondary" onClick={() => handleModal(false)}>
              Close
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              variant="danger"
              onClick={() => props.deleteQuiz(props._id)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Popup>
    </Col>
  );
};

export default QuizCard;
