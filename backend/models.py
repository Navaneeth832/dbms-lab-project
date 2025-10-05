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
    owner_id: str # To know who created the task
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
