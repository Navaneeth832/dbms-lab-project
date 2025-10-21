import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

ca = certifi.where()
client = AsyncIOMotorClient(MONGO_DETAILS, tlsCAFile=ca)
database = client[DB_NAME]

user_collection = database.get_collection("users")
task_collection = database.get_collection("tasks")
