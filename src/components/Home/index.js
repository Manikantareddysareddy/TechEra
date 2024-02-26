import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import CourseItem from '../CourseItem'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {coursesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCourses()
  }

  getCourses = async () => {
    const {apiStatus} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/te/courses')

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.courses.map(eachItem => ({
        id: eachItem.id,
        logoUrl: eachItem.logo_url,
        name: eachItem.name,
      }))
      this.setState({
        coursesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#1e293b" height={50} width={50} />
    </div>
  )

  retryAllCourses = () => {
    this.getCourses()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png "
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-btn"
        onClick={this.retryAllCourses}
      >
        Retry
      </button>
    </div>
  )

  renderCourses = () => {
    const {coursesList} = this.state
    return (
      <Link to="/" className="link-item">
        <div className="bg-container">
          <h1 className="heading">Courses</h1>
          <ul className="ul-container">
            {coursesList.map(eachCourse => (
              <CourseItem Course={eachCourse} key={eachCourse.id} />
            ))}
          </ul>
        </div>
      </Link>
    )
  }

  renderAllCourses = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCourses()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllCourses()}
      </>
    )
  }
}
export default Home
