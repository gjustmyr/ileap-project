"""
Fix invalid time logs by adjusting them to working hours
"""
from database import engine
from sqlalchemy import text
from datetime import datetime, time as dt_time, timedelta
import json

try:
    with engine.connect() as conn:
        print("🔍 Finding invalid time logs...")
        
        # Get all logs with their employer work schedules
        query = text("""
            SELECT 
                dtl.log_id,
                dtl.student_id,
                dtl.log_date,
                dtl.time_in,
                dtl.time_out,
                dtl.total_hours,
                e.work_schedule
            FROM daily_time_logs dtl
            JOIN internship_applications ia ON dtl.application_id = ia.application_id
            JOIN internships i ON ia.internship_id = i.internship_id
            JOIN employers e ON i.employer_id = e.employer_id
            WHERE dtl.time_in IS NOT NULL
            ORDER BY dtl.log_date DESC
        """)
        
        result = conn.execute(query)
        logs = result.fetchall()
        
        fixed_count = 0
        
        for log in logs:
            log_id = log[0]
            log_date = log[2]
            time_in = log[3]
            time_out = log[4]
            work_schedule_json = log[6]
            
            if not work_schedule_json or not time_in:
                continue
            
            try:
                work_schedule = json.loads(work_schedule_json)
                
                # Get day of week from time_in
                day_name = time_in.strftime('%A')
                day_schedule = work_schedule.get(day_name)
                
                if not day_schedule or day_schedule.get('start') is None:
                    continue
                
                # Parse working hours
                start_str = day_schedule['start']
                end_str = day_schedule['end']
                start_parts = start_str.split(':')
                end_parts = end_str.split(':')
                
                work_start = dt_time(int(start_parts[0]), int(start_parts[1]))
                work_end = dt_time(int(end_parts[0]), int(end_parts[1]))
                
                time_in_time = time_in.time()
                
                needs_update = False
                new_time_in = time_in
                new_time_out = time_out
                
                # Fix 1: Time-in before work hours
                if time_in_time < work_start:
                    print(f"  ⚠️ Log {log_id} on {log_date}: Time-in {time_in_time} before work start {work_start}")
                    new_time_in = datetime.combine(time_in.date(), work_start)
                    needs_update = True
                
                # Fix 2: Time-in and time-out are the same
                if time_out and time_in.time() == time_out.time():
                    print(f"  ⚠️ Log {log_id} on {log_date}: Time-in and time-out are identical")
                    # Set time-out to work end time
                    new_time_out = datetime.combine(time_out.date(), work_end)
                    needs_update = True
                
                # Fix 3: Time-out after work hours
                if time_out:
                    time_out_time = time_out.time()
                    if time_out_time > work_end:
                        print(f"  ⚠️ Log {log_id} on {log_date}: Time-out {time_out_time} after work end {work_end}")
                        new_time_out = datetime.combine(time_out.date(), work_end)
                        needs_update = True
                
                # Update if needed
                if needs_update and new_time_in and new_time_out:
                    # Recalculate total hours with breaks
                    duration = new_time_out - new_time_in
                    total_seconds = duration.total_seconds()
                    
                    # Subtract break times
                    breaks = day_schedule.get('breaks', [])
                    total_break_seconds = 0
                    
                    for break_period in breaks:
                        if break_period and break_period.get('start') and break_period.get('end'):
                            break_start_parts = break_period['start'].split(':')
                            break_end_parts = break_period['end'].split(':')
                            
                            break_start = dt_time(int(break_start_parts[0]), int(break_start_parts[1]))
                            break_end = dt_time(int(break_end_parts[0]), int(break_end_parts[1]))
                            
                            # Only count break if student was present during break
                            if new_time_in.time() <= break_start and new_time_out.time() >= break_end:
                                break_start_dt = datetime.combine(new_time_in.date(), break_start)
                                break_end_dt = datetime.combine(new_time_in.date(), break_end)
                                break_duration = break_end_dt - break_start_dt
                                total_break_seconds += break_duration.total_seconds()
                    
                    total_seconds -= total_break_seconds
                    new_total_hours = round(max(0, total_seconds) / 3600, 2)
                    
                    # Update the database
                    update_query = text("""
                        UPDATE daily_time_logs
                        SET time_in = :time_in,
                            time_out = :time_out,
                            total_hours = :total_hours,
                            updated_at = NOW()
                        WHERE log_id = :log_id
                    """)
                    
                    conn.execute(update_query, {
                        'log_id': log_id,
                        'time_in': new_time_in,
                        'time_out': new_time_out,
                        'total_hours': new_total_hours
                    })
                    conn.commit()
                    
                    print(f"  ✅ Fixed log {log_id}: {time_in_time} → {new_time_in.time()}, {time_out.time() if time_out else 'None'} → {new_time_out.time()}, Hours: {new_total_hours}")
                    fixed_count += 1
                    
            except (json.JSONDecodeError, KeyError, ValueError, IndexError) as e:
                print(f"  ⚠️ Error processing log {log_id}: {e}")
                continue
        
        print(f"\n✅ Fixed {fixed_count} invalid log(s)")
        
except Exception as e:
    print(f"❌ Failed to fix logs: {e}")
    import traceback
    traceback.print_exc()
