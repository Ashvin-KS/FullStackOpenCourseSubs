import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showDeleteButton = user && blog.user && user.username === blog.user.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={() => handleLike(blog.id)}>like</button></p>
          <p>{blog.user ? blog.user.name : 'anonymous'}</p>
          {showDeleteButton && (
            <button onClick={() => handleDelete(blog.id)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog