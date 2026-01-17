from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

# Import configuration (this sets timezone)
from config import CORS_ORIGINS, UPLOAD_BASE_DIR, TIMEZONE

# Set timezone for the application
os.environ['TZ'] = TIMEZONE

# Import database
from database import engine
from models import Base
#sa
# Import routes
from routes import auth, campus, department, program, major, section, ojt_head, ojt_coordinator, employer, industry, class_routes, internship, supervisor, student, requirements, ojt_assignments, ojt_daily_records, oeams, dashboard, dropdown, requirement_templates, superadmin

load_dotenv()
    
# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ILEAP API",
    description="API for ILEAP Internship Management System",
    version="1.0.0"
)

# CORS configuration - now uses config.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(superadmin.router)
app.include_router(campus.router)
app.include_router(department.router)
app.include_router(program.router)
app.include_router(major.router)
app.include_router(section.router)
app.include_router(ojt_head.router)
app.include_router(ojt_coordinator.router)

from routes import company
app.include_router(employer.router)
app.include_router(industry.router)
app.include_router(class_routes.router)
app.include_router(internship.router)
app.include_router(supervisor.router)
app.include_router(student.router)
app.include_router(requirements.router)
app.include_router(requirement_templates.router)
app.include_router(company.router)
app.include_router(ojt_assignments.router)
app.include_router(ojt_daily_records.router)
app.include_router(oeams.router)
app.include_router(dashboard.router)
app.include_router(dropdown.router)

# Mount static files for uploads
# This serves files from the uploads directory at /uploads URL path
app.mount("/uploads", StaticFiles(directory=UPLOAD_BASE_DIR), name="uploads")


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


if __name__ == "__main__":
    import uvicorn
    import os
    from dotenv import load_dotenv
    load_dotenv()
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
