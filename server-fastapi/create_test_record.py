from database import SessionLocal
from models import DailyOJTRecord, Student, InternshipApplication
from datetime import datetime, timedelta

db = SessionLocal()

# Get Jose Reyes
student = db.query(Student).filter(Student.sr_code == "12-34569").first()

if not student:
    print("❌ Student not found!")
    db.close()
    exit()

print(f"✓ Found student: {student.first_name} {student.last_name} (ID: {student.student_id})")

# Get their application
application = db.query(InternshipApplication).filter(
    InternshipApplication.student_id == student.student_id,
    InternshipApplication.status == "accepted"
).first()

if not application:
    print("❌ No accepted application found!")
    db.close()
    exit()

print(f"✓ Found application ID: {application.application_id}")

# Create test records for the past few days
test_dates = [
    datetime.now() - timedelta(days=2),
    datetime.now() - timedelta(days=1),
    datetime.now()
]

for i, record_date in enumerate(test_dates):
    time_in = record_date.replace(hour=8, minute=0, second=0)
    time_out = record_date.replace(hour=17, minute=0, second=0)
    
    record = DailyOJTRecord(
        student_id=student.student_id,
        internship_application_id=application.application_id,
        record_date=record_date,
        time_in=time_in,
        time_out=time_out,
        task_for_the_day=f"Day {i+1}: Worked on web development tasks, fixed bugs, attended team meetings",
        accomplishment_for_the_day=f"Day {i+1}: Completed 3 bug fixes, implemented new features, learned React hooks",
        remarks=None,
        status="submitted",  # Ready for supervisor validation
        submitted_at=time_out
    )
    
    db.add(record)
    print(f"✓ Created record for {record_date.date()}")

db.commit()
print("\n✅ Successfully created 3 test attendance records!")
print("\nNow the supervisor can:")
print("1. Log in to Supervisor Portal (port 4700)")
print("2. Go to Attendance tab")
print("3. Select 'Jose Reyes' from the dropdown")
print("4. See the attendance records with tasks and accomplishments")
print("5. Approve, reject, or edit the records\n")

db.close()
