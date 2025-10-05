from fastapi import APIRouter, Depends
import schemas, crud, auth

router = APIRouter()

@router.get("/dashboard/overview", response_model=schemas.DashboardOverview)
async def get_dashboard_overview(current_user: schemas.User = Depends(auth.get_current_user)):
    return await crud.get_dashboard_overview(owner_id=current_user.id)
