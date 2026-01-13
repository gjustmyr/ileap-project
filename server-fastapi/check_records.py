from database import SessionLocal
from models import DailyOJTRecord, Student
from sqlalchemy import desc

db = SessionLocal()

# Check all records
records = db.query(DailyOJTRecord).order_by(desc(DailyOJTRecord.record_date)).limit(10).all()

print(f"\n{'='*60}")
print(f"DAILY OJT RECORDS IN DATABASE")
print(f"{'='*60}\n")
print(f"Total records found: {len(records)}\n")

if records:
    for r in records:
        student = db.query(Student).filter(Student.student_id == r.student_id).first()
        print(f"Record ID: {r.record_id}")
        print(f"Student: {student.first_name} {student.last_name if student else 'Unknown'} (ID: {r.student_id})")
        print(f"Date: {r.record_date}")
        print(f"Time In: {r.time_in}")
        print(f"Time Out: {r.time_out}")
        print(f"Tasks: {r.task_for_the_day}")
        print(f"Accomplishments: {r.accomplishment_for_the_day}")
        print(f"Status: {r.status}")
        print(f"{'-'*60}\n")
else:
    print("❌ No OJT attendance records found in database!")
    print("\n💡 Students need to:")
    print("   1. Log in to the Student Trainee portal (port 4600)")
    print("   2. Go to OEAMS tab")
    print("   3. Clock In for the day")
    print("   4. Add tasks and accomplishments")
    print("   5. Clock Out")
    print("\nThen the records will appear in the supervisor portal.\n")

db.close()
