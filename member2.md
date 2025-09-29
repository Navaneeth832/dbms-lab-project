
# Member 2: Task Management APIs

This guide will help you implement the CRUD (Create, Read, Update, Delete) APIs for tasks.

## 1. Update Data Models

First, update `models.py` to include the `Task` model.

```python
# backend/models.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    email: str
    hashed_password: str

class UserInDB(User):
    pass

class Task(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    description: str
    status: str
    priority: str
    due_date: Optional[datetime] = None
    assignee_id: Optional[str] = None
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## 2. Update Schemas

Update `schemas.py` to include schemas for creating and updating tasks.

```python
# backend/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ... (existing User schemas)

class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    due_date: Optional[datetime] = None
    tags: List[str] = []

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskInDB(TaskBase):
    id: str
    assignee_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
```

## 3. Implement CRUD operations for Tasks

In `crud.py`, add the functions to interact with the database for task-related operations.

```python
# backend/crud.py
from . import models, schemas
from .database import user_collection, task_collection
from bson import ObjectId

# ... (existing user CRUD functions)

async def create_task(task: schemas.TaskCreate, owner_id: str):
    task_dict = task.dict()
    task_dict["owner_id"] = owner_id
    await task_collection.insert_one(task_dict)
    return schemas.TaskInDB(**task_dict)

async def get_tasks(owner_id: str):
    tasks = []
    async for task in task_collection.find({"owner_id": owner_id}):
        tasks.append(schemas.TaskInDB(**task))
    return tasks

async def get_task(id: str, owner_id: str):
    task = await task_collection.find_one({"_id": ObjectId(id), "owner_id": owner_id})
    if task:
        return schemas.TaskInDB(**task)

async def update_task(id: str, task: schemas.TaskUpdate, owner_id: str):
    task_dict = task.dict(exclude_unset=True)
    task_dict["updated_at"] = datetime.utcnow()
    await task_collection.update_one(
        {"_id": ObjectId(id), "owner_id": owner_id}, {"$set": task_dict}
    )
    updated_task = await get_task(id, owner_id)
    return updated_task

async def delete_task(id: str, owner_id: str):
    await task_collection.delete_one({"_id": ObjectId(id), "owner_id": owner_id})
```

## 4. Create Task Routes

In `routes/tasks.py`, define the API routes for task management.

```python
# backend/routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from .. import schemas, crud, auth
from typing import List

router = APIRouter()

@router.post("/tasks", response_model=schemas.TaskInDB)
async def create_task(task: schemas.TaskCreate, current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.create_task(task=task, owner_id=current_user.id)

@router.get("/tasks", response_model=List[schemas.TaskInDB])
async def read_tasks(current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.get_tasks(owner_id=current_user.id)

@router.get("/tasks/{id}", response_model=schemas.TaskInDB)
async def read_task(id: str, current_user: schemas.User = Depends(auth.get_current_user)):
    db_task = await crud.get_task(id=id, owner_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.put("/tasks/{id}", response_model=schemas.TaskInDB)
async def update_task(id: str, task: schemas.TaskUpdate, current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.update_task(id=id, task=task, owner_id=current_user.id)

@router.delete("/tasks/{id}", status_code=204)
async def delete_task(id: str, current_user: schemas.User = Depends(auth.get_current_user)):
    await crud.delete_task(id=id, owner_id=current_user.id)
```

## 5. Update main application

Update `main.py` to include the task routes.

```python
# backend/main.py
from fastapi import FastAPI
from .routes import users, tasks

app = FastAPI()

app.include_router(users.router, tags=["users"])
app.include_router(tasks.router, tags=["tasks"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
```

## 6. Add `get_current_user` to `auth.py`

You'll need a function in `auth.py` to get the current user from the token.

```python
# backend/auth.py
# ... (existing code)
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from . import schemas, crud

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await crud.get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
```

You now have a complete set of CRUD APIs for managing tasks.
