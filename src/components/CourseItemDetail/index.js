import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CourseItemDetail extends Component {
  state = {CourseItem: [], apiStatus: apiStatusConstant.initial}

  componentDidMount() {
    this.getCourseItemDetails()
  }

  getCourseItemDetails = async () => {
    const {apiStatus} = this.state
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/te/courses/${id}`)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.course_details.id,
        description: data.course_details.description,
        imageUrl: data.course_details.image_url,
        name: data.course_details.name,
      }
      this.setState({
        CourseItem: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#1e293b" height={50} width={50} />
    </div>
  )

  retryAllCoursesDetails = () => {
    this.getCourseItemDetails()
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
        onClick={this.retryAllCoursesDetails}
      >
        Retry
      </button>
    </div>
  )

  renderCourseDetails = () => {
    const {CourseItem} = this.state
    const {description, imageUrl, name} = CourseItem
    return (
      <div className="container">
        <div className="details-container">
          <img src={imageUrl} alt={name} className="image" />
          <div className="desc-container">
            <h1 className="title">{name}</h1>
            <p className="desc">{description}</p>
          </div>
        </div>
      </div>
    )
  }

  renderAllCoursesDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderCourseDetails()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllCoursesDetails()}
      </>
    )
  }
}

export default CourseItemDetail
