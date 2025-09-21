const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('write blog title here').fill(title)
  await page.getByPlaceholder('write blog author here').fill(author)
  await page.getByPlaceholder('write blog url here').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }