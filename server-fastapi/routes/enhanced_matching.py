"""
Enhanced Student-Internship Matching API Routes

Provides endpoints for:
1. Getting top internship recommendations for students
2. Calculating match scores with detailed explanations
3. Storing and tracking historical matches
4. Updating match feedback based on applications

Author: ILEAP Development Team
Version: 2.0.0
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from database import get_db
from middleware.auth import get_current_user
from models import Student, Internship, Employer, Industry, StudentInternshipMatch, InternshipApplication
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import sys
import os

# Import enhanced matcher
sys.path.append(os.path.join(os.path.dirname(__file__), '../ml_models'))
from ml_models.enhanced_matcher import get_matcher


router = APIRouter(prefix="/api/students", tags=["Enhanced Matching"])


# Pydantic models
class MatchScoreResponse(BaseModel):
    """Response model for match score calculation"""
    student_id: int
    internship_id: int
    match_score: float = Field(..., ge=0.0, le=1.0)
    match_label: str
    is_recommended: bool
    internship_title: str
    company_name: str
    components: Dict[str, float]
    skill_metrics: Dict


class TopMatchesResponse(BaseModel):
    """Response model for top matches"""
    student_id: int
    total_matches: int
    matches: List[Dict]


class MatchFeedbackRequest(BaseModel):
    """Request model for updating match feedback"""
    student_id: int
    internship_id: int
    applied: Optional[bool] = None
    accepted: Optional[bool] = None


@router.get("/{student_id}/top-internships", response_model=TopMatchesResponse)
def get_top_internships(
    student_id: int,
    limit: int = Query(10, ge=1, le=50, description="Number of recommendations to return"),
    posting_type: Optional[str] = Query(None, description="Filter by 'internship' or 'job_placement'"),
    min_score: float = Query(0.30, ge=0.0, le=1.0, description="Minimum match score threshold"),
    refresh: bool = Query(False, description="Force recalculation of matches"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get top N recommended internships for a student
    
    This endpoint:
    1. Calculates match scores for all active internships
    2. Stores matches in database for historical tracking
    3. Returns top N matches sorted by score
    
    Query Parameters:
    - limit: Number of recommendations (1-50, default 10)
    - posting_type: Filter by 'internship' or 'job_placement'
    - min_score: Minimum match score (0.0-1.0, default 0.30)
    - refresh: Force recalculation instead of using cached matches
    """
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Authorization check: students can only view their own recommendations
    if current_user.get('role') == 'student' and current_user.get('user_id') != student.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this student's recommendations")
    
    try:
        # Get matcher instance
        matcher = get_matcher()
        
        # Calculate top matches
        matches = matcher.get_top_matches(
            db=db,
            student_id=student_id,
            limit=limit,
            posting_type=posting_type,
            min_score=min_score,
            store_matches=True
        )
        
        return {
            'student_id': student_id,
            'total_matches': len(matches),
            'matches': matches
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate matches: {str(e)}"
        )


