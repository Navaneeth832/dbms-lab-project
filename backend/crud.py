import models, schemas
from database import user_collection, task_collection
from bson import ObjectId
from datetime import datetime, timedelta

async def get_user_by_email(email: str):
    row = await user_collection.find_one({"email": email})
    if row:
        return models.UserInDB(**row)

async def create_user(user: schemas.UserCreate, hashed_password: str):
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    await user_collection.insert_one(user_dict)
    new_user = await get_user_by_email(email=user.email)
    return new_user

async def create_task(task: schemas.TaskCreate, owner_id: str):
    task_dict = task.dict()
    task_dict["owner_id"] = owner_id
    await task_collection.insert_one(task_dict)
    return schemas.TaskInDB(**task_dict)

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
