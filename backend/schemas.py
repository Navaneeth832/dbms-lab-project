from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    email: str


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

class TaskStatusUpdate(BaseModel):
    status: str

class TaskAssignment(BaseModel):
    assignee_id: str

class DashboardOverview(BaseModel):
    task_counts: dict
    upcoming_deadlines: list
