"""
FastAPI Route for ML-based Job Matching Predictions

Provides endpoints to get personalized match scores for students.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import get_current_user
from models import Student, Internship, Employer, Industry
from pydantic import BaseModel
from typing import Optional, List
import sys
import os

# Import predictor
sys.path.append(os.path.join(os.path.dirname(__file__), '../ml_models'))
try:
    from ml_models.predictor import get_predictor
    ML_MODEL_AVAILABLE = True
except:
    ML_MODEL_AVAILABLE = False
    print("⚠ ML model predictor not available")


router = APIRouter(prefix="/api/match", tags=["ML Job Matching"])


# Pydantic models for request/response
class MatchPredictionRequest(BaseModel):
    student_id: int
    internship_id: int


class MatchPredictionResponse(BaseModel):
    student_id: int
    internship_id: int
    match_score: float
    match_label: str
    is_recommended: bool
    internship_title: str


class BatchMatchRequest(BaseModel):
    student_id: int
    internship_ids: Optional[List[int]] = None  # If None, match against all open postings


@router.post("/predict", response_model=MatchPredictionResponse)
def predict_match(
    request: MatchPredictionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Predict match score between a student and an internship/job posting
    
    Uses trained ML model to calculate personalized match score.
    """
    if not ML_MODEL_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model not available. Train the model first."
        )
    
    # Get predictor
    predictor = get_predictor()
    if predictor is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model could not be loaded"
        )
    
    # Get student
    student = db.query(Student).filter(Student.student_id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get internship
    internship = db.query(Internship).filter(Internship.internship_id == request.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Prepare student data
    student_data = {
        'skills': [skill.skill_name for skill in student.skills] if student.skills else [],
        'program': student.program or "",
        'major': student.major or "",
        'department': student.department or "",
        'about': student.about or ""
    }
    
    # Prepare internship data
    internship_data = {
        'skills': [skill.skill_name for skill in internship.skills] if internship.skills else [],
        'title': internship.title or "",
        'description': internship.full_description or "",
        'posting_type': internship.posting_type or "internship",
        'industry': internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else ""
    }
    
    # Make prediction
    try:
        result = predictor.predict(student_data, internship_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
    
    return {
        'student_id': request.student_id,
        'internship_id': request.internship_id,
        'match_score': result['match_score'],
        'match_label': result['match_label'],
        'is_recommended': result['is_recommended'],
        'internship_title': internship.title
    }


@router.post("/predict-batch")
def predict_batch_matches(
    request: BatchMatchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Predict match scores for a student against multiple internships
    
    If internship_ids not provided, matches against all open postings.
    Returns sorted list of matches (best matches first).
    """
    if not ML_MODEL_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model not available. Train the model first."
        )
    
    # Get predictor
    predictor = get_predictor()
    if predictor is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model could not be loaded"
        )
    
    # Get student
    student = db.query(Student).filter(Student.student_id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Prepare student data
    student_data = {
        'skills': [skill.skill_name for skill in student.skills] if student.skills else [],
        'program': student.program or "",
        'major': student.major or "",
        'department': student.department or "",
        'about': student.about or ""
    }
    
    # Get internships
    if request.internship_ids:
        internships = db.query(Internship).filter(
            Internship.internship_id.in_(request.internship_ids)
        ).all()
    else:
        # Get all open postings
        internships = db.query(Internship).filter(Internship.status == "open").all()
    
    if not internships:
        return {
            'student_id': request.student_id,
            'total_matches': 0,
            'matches': []
        }
    
    # Prepare internship data list
    internship_data_list = []
    for internship in internships:
        internship_data_list.append({
            'internship_id': internship.internship_id,
            'skills': [skill.skill_name for skill in internship.skills] if internship.skills else [],
            'title': internship.title or "",
            'description': internship.full_description or "",
            'posting_type': internship.posting_type or "internship",
            'industry': internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else "",
            'company_name': internship.employer.company_name if internship.employer else ""
        })
    
    # Make batch prediction
    try:
        results = predictor.predict_batch(student_data, internship_data_list)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
    
    # Enrich results with internship details
    enriched_results = []
    for result in results:
        internship = next(
            (i for i in internships if i.internship_id == result['internship_id']),
            None
        )
        if internship:
            enriched_results.append({
                'internship_id': result['internship_id'],
                'internship_title': internship.title,
                'company_name': internship.employer.company_name if internship.employer else "",
                'match_score': result['match_score'],
                'match_label': result['match_label'],
                'is_recommended': result['is_recommended'],
                'posting_type': internship.posting_type
            })
    
    return {
        'student_id': request.student_id,
        'total_matches': len(enriched_results),
        'matches': enriched_results
    }


@router.get("/student/{student_id}/recommendations")
def get_student_recommendations(
    student_id: int,
    limit: int = 10,
    posting_type: Optional[str] = None,  # 'internship' or 'job_placement'
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get top recommended internships/jobs for a student
    
    Returns the top N matches sorted by match score.
    """
    if not ML_MODEL_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model not available. Using fallback recommendations."
        )
    
    # Use batch prediction
    request = BatchMatchRequest(student_id=student_id)
    result = predict_batch_matches(request, db, current_user)
    
    # Filter by posting type if specified
    matches = result['matches']
    if posting_type:
        matches = [m for m in matches if m['posting_type'] == posting_type]
    
    # Return top N
    return {
        'student_id': student_id,
        'recommendations': matches[:limit]
    }


@router.get("/health")
def ml_model_health():
    """Check if ML model is loaded and ready"""
    if not ML_MODEL_AVAILABLE:
        return {
            'status': 'unavailable',
            'message': 'ML model module not found'
        }
    
    predictor = get_predictor()
    if predictor is None:
        return {
            'status': 'not_loaded',
            'message': 'ML model not loaded. Train the model first.'
        }
    
    return {
        'status': 'healthy',
        'message': 'ML model loaded and ready',
        'model_info': predictor.metadata if predictor.metadata else None
    }
