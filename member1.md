
# Member 1: Project Setup and User Authentication

This guide will walk you through setting up the FastAPI project, connecting to a MongoDB database, and implementing user authentication.

## 1. Set up the development environment

First, you need to have Python and pip installed. Then, install the required libraries:

```bash
pip install fastapi uvicorn motor pydantic python-jose[cryptography] passlib[bcrypt]
```

## 2. Project Structure

Create the following directory structure for the backend:

```
backend/
├── auth.py
├── crud.py
├── database.py
├── main.py
├── models.py
├── schemas.py
└── routes/
    ├── tasks.py
    └── users.py
```

## 3. Connect to MongoDB

Create a `database.py` file to handle the connection to your MongoDB database.

```python
# backend/database.py
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.your_database_name

user_collection = database.get_collection("users")
```

## 4. Define Data Models

In `models.py`, define the Pydantic models for your data. These models will be used for data validation and serialization.

```python
# backend/models.py
from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    email: str
    hashed_password: str

class UserInDB(User):
    pass
```

## 5. Implement User Authentication

Create an `auth.py` file to handle user authentication, including password hashing and JWT creation.

```python
# backend/auth.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

## 6. Create User Routes

In `routes/users.py`, define the API routes for user registration and login.

```python
# backend/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from .. import schemas, crud, auth
from ..database import user_collection

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
```

## 7. Define Schemas

In `schemas.py`, define the Pydantic schemas for request and response data.

```python
# backend/schemas.py
from pydantic import BaseModel
from typing import Optional

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
```

## 8. Implement CRUD operations for Users

In `crud.py`, write the functions to interact with the database for user-related operations.

```python
# backend/crud.py
from . import models, schemas
from .database import user_collection

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
```

## 9. Create the main application

Finally, in `main.py`, create the FastAPI application and include the user routes.

```python
# backend/main.py
from fastapi import FastAPI
from .routes import users

app = FastAPI()

app.include_router(users.router, tags=["users"])

@app.get("/")
def read_root():
    return {"Hello": "World"}
```

## 10. Run the application

You can run the application using `uvicorn`:

```bash
uvicorn backend.main:app --reload
```

You now have a working FastAPI backend with user authentication and a connection to your MongoDB database.
