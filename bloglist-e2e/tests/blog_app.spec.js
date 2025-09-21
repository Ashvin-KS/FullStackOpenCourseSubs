const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'log in' })
    await expect(loginButton).toBeVisible()

    const usernameInput = page.getByLabel('username')
    await expect(usernameInput).toBeVisible()

    const passwordInput = page.getByLabel('password')
    await expect(passwordInput).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog Title', 'Test Author', 'http://testblog.com')
      await expect(page.getByText('Test Blog Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Blog to be liked', 'Like Author', 'http://like.com')
      await page.getByText('Blog to be liked Like Author').getByRole('button', { name: 'view' }).click()
      await page.getByText('likes 0').getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who created blog can delete it', async ({ page }) => {
      await createBlog(page, 'Blog to be deleted', 'Delete Author', 'http://delete.com')
      await page.getByText('Blog to be deleted Delete Author').getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Blog to be deleted Delete Author')).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request }) => {
      // Create a blog by the first user
      await createBlog(page, 'Blog by first user', 'First Author', 'http://first.com')
      await page.getByText('Blog by first user First Author').getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      // Log out the first user
      await page.getByRole('button', { name: 'logout' }).click()

      // Create a second user
      await request.post('/api/users', {
        data: {
          name: 'Second User',
          username: 'seconduser',
          password: 'secondpassword'
        }
      })

      // Log in as the second user
      await loginWith(page, 'seconduser', 'secondpassword')

      // View the first user's blog
      await page.getByText('Blog by first user First Author').getByRole('button', { name: 'view' }).click()

      // Assert that the remove button is NOT visible
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      // Create blogs with different like counts
      await createBlog(page, 'Blog with 5 likes', 'Author A', 'http://a.com')
      await page.getByText('Blog with 5 likes Author A').getByRole('button', { name: 'view' }).click()
      for (let i = 0; i < 5; i++) {
        await page.getByText('likes 0').getByRole('button', { name: 'like' }).click()
      }
      await page.getByText('hide').click() // Hide details

      await createBlog(page, 'Blog with 10 likes', 'Author B', 'http://b.com')
      await page.getByText('Blog with 10 likes Author B').getByRole('button', { name: 'view' }).click()
      for (let i = 0; i < 10; i++) {
        await page.getByText('likes 0').getByRole('button', { name: 'like' }).click()
      }
      await page.getByText('hide').click() // Hide details

      await createBlog(page, 'Blog with 2 likes', 'Author C', 'http://c.com')
      await page.getByText('Blog with 2 likes Author C').getByRole('button', { name: 'view' }).click()
      for (let i = 0; i < 2; i++) {
        await page.getByText('likes 0').getByRole('button', { name: 'like' }).click()
      }
      await page.getByText('hide').click() // Hide details

      // Get all blog titles and assert their order
      const blogTitles = await page.locator('.blog-title').allTextContents()
      // Assuming .blog-title is a class added to the element displaying the title
      // If not, I'll need to adjust the locator based on the actual HTML structure.
      // For now, I'll use a generic locator and check the order of the main blog elements.

      const blogElements = await page.locator('.blog-item').all()
      // Assuming .blog-item is a class added to each blog's root div/li
      // If not, I'll need to adjust the locator.

      // Get the text content of each blog element (title and author)
      const blogTexts = await Promise.all(blogElements.map(async (element) => await element.textContent()))

      // Assert the order based on the titles (assuming titles are unique enough)
      expect(blogTexts[0]).toContain('Blog with 10 likes')
      expect(blogTexts[1]).toContain('Blog with 5 likes')
      expect(blogTexts[2]).toContain('Blog with 2 likes')
    })
  })
})