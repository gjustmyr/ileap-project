"""
Initialize database with ORM models
"""
from database import engine
from models import Base

def init_database():
    """Drop all tables and recreate them based on ORM models"""
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables from ORM models...")
    Base.metadata.create_all(bind=engine)
    
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()
