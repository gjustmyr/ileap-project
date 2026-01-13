"""
Script to recalculate total_hours for all existing time logs
using the new working hours validation (7AM-12PM, 1PM-5PM)
"""

from database import engine, SessionLocal
from models import DailyTimeLog
from datetime import time as dt_time, datetime

def calculate_valid_hours(time_in: datetime, time_out: datetime) -> float:
    """
    Calculate hours within valid working hours only.
    Valid hours: 7:00 AM - 12:00 PM and 1:00 PM - 5:00 PM
    Excludes lunch break: 12:00 PM - 1:00 PM
    """
    if not time_in or not time_out:
        return 0.0
    
    # Define valid working hours
    morning_start = dt_time(7, 0)   # 7:00 AM
    morning_end = dt_time(12, 0)    # 12:00 PM
    afternoon_start = dt_time(13, 0) # 1:00 PM
    afternoon_end = dt_time(17, 0)   # 5:00 PM
    
    total_seconds = 0
    
    # Get time portions
    time_in_time = time_in.time()
    time_out_time = time_out.time()
    
    # Clamp time_in to valid range
    if time_in_time < morning_start:
        time_in_time = morning_start
    
    # Clamp time_out to valid range
    if time_out_time > afternoon_end:
        time_out_time = afternoon_end
    
    # Calculate morning session (7 AM - 12 PM)
    if time_in_time < morning_end:
        morning_end_actual = min(time_out_time, morning_end)
        if morning_end_actual > time_in_time:
            morning_in = datetime.combine(time_in.date(), time_in_time)
            morning_out = datetime.combine(time_in.date(), morning_end_actual)
            total_seconds += (morning_out - morning_in).total_seconds()
    
    # Calculate afternoon session (1 PM - 5 PM)
    if time_out_time > afternoon_start:
        afternoon_start_actual = max(time_in_time, afternoon_start)
        if time_out_time > afternoon_start_actual:
            afternoon_in = datetime.combine(time_in.date(), afternoon_start_actual)
            afternoon_out = datetime.combine(time_in.date(), time_out_time)
            total_seconds += (afternoon_out - afternoon_in).total_seconds()
    
    return round(total_seconds / 3600, 2)

def recalculate_all_hours():
    db = SessionLocal()
    try:
        # Get all time logs
        time_logs = db.query(DailyTimeLog).all()
        
        print(f"Found {len(time_logs)} time logs to recalculate...")
        
        updated_count = 0
        for log in time_logs:
            if log.time_in and log.time_out:
                old_hours = float(log.total_hours) if log.total_hours else 0
                new_hours = calculate_valid_hours(log.time_in, log.time_out)
                
                if old_hours != new_hours:
                    print(f"Log ID {log.log_id}: {log.time_in.time()} - {log.time_out.time()}")
                    print(f"  Old hours: {old_hours}, New hours: {new_hours}")
                    log.total_hours = new_hours
                    updated_count += 1
        
        db.commit()
        print(f"\n✅ Successfully updated {updated_count} records")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    recalculate_all_hours()
