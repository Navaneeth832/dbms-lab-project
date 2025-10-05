# Team Task Manager API 🚀

This project is a FastAPI backend for a task management system. It provides a RESTful API for user authentication, task management, and a dashboard to track progress. It's built with Python and uses MongoDB as the database.

-----

## Features ✨

  * **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
  * **Task Management**: Full CRUD (Create, Read, Update, Delete) functionality for tasks.
  * **Task Assignment**: Assign tasks to users and update task status.
  * **Dashboard Overview**: A dashboard endpoint that provides a summary of task counts by status and upcoming deadlines.

-----

## Project Setup 🛠️

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/navaneeth832/dbms-lab-project
    cd dbms-lab-project/backend
    ```

2.  **Install dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

    The dependencies are: `fastapi`, `uvicorn`, `motor`, `pydantic`, `python-jose[cryptography]`, and `passlib[bcrypt]`.

3.  **Set up environment variables**:
    Create a `.env` file in the `backend/` directory with your MongoDB connection details. The user's provided `.env` file contains the following example values:

    ```
    MONGO_URI=mongodb+srv://mittunavan_db_user:A1eU9W1WbcPmaaBU@cluster0.8owcrmg.mongodb.net
    DB_NAME=team_task_manager
    ```

4.  **Run the application**:

    ```bash
    uvicorn main:app --reload
    ```

-----

## API Endpoints 📝

### User Authentication (`/auth`)

  * `POST /auth/register` - Register a new user and return an access token.
  * `POST /auth/login` - Login with user credentials and return an access token.
  * `GET /users/me` - Get the current authenticated user's details.

### Task Management (`/tasks`)

  * `POST /tasks` - Create a new task.
  * `GET /tasks` - Retrieve a list of tasks. Supports filtering by `status`, `assignee`, and sorting.
  * `GET /tasks/{id}` - Retrieve a single task by its ID.
  * `PUT /tasks/{id}` - Update an existing task.
  * `DELETE /tasks/{id}` - Delete a task.
  * `PATCH /tasks/{id}/status` - Update the status of a task.
  * `PATCH /tasks/{id}/assign` - Assign a task to a user.

### Dashboard (`/dashboard`)

  * `GET /dashboard/overview` - Get a summary of task counts and upcoming deadlines for the authenticated user.

-----

## Deployment 📦

The application can be containerized using Docker. A `Dockerfile` is provided for this purpose.

### Dockerfile

```dockerfile
# Dockerfile
FROM python:3.9

WORKDIR /app

COPY ./backend /app/backend
COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

Use the following commands to build and run the Docker container:

```bash
docker build -t task-manager-backend .
docker run -d -p 8000:8000 task-manager-backend
```