@router.get("/{student_id}/match-score/{internship_id}", response_model=MatchScoreResponse)
def get_match_score(
    student_id: int,
    internship_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Calculate detailed match score for a specific student-internship pair
    
    Returns comprehensive match information including:
    - Overall match score
    - Component scores (skills, program, semantic, historical)
    - Skill metrics (jaccard, coverage, match count)
    - Match label and recommendation status
    """
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Verify internship exists
    internship = db.query(Internship).filter(Internship.internship_id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Authorization check
    if current_user.get('role') == 'student' and current_user.get('user_id') != student.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        # Get matcher instance
        matcher = get_matcher()
        
        # Prepare data
        student_data = {
            'student_id': student.student_id,
            'skills': [skill.skill_name for skill in student.skills] if student.skills else [],
            'program': student.program or "",
            'major': student.major or "",
            'department': student.department or "",
            'about': student.about or ""
        }
        
        internship_data = {
            'internship_id': internship.internship_id,
            'employer_id': internship.employer_id,
            'industry_id': internship.employer.industry_id if internship.employer else None,
            'skills': [skill.skill_name for skill in internship.skills] if internship.skills else [],
            'title': internship.title or "",
            'description': internship.full_description or "",
            'posting_type': internship.posting_type or "internship",
            'industry': internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else "",
            'company_name': internship.employer.company_name if internship.employer else ""
        }
        
        # Calculate match
        result = matcher.calculate_match_score(db, student_data, internship_data)
        
        # Store match in database
        matcher._store_matches(db, student_id, [{
            'internship_id': internship_id,
            'match_score': result['match_score'],
            'match_label': result['match_label'],
            'is_recommended': result['is_recommended'],
            'components': result['components'],
            'skill_metrics': result['skill_metrics']
        }])
        
        return {
            'student_id': student_id,
            'internship_id': internship_id,
            'match_score': result['match_score'],
            'match_label': result['match_label'],
            'is_recommended': result['is_recommended'],
            'internship_title': internship.title,
            'company_name': internship_data['company_name'],
            'components': result['components'],
            'skill_metrics': result['skill_metrics']
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate match score: {str(e)}"
        )


@router.get("/{student_id}/match-history")
def get_match_history(
    student_id: int,
    limit: int = Query(50, ge=1, le=200),
    include_not_applied: bool = Query(True, description="Include matches student didn't apply to"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get historical match records for a student
    
    Useful for:
    - Analyzing recommendation accuracy
    - Understanding student preferences
    - Improving future recommendations
    """
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Authorization check
    if current_user.get('role') == 'student' and current_user.get('user_id') != student.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Build query
    query = db.query(StudentInternshipMatch).filter(
        StudentInternshipMatch.student_id == student_id
    )
    
    if not include_not_applied:
        query = query.filter(StudentInternshipMatch.applied == True)
    
    matches = query.order_by(desc(StudentInternshipMatch.recommended_at)).limit(limit).all()
    
    # Enrich with internship details
    results = []
    for match in matches:
        internship = db.query(Internship).filter(
            Internship.internship_id == match.internship_id
        ).first()
        
        if internship:
            results.append({
                'match_id': match.match_id,
                'internship_id': match.internship_id,
                'internship_title': internship.title,
                'company_name': internship.employer.company_name if internship.employer else "",
                'match_score': float(match.match_score),
                'match_label': match.match_label,
                'is_recommended': match.is_recommended,
                'recommended_at': match.recommended_at.isoformat() if match.recommended_at else None,
                'applied': match.applied,
                'applied_at': match.applied_at.isoformat() if match.applied_at else None,
                'accepted': match.accepted,
                'accepted_at': match.accepted_at.isoformat() if match.accepted_at else None
            })
    
    return {
        'student_id': student_id,
        'total_records': len(results),
        'matches': results
    }


@router.post("/match-feedback")
def update_match_feedback(
    feedback: MatchFeedbackRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Update match record with application feedback
    
    Call this endpoint when:
    - Student applies to an internship (set applied=true)
    - Application is accepted (set accepted=true)
    - Application is rejected (set accepted=false)
    
    This helps the system learn from outcomes and improve future recommendations
    """
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == feedback.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Authorization check
    if current_user.get('role') not in ['superadmin', 'ojt_head', 'ojt_coordinator']:
        if current_user.get('role') == 'student' and current_user.get('user_id') != student.user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        matcher = get_matcher()
        matcher.update_match_feedback(
            db=db,
            student_id=feedback.student_id,
            internship_id=feedback.internship_id,
            applied=feedback.applied,
            accepted=feedback.accepted
        )
        
        return {
            'message': 'Match feedback updated successfully',
            'student_id': feedback.student_id,
            'internship_id': feedback.internship_id
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update feedback: {str(e)}"
        )


@router.get("/matching/analytics")
def get_matching_analytics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get analytics about the matching system performance
    
    Only accessible to superadmin, OJT head, and coordinators
    
    Returns:
    - Total matches calculated
    - Application conversion rate
    - Acceptance rate for recommended vs not recommended
    - Average match scores
    """
    # Authorization check
    if current_user.get('role') not in ['superadmin', 'ojt_head', 'ojt_coordinator']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        # Total matches
        total_matches = db.query(StudentInternshipMatch).count()
        
        # Matches that led to applications
        applied_matches = db.query(StudentInternshipMatch).filter(
            StudentInternshipMatch.applied == True
        ).count()
        
        # Accepted applications
        accepted_matches = db.query(StudentInternshipMatch).filter(
            StudentInternshipMatch.accepted == True
        ).count()
        
        # Recommended matches
        recommended_matches = db.query(StudentInternshipMatch).filter(
            StudentInternshipMatch.is_recommended == True
        ).count()
        
        # Application rate for recommended vs not recommended
        recommended_applied = db.query(StudentInternshipMatch).filter(
            and_(
                StudentInternshipMatch.is_recommended == True,
                StudentInternshipMatch.applied == True
            )
        ).count()
        
        not_recommended_applied = db.query(StudentInternshipMatch).filter(
            and_(
                StudentInternshipMatch.is_recommended == False,
                StudentInternshipMatch.applied == True
            )
        ).count()
        
        # Calculate rates
        application_rate = (applied_matches / total_matches * 100) if total_matches > 0 else 0
        acceptance_rate = (accepted_matches / applied_matches * 100) if applied_matches > 0 else 0
        recommended_application_rate = (recommended_applied / recommended_matches * 100) if recommended_matches > 0 else 0
        
        # Average match scores
        from sqlalchemy import func
        avg_score_all = db.query(func.avg(StudentInternshipMatch.match_score)).scalar() or 0
        avg_score_applied = db.query(func.avg(StudentInternshipMatch.match_score)).filter(
            StudentInternshipMatch.applied == True
        ).scalar() or 0
        avg_score_accepted = db.query(func.avg(StudentInternshipMatch.match_score)).filter(
            StudentInternshipMatch.accepted == True
        ).scalar() or 0
        
        return {
            'total_matches_calculated': total_matches,
            'total_applications': applied_matches,
            'total_acceptances': accepted_matches,
            'recommended_matches': recommended_matches,
            'application_rate': round(application_rate, 2),
            'acceptance_rate': round(acceptance_rate, 2),
            'recommended_application_rate': round(recommended_application_rate, 2),
            'average_scores': {
                'all_matches': round(float(avg_score_all), 4),
                'applied_matches': round(float(avg_score_applied), 4),
                'accepted_matches': round(float(avg_score_accepted), 4)
            },
            'insights': {
                'recommendation_effectiveness': 'High' if recommended_application_rate > 50 else 'Medium' if recommended_application_rate > 30 else 'Low',
                'match_quality': 'High' if avg_score_accepted > 0.65 else 'Medium' if avg_score_accepted > 0.50 else 'Low'
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analytics: {str(e)}"
        )


@router.get("/{student_id}/recommendations/explain/{internship_id}")
def explain_recommendation(
    student_id: int,
    internship_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get detailed explanation of why an internship was recommended
    
    Returns:
    - Match score breakdown by component
    - Matching skills
    - Program/major relevance
    - Semantic similarity insights
    """
    # Verify student and internship exist
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    internship = db.query(Internship).filter(Internship.internship_id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Authorization check
    if current_user.get('role') == 'student' and current_user.get('user_id') != student.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        # Get matcher
        matcher = get_matcher()
        
        # Prepare data
        student_skills = [skill.skill_name for skill in student.skills] if student.skills else []
        internship_skills = [skill.skill_name for skill in internship.skills] if internship.skills else []
        
        student_data = {
            'student_id': student.student_id,
            'skills': student_skills,
            'program': student.program or "",
            'major': student.major or "",
            'department': student.department or "",
            'about': student.about or ""
        }
        
        internship_data = {
            'internship_id': internship.internship_id,
            'employer_id': internship.employer_id,
            'industry_id': internship.employer.industry_id if internship.employer else None,
            'skills': internship_skills,
            'title': internship.title or "",
            'description': internship.full_description or "",
            'posting_type': internship.posting_type or "internship",
            'industry': internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else "",
            'company_name': internship.employer.company_name if internship.employer else ""
        }
        
        # Calculate match
        result = matcher.calculate_match_score(db, student_data, internship_data)
        
        # Find matching skills
        student_skills_set = {s.lower() for s in student_skills}
        internship_skills_set = {s.lower() for s in internship_skills}
        matching_skills = list(student_skills_set.intersection(internship_skills_set))
        missing_skills = list(internship_skills_set - student_skills_set)
        
        # Build explanation
        explanation = {
            'overall_score': result['match_score'],
            'match_label': result['match_label'],
            'is_recommended': result['is_recommended'],
            'score_breakdown': {
                'skills': {
                    'score': result['components']['skill_score'],
                    'weight': matcher.skill_weight,
                    'contribution': result['components']['skill_score'] * matcher.skill_weight,
                    'details': {
                        'matching_skills': matching_skills,
                        'missing_skills': missing_skills,
                        'match_count': f"{len(matching_skills)}/{len(internship_skills_set)}",
                        'coverage': f"{result['skill_metrics']['coverage']:.0%}"
                    }
                },
                'program': {
                    'score': result['components']['program_score'],
                    'weight': matcher.program_weight,
                    'contribution': result['components']['program_score'] * matcher.program_weight,
                    'details': {
                        'program_relevance': result['program_metrics']['program_match'],
                        'major_relevance': result['program_metrics']['major_match']
                    }
                },
                'semantic': {
                    'score': result['components']['semantic_score'],
                    'weight': matcher.semantic_weight,
                    'contribution': result['components']['semantic_score'] * matcher.semantic_weight
                },
                'historical': {
                    'score': result['components']['historical_score'],
                    'weight': matcher.historical_weight,
                    'contribution': result['components']['historical_score'] * matcher.historical_weight
                }
            },
            'recommendation_reason': _generate_recommendation_reason(result, matching_skills, missing_skills)
        }
        
        return explanation
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to explain recommendation: {str(e)}"
        )


def _generate_recommendation_reason(result: Dict, matching_skills: List[str], missing_skills: List[str]) -> str:
    """Generate human-readable recommendation reason"""
    reasons = []
    
    if result['components']['skill_score'] >= 0.7:
        reasons.append(f"Strong skill match ({len(matching_skills)} matching skills)")
    elif result['components']['skill_score'] >= 0.5:
        reasons.append(f"Good skill match ({len(matching_skills)} matching skills)")
    
    if result['components']['program_score'] >= 0.7:
        reasons.append("Excellent program/major alignment")
    elif result['components']['program_score'] >= 0.4:
        reasons.append("Good program/major alignment")
    
    if result['components']['semantic_score'] >= 0.6:
        reasons.append("High content relevance")
    
    if result['components']['historical_score'] >= 0.7:
        reasons.append("Strong historical success pattern")
    
    if not reasons:
        if missing_skills:
            return f"Limited match. Consider developing skills: {', '.join(missing_skills[:3])}"
        return "Limited match based on current profile"
    
    return "; ".join(reasons)


@router.post("/sync-application-feedback")
def sync_application_feedback(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Sync application feedback from internship_applications to match records
    
    This endpoint should be called periodically (e.g., daily cron job) to:
    1. Update 'applied' flag for matches where student submitted application
    2. Update 'accepted' flag for matches where application was accepted
    
    Only accessible to superadmin and OJT head
    """
    # Authorization check
    if current_user.get('role') not in ['superadmin', 'ojt_head']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    try:
        # Get all applications
        applications = db.query(InternshipApplication).all()
        
        updated_count = 0
        for app in applications:
            # Find corresponding match record
            match = db.query(StudentInternshipMatch).filter(
                and_(
                    StudentInternshipMatch.student_id == app.student_id,
                    StudentInternshipMatch.internship_id == app.internship_id
                )
            ).first()
            
            if match:
                # Update applied flag
                if not match.applied:
                    match.applied = True
                    match.applied_at = app.applied_at or app.created_at
                    updated_count += 1
                
                # Update accepted flag
                if app.status == 'accepted' and not match.accepted:
                    match.accepted = True
                    match.accepted_at = app.reviewed_at or datetime.utcnow()
                    updated_count += 1
                elif app.status == 'rejected' and match.accepted:
                    match.accepted = False
                    updated_count += 1
                
                match.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            'message': 'Application feedback synced successfully',
            'total_applications': len(applications),
            'matches_updated': updated_count
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync feedback: {str(e)}"
        )
