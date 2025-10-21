# 🧠 Team Task Manager 🚀

A **full-stack Task Management System** built with **FastAPI (Python)** for the backend and a modern **JavaScript framework** (like React/Vite) for the frontend.  
It provides a clean and secure REST API for managing users, tasks, and dashboards using **MongoDB** as the database.

---

## ✨ Features

- 🔒 **User Authentication** – Secure registration and login using JWT tokens.  
- 🧾 **Task Management** – Full CRUD operations for tasks.  
- 👥 **Task Assignment** – Assign tasks to specific users and update their status.  
- 📊 **Dashboard Overview** – Summarized data on task counts, deadlines, and progress.  

---

## ⚙️ Backend Setup (FastAPI + MongoDB)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/navaneeth832/dbms-lab-project
cd dbms-lab-project/backend
````

### 2️⃣ Install Dependencies

Make sure you have **Python 3.9+** and `pip` installed.

```bash
pip install -r requirements.txt
```

**Main dependencies:**
`fastapi`, `uvicorn`, `motor`, `pydantic`, `python-jose[cryptography]`, `passlib[bcrypt]`

---

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the `backend/` directory and add the following:

```env
MONGO_URI=your_mongodb_connection_string_here
DB_NAME=team_task_manager
```

> ⚠️ **Do not commit this file** to GitHub.
> Make sure `.env` is included in your `.gitignore` file.

If you're using **MongoDB Atlas**:

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Add your current IP address under **Network Access**
4. Create a **Database User** and use that in your `MONGO_URI`

---

### 4️⃣ Run the Backend Server

```bash
uvicorn main:app --reload
```

Server will start at:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 💻 Frontend Setup (React/Vite)

Assuming your frontend is located in the `/frontend` folder.

### 1️⃣ Navigate to the Frontend Directory

```bash
cd ../frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

Frontend will run on:
👉 **[http://localhost:5173](http://localhost:5173)** (or the port shown in your terminal)

---

## 🔗 Connecting Frontend & Backend

In your frontend’s `.env` (or `.env.local`) file, add:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This allows your frontend to communicate with the FastAPI backend.

---

## 📦 Deployment (Docker)

A `Dockerfile` is included for easy containerization.

### Build and Run

```bash
docker build -t task-manager-backend .
docker run -d -p 8000:8000 task-manager-backend
```

---

## 🧠 API Endpoints

### 🔐 Authentication (`/auth`)

* `POST /auth/register` → Register new user
* `POST /auth/login` → Login and receive JWT token
* `GET /users/me` → Get current user info

### 📝 Tasks (`/tasks`)

* `POST /tasks` → Create a task
* `GET /tasks` → List all tasks (supports filters)
* `GET /tasks/{id}` → Get task by ID
* `PUT /tasks/{id}` → Update task
* `DELETE /tasks/{id}` → Delete task
* `PATCH /tasks/{id}/status` → Update task status
* `PATCH /tasks/{id}/assign` → Assign a task to a user

### 📊 Dashboard (`/dashboard`)

* `GET /dashboard/overview` → Get task summary and upcoming deadlines

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a new branch:

   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:

   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch and open a Pull Request 🚀

---

## 🛡️ Notes

* Keep your `.env` file **private** — never commit credentials.
* Each user cloning this repo must **set up their own MongoDB cluster**.
* For production:

  * Use a **secure JWT secret**
  * Disable `--reload` in Uvicorn
  * Use proper CORS and HTTPS setup

---

## 👨‍💻 Author

**Made with ❤️ by [Navaneeth (Mitu)](https://github.com/navaneeth832)**

---
