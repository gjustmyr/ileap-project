import psycopg2
from psycopg2 import sql
import os

# Database connection parameters
DB_CONFIG = {
    'host': 'localhost',
    'database': 'ileap_db',
    'user': 'postgres',
    'password': 'admin',
    'port': 5432
}

# Read the SQL file
sql_file_path = os.path.join(os.path.dirname(__file__), 'database', 'create_requirement_submissions_table.sql')

with open(sql_file_path, 'r') as f:
    sql_script = f.read()

# Connect to database
try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    # Execute the SQL script
    cur.execute(sql_script)
    conn.commit()
    
    print("✓ requirement_submissions table created successfully!")
    
    # Verify table exists
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'requirement_submissions'
    """)
    
    if cur.fetchone():
        print("✓ Table verified in database")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Error: {e}")
