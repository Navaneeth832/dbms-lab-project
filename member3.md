
# Member 3: User and Task Association

This guide will help you associate tasks with users and secure the task endpoints.

## 1. Update Task Model

Update the `Task` model in `models.py` to include an `assignee` field.

```python
# backend/models.py
# ... (existing code)

class Task(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    description: str
    status: str
    priority: str
    due_date: Optional[datetime] = None
    assignee_id: Optional[str] = None # This can store the user's ID
    owner_id: str # To know who created the task
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## 2. Update Task Schemas

Update the `Task` schemas in `schemas.py` to include the `assignee_id`.

```python
# backend/schemas.py
# ... (existing code)

class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    due_date: Optional[datetime] = None
    tags: List[str] = []
    assignee_id: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskInDB(TaskBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
```

## 3. Update Task Routes

Now, let's modify the task routes in `routes/tasks.py` to handle task assignment and secure the endpoints.

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
async def read_tasks(
    status: Optional[str] = None,
    assignee: Optional[str] = None,
    sort: Optional[str] = None,
    current_user: schemas.User = Depends(auth.get_current_user)
):
    filters = {"status": status, "assignee_id": assignee, "sort": sort}
    return await crud.get_tasks(owner_id=current_user.id, filters=filters)

@router.patch("/tasks/{id}/status", response_model=schemas.TaskInDB)
async def update_task_status(id: str, status_update: schemas.TaskStatusUpdate, current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.update_task_status(id=id, status=status_update.status, owner_id=current_user.id)

# You can also add a specific route to assign a task
@router.patch("/tasks/{id}/assign", response_model=schemas.TaskInDB)
async def assign_task(id: str, assignment: schemas.TaskAssignment, current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.assign_task(id=id, assignee_id=assignment.assignee_id, owner_id=current_user.id)
```

## 4. Update CRUD functions for Tasks

Update `crud.py` to handle the new filtering and assignment logic.

```python
# backend/crud.py
# ... (existing code)

async def get_tasks(owner_id: str, filters: dict):
    query = {"owner_id": owner_id}
    if filters.get("status"):
        query["status"] = filters["status"]
    if filters.get("assignee_id"):
        query["assignee_id"] = filters["assignee_id"]

    sort_field = filters.get("sort", "created_at")

    tasks = []
    async for task in task_collection.find(query).sort(sort_field):
        tasks.append(schemas.TaskInDB(**task))
    return tasks

async def update_task_status(id: str, status: str, owner_id: str):
    await task_collection.update_one(
        {"_id": ObjectId(id), "owner_id": owner_id}, {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    return await get_task(id, owner_id)

async def assign_task(id: str, assignee_id: str, owner_id: str):
    await task_collection.update_one(
        {"_id": ObjectId(id), "owner_id": owner_id}, {"$set": {"assignee_id": assignee_id, "updated_at": datetime.utcnow()}}
    )
    return await get_task(id, owner_id)
```

## 5. Add New Schemas

Add the new schemas for status updates and task assignments in `schemas.py`.

```python
# backend/schemas.py
# ... (existing code)

class TaskStatusUpdate(BaseModel):
    status: str

class TaskAssignment(BaseModel):
    assignee_id: str
```

Now the backend supports assigning tasks to users and filtering tasks based on different criteria.
