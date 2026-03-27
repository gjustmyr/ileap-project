from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import verify_token
from models import Campus, Department, Program
import pandas as pd
from io import BytesIO
from typing import Dict, List

router = APIRouter(prefix="/api/bulk-upload", tags=["Bulk Upload"])


def verify_superadmin(token_data: dict = Depends(verify_token)):
    """Verify that the user is a superadmin"""
    if token_data.get("role") != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmin can access this resource"
        )
    return token_data


@router.post("/programs-from-excel")
async def upload_programs_from_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """
    Bulk upload programs from Excel file
    Expected columns: CAMPUS, COLLEGE, PROGRAM
    """
    try:
        # Validate file type
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only Excel files (.xlsx, .xls) are supported"
            )
        
        # Read Excel file
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))
        
        # Validate required columns
        required_columns = ['CAMPUS', 'COLLEGE', 'PROGRAM']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )
        
        # Clean data: remove rows with NaN in critical columns
        df = df.dropna(subset=['CAMPUS', 'COLLEGE', 'PROGRAM'])
        
        # Track results
        results = {
            "campuses_created": 0,
            "departments_created": 0,
            "programs_created": 0,
            "programs_skipped": 0,
            "errors": []
        }
        
        # Cache for created/existing records
        campus_cache: Dict[str, int] = {}
        department_cache: Dict[tuple, int] = {}
        
        # Process each row
        for index, row in df.iterrows():
            try:
                campus_name = str(row['CAMPUS']).strip()
                college_name = str(row['COLLEGE']).strip()
                program_name = str(row['PROGRAM']).strip()
                
                # Skip empty values
                if not campus_name or not college_name or not program_name:
                    continue
                
                # 1. Get or create Campus
                if campus_name not in campus_cache:
                    campus = db.query(Campus).filter(Campus.campus_name == campus_name).first()
                    if not campus:
                        campus = Campus(
                            campus_name=campus_name,
                            campus_address="",  # Can be updated later
                            is_main=False,
                            is_active=True
                        )
                        db.add(campus)
                        db.flush()
                        results["campuses_created"] += 1
                    campus_cache[campus_name] = campus.campus_id
                
                campus_id = campus_cache[campus_name]
                
                # 2. Get or create Department
                dept_key = (campus_id, college_name)
                if dept_key not in department_cache:
                    department = db.query(Department).filter(
                        Department.campus_id == campus_id,
                        Department.department_name == college_name
                    ).first()
                    if not department:
                        department = Department(
                            department_name=college_name,
                            campus_id=campus_id,
                            is_active=True
                        )
                        db.add(department)
                        db.flush()
                        results["departments_created"] += 1
                    department_cache[dept_key] = department.department_id
                
                department_id = department_cache[dept_key]
                
                # 3. Get or create Program
                existing_program = db.query(Program).filter(
                    Program.department_id == department_id,
                    Program.program_name == program_name
                ).first()
                
                if not existing_program:
                    program = Program(
                        program_name=program_name,
                        program_code="",  # Can be updated later
                        department_id=department_id,
                        is_active=True
                    )
                    db.add(program)
                    results["programs_created"] += 1
                else:
                    results["programs_skipped"] += 1
                
            except Exception as e:
                results["errors"].append(f"Row {index + 2}: {str(e)}")
                continue
        
        # Commit all changes
        db.commit()
        
        return {
            "success": True,
            "message": "Bulk upload completed",
            "results": results,
            "total_rows_processed": len(df)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}"
        )


@router.post("/students-from-excel")
async def upload_students_from_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """
    Bulk upload students from Excel file
    Expected columns: student_id, first_name, last_name, email, program, section
    (Implementation placeholder - customize based on your needs)
    """
    # TODO: Implement student bulk upload
    return {
        "success": False,
        "message": "Student bulk upload not yet implemented"
    }


@router.get("/template-info")
async def get_template_info(
    token_data: dict = Depends(verify_superadmin)
):
    """Get information about expected Excel template formats"""
    return {
        "success": True,
        "templates": {
            "programs": {
                "endpoint": "/api/bulk-upload/programs-from-excel",
                "required_columns": ["CAMPUS", "COLLEGE", "PROGRAM"],
                "optional_columns": ["Unnamed: 3"],
                "description": "Upload campuses, departments/colleges, and programs in bulk",
                "notes": [
                    "Empty rows will be skipped",
                    "Duplicate programs will be skipped",
                    "Campuses and departments will be auto-created if they don't exist"
                ]
            },
            "students": {
                "endpoint": "/api/bulk-upload/students-from-excel",
                "status": "Not yet implemented"
            }
        }
    }
