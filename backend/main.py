import os

# Define the file and folder structure
files = [
    "database.py",
    "models.py",
    "schemas.py",
    "auth.py",
    "crud.py"
]
routes_folder = "routes"
routes_files = [
    "routes/tasks.py",
    "routes/users.py"
]
for file in files:
    with open(file, 'w') as f:
        f.write("")  # Create an empty file

# Create the routes folder and its files
os.makedirs(routes_folder, exist_ok=True)
for file in routes_files:
    with open(file, 'w') as f:
        f.write("")  # Create an empty file

print("Files and folders created successfully!")