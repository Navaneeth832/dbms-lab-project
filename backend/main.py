from fastapi import FastAPI
from routes import users, tasks, dashboard
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
