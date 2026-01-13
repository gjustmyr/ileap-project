import sys
sys.path.insert(0, 'C:/Users/Justmyr/Documents/dyasmir-projects/ILEAP/server-fastapi')

from database import SessionLocal
from models import DailyOJTRecord

db = SessionLocal()

# Get all records for student ID 3 (Jose Reyes)
all_records = db.query(DailyOJTRecord).filter(
    DailyOJTRecord.student_id == 3
).order_by(DailyOJTRecord.record_date).all()

print(f"Total records for Jose Reyes (student_id=3): {len(all_records)}\n")

for record in all_records:
    print(f"Record ID: {record.record_id}")
    print(f"  Date: {record.record_date.date()}")
    print(f"  Time In: {record.time_in}")
    print(f"  Time Out: {record.time_out}")
    print(f"  Status: {record.status}")
    print(f"  Validated By: {record.validated_by}")
    print()

db.close()
