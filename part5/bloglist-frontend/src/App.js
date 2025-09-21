import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(noteObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewNote('')
      setNotificationMessage(`A new blog '${returnedBlog.title}' by ${returnedBlog.author} added!`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch (exception) {
      setNotificationMessage('Error adding blog')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleLike = async (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id)
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...returnedBlog, user: blogToUpdate.user }))
      setNotificationMessage(`Liked blog '${returnedBlog.title}' by ${returnedBlog.author}!`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch (exception) {
      setNotificationMessage('Error liking blog')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove blog '${blogToDelete.title}' by ${blogToDelete.author}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotificationMessage(`Blog '${blogToDelete.title}' removed!`)
        setNotificationType('success')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 5000)
      } catch (exception) {
        setNotificationMessage('Error removing blog')
        setNotificationType('error')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 5000)
      }
    }
  }

  const toggleImportanceOf = (id) => {
    // This function is no longer directly used for blogs, but keeping it for now
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const blogsToShow = showAll
    ? sortedBlogs
    : sortedBlogs.filter(blog => blog.important)

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(`Welcome ${user.name}`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch (exception) {
      setNotificationMessage('Wrong credentials')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setNotificationMessage('Logged out')
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notificationMessage} type={notificationType} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'all' : 'important'}
        </button>
      </div>
      <ul>
        {blogsToShow.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user} // Pass the user object to Blog component
            toggleImportance={() => toggleImportanceOf(blog.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default App