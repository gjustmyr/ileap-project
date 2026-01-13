import sys
sys.path.insert(0, 'C:/Users/Justmyr/Documents/dyasmir-projects/ILEAP/server-fastapi')

from database import SessionLocal
from models import DailyOJTRecord
from datetime import datetime

db = SessionLocal()

# Get all submitted records for student ID 3
records = db.query(DailyOJTRecord).filter(
    DailyOJTRecord.student_id == 3,
    DailyOJTRecord.status == "submitted"
).all()

print(f"Found {len(records)} submitted records")

for record in records:
    record.status = "approved"
    record.validated_at = datetime.now()
    record.validated_by = 1  # Supervisor ID (corrected from 5 to 1)
    print(f"✓ Approved record {record.record_id} - Date: {record.record_date.date()}")

db.commit()
print(f"\n✅ Successfully approved {len(records)} attendance records!")
print("\nHours breakdown:")

total_hours = 0
for record in records:
    if record.time_in and record.time_out:
        hours = (record.time_out - record.time_in).total_seconds() / 3600
        total_hours += hours
        print(f"  - {record.record_date.date()}: {hours:.2f} hours")

print(f"\nTotal approved hours: {total_hours:.2f}")
print(f"Remaining to 486 hours: {486 - total_hours:.2f}")
print(f"Progress: {(total_hours/486)*100:.2f}%")

db.close()
