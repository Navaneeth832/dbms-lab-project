import asyncio
from database import user_collection

async def test():
    # Insert a test user
    result = await user_collection.insert_one({"name": "Test User"})
    print("Inserted ID:", result.inserted_id)

    # Fetch all users
    users = await user_collection.find().to_list(100)
    print("Users:", users)

asyncio.run(test())
