import {Link} from 'react-router-dom'

import './index.css'

const CourseItem = props => {
  const {Course} = props
  const {id, logoUrl, name} = Course
  return (
    <Link to={`/courses/${id}`} className="link-item">
      <li className="list-item">
        <img src={logoUrl} alt={name} className="imageEl" />
        <p className="courseName">{name}</p>
      </li>
    </Link>
  )
}

export default CourseItem
