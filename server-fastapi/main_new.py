from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import database
from database import engine
from models import Base

# Import routes
from routes import auth, campus, department

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ILEAP API",
    description="API for ILEAP Internship Management System",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:4200",  # Superadmin
    "http://localhost:4201",  # Employer
    "http://localhost:4202",  # OJT Coordinator
    "http://localhost:4203",  # OJT Head
    "http://localhost:4204",  # Student Trainee
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(campus.router)
app.include_router(department.router)


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "ILEAP FastAPI Server",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
