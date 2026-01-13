import sys
sys.path.insert(0, 'C:/Users/Justmyr/Documents/dyasmir-projects/ILEAP/server-fastapi')

from database import SessionLocal
from models import TraineeSupervisor, User

db = SessionLocal()

# Get the supervisor user by email_address
supervisor_user = db.query(User).filter(User.email_address == 'justminegutierrez@gmail.com').first()

if supervisor_user:
    print(f"User ID: {supervisor_user.user_id}")
    
    # Get the supervisor record
    supervisor = db.query(TraineeSupervisor).filter(
        TraineeSupervisor.user_id == supervisor_user.user_id
    ).first()
    
    if supervisor:
        print(f"Supervisor ID: {supervisor.supervisor_id}")
        print(f"Supervisor Email: {supervisor.email}")
    else:
        print("No supervisor record found - need to create one!")
else:
    print("User not found!")

# List all supervisors
all_supervisors = db.query(TraineeSupervisor).all()
print(f"\nAll supervisors in database: {len(all_supervisors)}")
for sup in all_supervisors:
    print(f"  - Supervisor ID: {sup.supervisor_id}, User ID: {sup.user_id}, Email: {sup.email}")

db.close()
