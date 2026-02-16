"""
DateTime utility functions for Philippine timezone
"""
from datetime import datetime
import pytz

# Philippine timezone
PHILIPPINE_TZ = pytz.timezone('Asia/Manila')

def now():
    """
    Get current datetime in Philippine timezone
    Returns timezone-aware datetime object
    """
    return datetime.now(PHILIPPINE_TZ)

def utcnow():
    """
    Get current datetime in Philippine timezone
    (Replaces datetime.utcnow() to ensure Philippine time is used)
    Returns timezone-aware datetime object
    """
    return datetime.now(PHILIPPINE_TZ)

def to_philippine_time(dt):
    """
    Convert a datetime to Philippine timezone
    """
    if dt.tzinfo is None:
        # Assume UTC if no timezone info
        dt = pytz.utc.localize(dt)
    return dt.astimezone(PHILIPPINE_TZ)

def format_datetime_for_api(dt):
    """
    Format datetime for API response
    Ensures timezone-aware datetime is properly formatted
    Returns ISO format string with timezone offset
    """
    if dt is None:
        return None
    
    # If datetime is naive, assume it's in Philippine timezone
    if dt.tzinfo is None:
        dt = PHILIPPINE_TZ.localize(dt)
    else:
        # Convert to Philippine timezone if it's in a different timezone
        dt = dt.astimezone(PHILIPPINE_TZ)
    
    return dt.isoformat()
