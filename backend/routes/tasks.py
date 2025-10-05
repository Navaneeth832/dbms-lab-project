from fastapi import APIRouter, Depends, HTTPException
import schemas, crud, auth
from typing import List, Optional

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

@router.patch("/tasks/{id}/status", response_model=schemas.TaskInDB)
async def update_task_status(id: str, status_update: schemas.TaskStatusUpdate, current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.update_task_status(id=id, status=status_update.status, owner_id=current_user.id)

@router.patch("/tasks/{id}/assign", response_model=schemas.TaskInDB)
async def assign_task(id: str, assignment: schemas.TaskAssignment, current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.assign_task(id=id, assignee_id=assignment.assignee_id, owner_id=current_user.id)
