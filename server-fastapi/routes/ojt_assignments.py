from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Optional
from database import get_db
from middleware.auth import get_current_user
from models import (
    StudentSupervisorAssignment, 
    Student, 
    TraineeSupervisor, 
    InternshipApplication,
    Employer
)
from pydantic import BaseModel


router = APIRouter(prefix="/api/ojt/supervisor-assignments", tags=["OJT Supervisor Assignments"])


class AssignSupervisorRequest(BaseModel):
    student_id: int
    supervisor_id: int
    internship_application_id: int


class AssignmentResponse(BaseModel):
    assignment_id: int
    student_id: int
    student_name: str
    supervisor_id: int
    supervisor_name: str
    internship_application_id: int
    status: str
    assigned_at: datetime

    class Config:
        from_attributes = True


@router.post("/assign", status_code=201)
def assign_supervisor_to_student(
    payload: AssignSupervisorRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Assign a supervisor to a student for their OJT (Employer only)"""
    
    # Verify employer
    employer = db.query(Employer).filter(Employer.user_id == current_user["user_id"]).first()
    if not employer:
        raise HTTPException(status_code=403, detail="Only employers can assign supervisors")
    
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Verify supervisor exists and belongs to this employer
    supervisor = db.query(TraineeSupervisor).filter(
        TraineeSupervisor.supervisor_id == payload.supervisor_id,
        TraineeSupervisor.employer_id == employer.employer_id
    ).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found or doesn't belong to your company")
    
    # Verify application exists and belongs to this employer
    application = db.query(InternshipApplication).join(
        InternshipApplication.internship
    ).filter(
        InternshipApplication.application_id == payload.internship_application_id,
        InternshipApplication.student_id == payload.student_id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Internship application not found")
    
    # Check if assignment already exists
    existing = db.query(StudentSupervisorAssignment).filter(
        StudentSupervisorAssignment.student_id == payload.student_id,
        StudentSupervisorAssignment.internship_application_id == payload.internship_application_id,
        StudentSupervisorAssignment.status == 'active'
    ).first()
    
    if existing:
        # Update existing assignment
        existing.supervisor_id = payload.supervisor_id
        existing.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        assignment = existing
    else:
        # Create new assignment
        assignment = StudentSupervisorAssignment(
            student_id=payload.student_id,
            supervisor_id=payload.supervisor_id,
            internship_application_id=payload.internship_application_id,
            status='active'
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
    
    return {
        "status": "success",
        "message": "Supervisor assigned successfully",
        "data": {
            "assignment_id": assignment.assignment_id,
            "student_name": f"{student.first_name} {student.last_name}",
            "supervisor_name": f"{supervisor.first_name} {supervisor.last_name}",
            "assigned_at": assignment.assigned_at
        }
    }


@router.get("/student/{student_id}")
def get_student_supervisor(
    student_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the assigned supervisor for a student"""
    
    assignment = db.query(StudentSupervisorAssignment).filter(
        StudentSupervisorAssignment.student_id == student_id,
        StudentSupervisorAssignment.status == 'active'
    ).first()
    
    if not assignment:
        return {
            "status": "success",
            "data": None,
            "message": "No supervisor assigned yet"
        }
    
    supervisor = assignment.supervisor
    student = assignment.student
    
    return {
        "status": "success",
        "data": {
            "assignment_id": assignment.assignment_id,
            "supervisor": {
                "supervisor_id": supervisor.supervisor_id,
                "name": f"{supervisor.first_name} {supervisor.last_name}",
                "email": supervisor.email,
                "phone_number": supervisor.phone_number,
                "position": supervisor.position,
                "department": supervisor.department
            },
            "student": {
                "student_id": student.student_id,
                "name": f"{student.first_name} {student.last_name}"
            },
            "assigned_at": assignment.assigned_at
        }
    }


@router.get("/employer/assignments")
def get_employer_supervisor_assignments(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all supervisor assignments for an employer's students"""
    
    employer = db.query(Employer).filter(Employer.user_id == current_user["user_id"]).first()
    if not employer:
        raise HTTPException(status_code=403, detail="Only employers can view assignments")
    
    # Get all assignments for students in this employer's internships
    assignments = db.query(StudentSupervisorAssignment).join(
        TraineeSupervisor,
        StudentSupervisorAssignment.supervisor_id == TraineeSupervisor.supervisor_id
    ).filter(
        TraineeSupervisor.employer_id == employer.employer_id,
        StudentSupervisorAssignment.status == 'active'
    ).all()
    
    result = []
    for assignment in assignments:
        student = assignment.student
        supervisor = assignment.supervisor
        result.append({
            "assignment_id": assignment.assignment_id,
            "student": {
                "student_id": student.student_id,
                "name": f"{student.first_name} {student.last_name}",
                "email": student.email
            },
            "supervisor": {
                "supervisor_id": supervisor.supervisor_id,
                "name": f"{supervisor.first_name} {supervisor.last_name}",
                "position": supervisor.position,
                "department": supervisor.department
            },
            "assigned_at": assignment.assigned_at
        })
    
    return {
        "status": "success",
        "data": result
    }
