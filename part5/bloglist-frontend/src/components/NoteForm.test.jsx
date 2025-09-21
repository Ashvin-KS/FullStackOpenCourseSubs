import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from './NoteForm'

test('new blog form calls event handler with right details', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const titleInput = screen.getByPlaceholderText('write note content here') // Assuming placeholder is used for content
  const saveButton = screen.getByText('save')

  await user.type(titleInput, 'testing a form...')
  await user.click(saveButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})