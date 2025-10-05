from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.your_database_name

user_collection = database.get_collection("users")
task_collection = database.get_collection("tasks")
