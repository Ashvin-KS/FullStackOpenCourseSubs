# Bloglist Backend

A Node.js/Express.js backend for a blog list application, implementing user authentication, blog management (CRUD), and E2E testing support.

## Features

- User authentication (login, registration)
- JWT-based authorization
- Blog CRUD operations (Create, Read, Update, Delete)
- MongoDB integration
- Testing endpoints for E2E tests

## Setup

1.  Navigate to the project directory: `cd C:\myself\nonclgstuffs\Learning\WebDev\part4\bloglist`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the root of the project with the following environment variables:
    ```
    MONGODB_URI=<your_mongodb_connection_string_for_development>
    TEST_MONGODB_URI=<your_mongodb_connection_string_for_testing>
    PORT=3001
    SECRET=<a_strong_secret_key_for_jwt>
    ```

## Running the Application

-   **Development Mode:** `npm run dev` (starts the server with nodemon for auto-reloads)
-   **Production Mode:** `npm start`
-   **Test Mode (for E2E tests):** `npm run start:test`

## Running Tests

-   **Unit/Integration Tests:** `npm test`
