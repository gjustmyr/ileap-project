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
