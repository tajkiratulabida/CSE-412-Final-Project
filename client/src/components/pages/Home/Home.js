import { useState } from 'react'
import { motion } from 'framer-motion'
import CoursesService from '../../../service/courses.service'
import { Container, Row, Carousel, Col, Image } from 'react-bootstrap'
import './Home.css'
// import CourseCard from './../../shared/CourseCard/Course-card'
import RandomCard from './Random-card'
import Loader from '../../shared/Spinner/Loader'

import Hero from './Hero'
import Features from './Features'
import Banner from './Banner'



const Home = props => {
  const coursesService = new CoursesService()

  const [courses, setCourses] = useState(() => {
    coursesService.getRandomCourses()
      .then(response => setCourses(response.data))
      .catch(() => {
        props.history.push('/courses')
        props.handleToast(true, 'An error has occurred, please try again later', '#f8d7da')
      })
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

      <Hero title='Strive for Excellence' p1='Learning keeps you in the lead.' />

      <section className="container-fluid about" >
        <Container>
          <Row className="d-flex align-items-center">

            {/* <Col md={6}>
              <Image style={{ width: '100%' }} src="https://res.cloudinary.com/dodneiokm/image/upload/v1608222311/project3-ironhack/freedemt_x0s3mo.png" />
            </Col> */}
            <Col md={6}>

              <h2 className="mb-3">About us</h2>
              <p>We Are HappyLearn, an on-line learning platform. We help organizations of all kinds prepare for the ever-evolving future of work.</p>
              

            </Col>
          </Row>

        </Container>
      </section>



      {/* Carousel */}
      <Container>
        <section className="carousel-section mt-5">
          <h2 className="mt-5 mb-5 text-center ">Explore our schools to find your perfect program</h2>

          {courses ?
            <Carousel className='carousel'>

              <Carousel.Item >
                <Row>
                  {[...courses].slice(0, 4).map(elm =>
                    /* <CourseCard key={elm._id} {...elm} /> */
                    <RandomCard key={elm._id} {...elm} />
                  )}
                </Row>
              </Carousel.Item>
              <Carousel.Item >
                <Row>
                  {[...courses].slice(4, 8).map(elm =>
                    /* <CourseCard key={elm._id} {...elm} /> */
                    <RandomCard key={elm._id} {...elm} />
                  )}
                </Row>
              </Carousel.Item>
            </Carousel>
            : <Loader />
          }

        </section>
      </Container>
      <Banner title='Make the most of your online learning experience' text='Our teachers will help you learn while staying home.' />

      {/* Features */}
      <Features />

    </motion.div>
  )
}

export default Home