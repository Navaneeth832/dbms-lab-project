import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client[DB_NAME]

user_collection = database.get_collection("users")
task_collection = database.get_collection("tasks")
