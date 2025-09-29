
# Member 4: Advanced Features and Deployment

This guide will help you implement advanced features like the dashboard overview and prepare the backend for deployment.

## 1. Implement Dashboard Endpoint

Create a new file `routes/dashboard.py` to handle the dashboard-related routes.

```python
# backend/routes/dashboard.py
from fastapi import APIRouter, Depends
from .. import schemas, crud, auth

router = APIRouter()

@router.get("/dashboard/overview", response_model=schemas.DashboardOverview)
async def get_dashboard_overview(current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.get_dashboard_overview(owner_id=current_user.id)
```

## 2. Add Dashboard Schema

Add the `DashboardOverview` schema to `schemas.py`.

```python
# backend/schemas.py
# ... (existing code)

class DashboardOverview(BaseModel):
    task_counts: dict
    upcoming_deadlines: list
```

## 3. Implement Dashboard CRUD

Add the `get_dashboard_overview` function to `crud.py`.

```python
# backend/crud.py
# ... (existing code)
from datetime import datetime, timedelta

async def get_dashboard_overview(owner_id: str):
    task_counts = {
        "todo": await task_collection.count_documents({"owner_id": owner_id, "status": "todo"}),
        "in-progress": await task_collection.count_documents({"owner_id": owner_id, "status": "in-progress"}),
        "done": await task_collection.count_documents({"owner_id": owner_id, "status": "done"}),
        "blocked": await task_collection.count_documents({"owner_id": owner_id, "status": "blocked"}),
    }

    upcoming_deadlines = []
    async for task in task_collection.find({
        "owner_id": owner_id,
        "due_date": {"$gte": datetime.utcnow(), "$lte": datetime.utcnow() + timedelta(days=7)}
    }).limit(5):
        upcoming_deadlines.append(schemas.TaskInDB(**task))

    return {
        "task_counts": task_counts,
        "upcoming_deadlines": upcoming_deadlines,
    }
```

## 4. Update main application

Update `main.py` to include the dashboard router.

```python
# backend/main.py
from fastapi import FastAPI
from .routes import users, tasks, dashboard
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, tags=["users"])
app.include_router(tasks.router, tags=["tasks"])
app.include_router(dashboard.router, tags=["dashboard"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
```

## 5. Dockerize the Application

Create a `Dockerfile` in the root of the project to containerize the backend application.

```Dockerfile
# Dockerfile
FROM python:3.9

WORKDIR /app

COPY ./backend /app/backend
COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create a `requirements.txt` file with the project dependencies.

```
fastapi
uvicorn
motor
pydantic
python-jose[cryptography]
passlib[bcrypt]
```

## 6. Deployment

You can now build and run the Docker container to deploy the backend.

```bash
docker build -t task-manager-backend .
docker run -d -p 8000:8000 task-manager-backend
```

This completes the backend development. You now have a fully functional backend with user authentication, task management, and a dashboard, ready to be deployed.
