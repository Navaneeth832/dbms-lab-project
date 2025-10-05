from fastapi import APIRouter, Depends, HTTPException
import schemas, crud, auth
from database import user_collection

router = APIRouter()

@router.post("/auth/register", response_model=schemas.Token)
async def register(user: schemas.UserCreate):
    db_user = await crud.get_user_by_email(email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = await crud.create_user(user=user, hashed_password=hashed_password)
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/login", response_model=schemas.Token)
async def login(form_data: schemas.UserLogin):
    user = await crud.get_user_by_email(email=form_data.email)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

@router.post("/auth/login", response_model=schemas.Token)
async def login(form_data: schemas.UserLogin):
    user = await crud.get_user_by_email(email=form_data.email)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user
