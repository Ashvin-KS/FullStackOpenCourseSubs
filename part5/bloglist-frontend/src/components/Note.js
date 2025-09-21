import { useState } from 'react'

const Note = ({ blog, handleLike, toggleImportance }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const noteStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={noteStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={() => handleLike(blog.id)}>like</button></p>
          <p>{blog.user ? blog.user.name : 'anonymous'}</p>
        </div>
      )}
    </div>
  )
}

export default Note