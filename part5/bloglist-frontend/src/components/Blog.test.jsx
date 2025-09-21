import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'Component testing is fun',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 10,
    user: { name: 'Test User' }
  }

  render(<Blog blog={blog} />)

  // Check that title and author are rendered
  screen.getByText('Component testing is fun Test Author')

  // Check that URL and likes are NOT rendered by default
  const urlElement = screen.queryByText('http://test.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes 10')
  expect(likesElement).toBeNull()
})

test('URL and likes are shown when the view button is clicked', async () => {
  const blog = {
    title: 'Component testing is fun',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 10,
    user: { name: 'Test User' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // Check that URL and likes are now rendered
  screen.getByText('http://test.com')
  screen.getByText('likes 10')
})

test('like button event handler is called twice when clicked twice', async () => {
  const blog = {
    title: 'Component testing is fun',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 10,
    user: { name: 'Test User' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton) // Show details to reveal like button

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})