"""
Enhanced Student-Internship Matching System

This module provides an improved matching algorithm that:
1. Calculates match scores based on skills, program/major, and semantic similarity
2. Stores historical matches in the database for learning
3. Supports both rule-based and ML-based matching
4. Provides explainable recommendations

Author: ILEAP Development Team
Version: 2.0.0
"""

import json
import re
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class EnhancedInternshipMatcher:
    """
    Enhanced matching system with configurable weights and historical tracking
    """
    
    def __init__(
        self,
        skill_weight: float = 0.40,
        program_weight: float = 0.25,
        semantic_weight: float = 0.25,
        historical_weight: float = 0.10,
        use_simple_cosine: bool = True
    ):
        """
        Initialize matcher with configurable weights
        
        Args:
            skill_weight: Weight for skill matching (default 40%)
            program_weight: Weight for program/major matching (default 25%)
            semantic_weight: Weight for semantic text similarity (default 25%)
            historical_weight: Weight for historical success patterns (default 10%)
            use_simple_cosine: If True, use only cosine similarity on merged text (default True)
        """
        self.skill_weight = skill_weight
        self.program_weight = program_weight
        self.semantic_weight = semantic_weight
        self.historical_weight = historical_weight
        self.use_simple_cosine = use_simple_cosine
        
        # Validate weights sum to 1.0
        total = skill_weight + program_weight + semantic_weight + historical_weight
        if not (0.99 <= total <= 1.01):
            raise ValueError(f"Weights must sum to 1.0, got {total}")
    
    
    @staticmethod
    def clean_html(text: str) -> str:
        """
        Remove HTML tags and clean text for matching
        
        Args:
            text: Text that may contain HTML tags
            
        Returns:
            Clean text without HTML tags
        """
        if not text:
            return ""
        
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        
        # Remove HTML entities
        text = re.sub(r'&[a-zA-Z]+;', ' ', text)
        text = re.sub(r'&#\d+;', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    
    def calculate_skill_score(
        self,
        student_skills: List[str],
        internship_skills: List[str]
    ) -> Dict[str, float]:
        """
        Calculate skill matching score using multiple metrics
        
        Returns:
            dict with jaccard, coverage, and match_count scores
        """
        # Normalize skills to lowercase
        student_skills_set = {s.lower().strip() for s in student_skills if s}
        internship_skills_set = {s.lower().strip() for s in internship_skills if s}
        
        # Calculate metrics
        if not student_skills_set or not internship_skills_set:
            return {
                'jaccard': 0.0,
                'coverage': 0.0,
                'match_count': 0,
                'total_required': len(internship_skills_set)
            }
        
        intersection = student_skills_set.intersection(internship_skills_set)
        union = student_skills_set.union(internship_skills_set)
        
        jaccard = len(intersection) / len(union) if union else 0.0
        coverage = len(intersection) / len(internship_skills_set) if internship_skills_set else 0.0
        
        return {
            'jaccard': jaccard,
            'coverage': coverage,
            'match_count': len(intersection),
            'total_required': len(internship_skills_set)
        }
    
    
    def calculate_program_score(
        self,
        student_program: str,
        student_major: str,
        student_department: str,
        internship_title: str,
        internship_description: str,
        industry_name: str
    ) -> Dict[str, float]:
        """
        Calculate program/major compatibility score
        
        Returns:
            dict with program_match and major_match scores
        """
        # Normalize to lowercase
        student_program = (student_program or "").lower()
        student_major = (student_major or "").lower()
        student_department = (student_department or "").lower()
        internship_title = (internship_title or "").lower()
        internship_description = (internship_description or "").lower()[:500]
        industry_name = (industry_name or "").lower()
        
        # Check for program mentions
        program_score = 0.0
        if student_program:
            if student_program in internship_title:
                program_score += 1.0
            if student_program in internship_description:
                program_score += 0.5
            if student_program in industry_name:
                program_score += 0.3
        
        # Check for major mentions
        major_score = 0.0
        if student_major:
            if student_major in internship_title:
                major_score += 1.0
            if student_major in internship_description:
                major_score += 0.5
        
        # Normalize scores (max possible: program=1.8, major=1.5)
        program_score = min(program_score / 1.8, 1.0)
        major_score = min(major_score / 1.5, 1.0)
        
        return {
            'program_match': program_score,
            'major_match': major_score
        }
    
    
    def calculate_semantic_score(
        self,
        student_text: str,
        internship_text: str
    ) -> float:
        """
        Calculate semantic similarity using TF-IDF cosine similarity
        
        Returns:
            float between 0.0 and 1.0
        """
        try:
            vectorizer = TfidfVectorizer(
                max_features=100,
                stop_words='english',
                lowercase=True,
                ngram_range=(1, 2)
            )
            
            tfidf_matrix = vectorizer.fit_transform([student_text, internship_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            return float(similarity)
        
        except Exception as e:
            print(f"Warning: Semantic similarity calculation failed: {e}")
            return 0.0
    
    
    def calculate_historical_score(
        self,
        db: Session,
        student_id: int,
        internship_id: int,
        employer_id: int,
        industry_id: Optional[int]
    ) -> float:
        """
        Calculate score based on historical success patterns
        
        Considers:
        - Previous applications to same employer
        - Previous applications to same industry
        - Overall student application success rate
        
        Returns:
            float between 0.0 and 1.0
        """
        from models import StudentInternshipMatch, InternshipApplication, Internship, Employer
        
        try:
            # Check if student has history with this employer
            employer_history = db.query(StudentInternshipMatch).join(
                Internship, StudentInternshipMatch.internship_id == Internship.internship_id
            ).filter(
                and_(
                    StudentInternshipMatch.student_id == student_id,
                    Internship.employer_id == employer_id,
                    StudentInternshipMatch.applied == True
                )
            ).all()
            
            employer_success_rate = 0.0
            if employer_history:
                accepted_count = sum(1 for m in employer_history if m.accepted)
                employer_success_rate = accepted_count / len(employer_history)
            
            # Check industry history if available
            industry_success_rate = 0.0
            if industry_id:
                industry_history = db.query(StudentInternshipMatch).join(
                    Internship, StudentInternshipMatch.internship_id == Internship.internship_id
                ).join(
                    Employer, Internship.employer_id == Employer.employer_id
                ).filter(
                    and_(
                        StudentInternshipMatch.student_id == student_id,
                        Employer.industry_id == industry_id,
                        StudentInternshipMatch.applied == True
                    )
                ).all()
                
                if industry_history:
                    accepted_count = sum(1 for m in industry_history if m.accepted)
                    industry_success_rate = accepted_count / len(industry_history)
            
            # Overall student success rate
            all_applications = db.query(StudentInternshipMatch).filter(
                and_(
                    StudentInternshipMatch.student_id == student_id,
                    StudentInternshipMatch.applied == True
                )
            ).all()
            
            overall_success_rate = 0.0
            if all_applications:
                accepted_count = sum(1 for m in all_applications if m.accepted)
                overall_success_rate = accepted_count / len(all_applications)
            
            # Weighted combination
            historical_score = (
                employer_success_rate * 0.5 +
                industry_success_rate * 0.3 +
                overall_success_rate * 0.2
            )
            
            return historical_score
        
        except Exception as e:
            print(f"Warning: Historical score calculation failed: {e}")
            return 0.5  # Neutral score if no history
    
    
    def calculate_match_score(
        self,
        db: Session,
        student_data: Dict,
        internship_data: Dict
    ) -> Dict:
        """
        Calculate comprehensive match score
        
        Args:
            db: Database session
            student_data: dict with student information
            internship_data: dict with internship information
        
        Returns:
            dict with match_score, components, and explanation
        """
        # If using simple cosine similarity only
        if self.use_simple_cosine:
            return self._calculate_simple_cosine_match(student_data, internship_data)
        
        # Extract data
        student_skills = student_data.get('skills', [])
        internship_skills = internship_data.get('skills', [])
        
        # 1. Skill Score
        skill_metrics = self.calculate_skill_score(student_skills, internship_skills)
        # Use weighted average of jaccard and coverage
        skill_score = (skill_metrics['jaccard'] * 0.6 + skill_metrics['coverage'] * 0.4)
        
        # 2. Program Score
        program_metrics = self.calculate_program_score(
            student_data.get('program', ''),
            student_data.get('major', ''),
            student_data.get('department', ''),
            internship_data.get('title', ''),
            internship_data.get('description', ''),
            internship_data.get('industry', '')
        )
        program_score = (program_metrics['program_match'] * 0.6 + program_metrics['major_match'] * 0.4)
        
        # 3. Semantic Score
        student_text = " ".join([
            " ".join(student_skills),
            student_data.get('program', ''),
            student_data.get('major', ''),
            student_data.get('department', ''),
            student_data.get('about', '')[:200]
        ])
        
        internship_text = " ".join([
            internship_data.get('title', ''),
            internship_data.get('description', '')[:500],
            " ".join(internship_skills),
            internship_data.get('industry', '')
        ])
        
        semantic_score = self.calculate_semantic_score(student_text, internship_text)
        
        # 4. Historical Score
        historical_score = self.calculate_historical_score(
            db,
            student_data.get('student_id'),
            internship_data.get('internship_id'),
            internship_data.get('employer_id'),
            internship_data.get('industry_id')
        )
        
        # Calculate weighted final score
        final_score = (
            skill_score * self.skill_weight +
            program_score * self.program_weight +
            semantic_score * self.semantic_weight +
            historical_score * self.historical_weight
        )
        
        # Determine match label
        if final_score >= 0.75:
            match_label = "Excellent Match"
            is_recommended = True
        elif final_score >= 0.60:
            match_label = "Strong Match"
            is_recommended = True
        elif final_score >= 0.45:
            match_label = "Good Match"
            is_recommended = True
        elif final_score >= 0.30:
            match_label = "Fair Match"
            is_recommended = False
        else:
            match_label = "Weak Match"
            is_recommended = False
        
        return {
            'match_score': round(final_score, 4),
            'match_label': match_label,
            'is_recommended': is_recommended,
            'components': {
                'skill_score': round(skill_score, 4),
                'program_score': round(program_score, 4),
                'semantic_score': round(semantic_score, 4),
                'historical_score': round(historical_score, 4)
            },
            'skill_metrics': skill_metrics,
            'program_metrics': program_metrics
        }
    
    
    def _calculate_simple_cosine_match(
        self,
        student_data: Dict,
        internship_data: Dict
    ) -> Dict:
        """
        Calculate match score using only cosine similarity on merged text
        
        Args:
            student_data: dict with student information
            internship_data: dict with internship information
        
        Returns:
            dict with match_score and components
        """
        # Merge all student information into one string
        student_skills = student_data.get('skills', [])
        student_text = " ".join(filter(None, [
            " ".join(student_skills),
            student_data.get('program', ''),
            student_data.get('major', ''),
            student_data.get('department', ''),
            self.clean_html(student_data.get('about', '')),
        ]))
        
        # Merge all internship information into one string
        internship_skills = internship_data.get('skills', [])
        internship_text = " ".join(filter(None, [
            internship_data.get('title', ''),
            self.clean_html(internship_data.get('description', '')),
            " ".join(internship_skills),
            internship_data.get('industry', ''),
            internship_data.get('address', '')
        ]))
        
        # Calculate cosine similarity
        cosine_score = self.calculate_semantic_score(student_text, internship_text)
        
        # Calculate skill metrics for explanation
        skill_metrics = self.calculate_skill_score(student_skills, internship_skills)
        
        # Use cosine score as base, but boost if strong skill match
        skill_coverage = skill_metrics['coverage']
        final_score = cosine_score
        
        # SKILL BOOST: If majority of skills match, boost the score
        if skill_coverage >= 0.50:
            # Boost score based on skill coverage
            skill_boost = skill_coverage * 0.3  # Up to 30% boost
            final_score = min(cosine_score + skill_boost, 1.0)
        
        # Determine match label based on final score
        if final_score >= 0.60:
            match_label = "Excellent Match"
            is_recommended = True
        elif final_score >= 0.45:
            match_label = "Strong Match"
            is_recommended = True
        elif final_score >= 0.30:
            match_label = "Good Match"
            is_recommended = False
        elif final_score >= 0.20:
            match_label = "Fair Match"
            is_recommended = False
        else:
            match_label = "Weak Match"
            is_recommended = False
        
        # SKILL OVERRIDE: If majority of required skills match, always recommend
        if skill_coverage >= 0.50 and not is_recommended:
            is_recommended = True
            match_label = f"{match_label} (Skills Override)"
        
        return {
            'match_score': round(final_score, 4),
            'match_label': match_label,
            'is_recommended': is_recommended,
            'components': {
                'cosine_similarity': round(cosine_score, 4),
                'skill_match_count': skill_metrics['match_count'],
                'skill_coverage': round(skill_metrics['coverage'], 4)
            },
            'skill_metrics': skill_metrics,
            'program_metrics': {}
        }
    
    
    def get_top_matches(
        self,
        db: Session,
        student_id: int,
        limit: int = 10,
        posting_type: Optional[str] = None,
        min_score: float = 0.30,
        store_matches: bool = True
    ) -> List[Dict]:
        """
        Get top N internship matches for a student
        
        Args:
            db: Database session
            student_id: Student ID
            limit: Number of top matches to return
            posting_type: Filter by 'internship' or 'job_placement'
            min_score: Minimum match score threshold
            store_matches: Whether to store matches in database
        
        Returns:
            List of match dictionaries sorted by score
        """
        from models import Student, Internship, Skill
        
        # Get student
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise ValueError(f"Student {student_id} not found")
        
        # Build query for active internships
        query = db.query(Internship).filter(
            Internship.status.in_(['approved', 'open'])
        )
        
        if posting_type:
            query = query.filter(Internship.posting_type == posting_type)
        
        internships = query.all()
        
        if not internships:
            return []
        
        # Prepare student data
        student_data = {
            'student_id': student.student_id,
            'skills': [skill.skill_name for skill in student.skills] if student.skills else [],
            'program': student.program or "",
            'major': student.major or "",
            'department': student.department or "",
            'about': student.about or ""
        }
        
        # Calculate matches
        matches = []
        for internship in internships:
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
            
            # Calculate match score
            match_result = self.calculate_match_score(db, student_data, internship_data)
            
            # Filter by minimum score
            if match_result['match_score'] >= min_score:
                matches.append({
                    'internship_id': internship.internship_id,
                    'internship_title': internship.title,
                    'company_name': internship_data['company_name'],
                    'industry': internship_data['industry'],
                    'posting_type': internship.posting_type,
                    'match_score': match_result['match_score'],
                    'match_label': match_result['match_label'],
                    'is_recommended': match_result['is_recommended'],
                    'components': match_result['components'],
                    'skill_metrics': match_result['skill_metrics']
                })
        
        # Sort by match score (descending)
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Store top matches in database if requested
        if store_matches and matches:
            self._store_matches(db, student_id, matches[:limit])
        
        return matches[:limit]
    
    
    def _store_matches(self, db: Session, student_id: int, matches: List[Dict]):
        """
        Store match scores in database for historical tracking
        
        Args:
            db: Database session
            student_id: Student ID
            matches: List of match dictionaries
        """
        from models import StudentInternshipMatch
        from sqlalchemy.dialects.postgresql import insert
        
        try:
            for match in matches:
                # Prepare feature values as JSON
                feature_values = json.dumps({
                    'components': match['components'],
                    'skill_metrics': match['skill_metrics']
                })
                
                # Use upsert to update if exists
                stmt = insert(StudentInternshipMatch).values(
                    student_id=student_id,
                    internship_id=match['internship_id'],
                    match_score=match['match_score'],
                    match_label=match['match_label'],
                    is_recommended=match['is_recommended'],
                    recommended_at=datetime.utcnow(),
                    feature_values=feature_values
                )
                
                # On conflict, update the match score and timestamp
                stmt = stmt.on_conflict_do_update(
                    constraint='unique_student_internship_match',
                    set_={
                        'match_score': stmt.excluded.match_score,
                        'match_label': stmt.excluded.match_label,
                        'is_recommended': stmt.excluded.is_recommended,
                        'recommended_at': stmt.excluded.recommended_at,
                        'feature_values': stmt.excluded.feature_values,
                        'updated_at': datetime.utcnow()
                    }
                )
                
                db.execute(stmt)
            
            db.commit()
            print(f"✓ Stored {len(matches)} matches for student {student_id}")
        
        except Exception as e:
            db.rollback()
            print(f"Warning: Failed to store matches: {e}")
    
    
    def update_match_feedback(
        self,
        db: Session,
        student_id: int,
        internship_id: int,
        applied: Optional[bool] = None,
        accepted: Optional[bool] = None
    ):
        """
        Update match record with application feedback
        
        This helps improve future recommendations by learning from outcomes
        
        Args:
            db: Database session
            student_id: Student ID
            internship_id: Internship ID
            applied: Whether student applied
            accepted: Whether application was accepted
        """
        from models import StudentInternshipMatch
        
        try:
            match = db.query(StudentInternshipMatch).filter(
                and_(
                    StudentInternshipMatch.student_id == student_id,
                    StudentInternshipMatch.internship_id == internship_id
                )
            ).first()
            
            if match:
                if applied is not None:
                    match.applied = applied
                    if applied:
                        match.applied_at = datetime.utcnow()
                
                if accepted is not None:
                    match.accepted = accepted
                    if accepted:
                        match.accepted_at = datetime.utcnow()
                
                match.updated_at = datetime.utcnow()
                db.commit()
                print(f"✓ Updated match feedback for student {student_id}, internship {internship_id}")
            else:
                print(f"Warning: Match record not found for student {student_id}, internship {internship_id}")
        
        except Exception as e:
            db.rollback()
            print(f"Error updating match feedback: {e}")


# Global matcher instance
_matcher_instance = None


def get_matcher() -> EnhancedInternshipMatcher:
    """Get or create global matcher instance"""
    global _matcher_instance
    
    if _matcher_instance is None:
        _matcher_instance = EnhancedInternshipMatcher()
    
    return _matcher_instance


if __name__ == "__main__":
    print("Enhanced Internship Matcher - Test Mode")
    print("="*60)
    
    # Test with sample data
    matcher = EnhancedInternshipMatcher()
    
    student_data = {
        'student_id': 1,
        'skills': ['Python', 'JavaScript', 'React', 'SQL'],
        'program': 'Computer Science',
        'major': 'Software Engineering',
        'department': 'College of Engineering',
        'about': 'Passionate about web development and building scalable applications'
    }
    
    internship_data = {
        'internship_id': 42,
        'employer_id': 10,
        'industry_id': 1,
        'skills': ['Python', 'React', 'Node.js', 'PostgreSQL'],
        'title': 'Software Engineering Intern',
        'description': 'We are looking for a Computer Science student with strong web development skills. Experience with Python and React is required.',
        'posting_type': 'internship',
        'industry': 'Information Technology',
        'company_name': 'Tech Solutions Inc.'
    }
    
    # Note: This test won't calculate historical score without DB connection
    print("\nTest Match Calculation:")
    print(f"Student: {student_data['program']} - {student_data['major']}")
    print(f"Skills: {', '.join(student_data['skills'])}")
    print(f"\nInternship: {internship_data['title']}")
    print(f"Company: {internship_data['company_name']}")
    print(f"Required Skills: {', '.join(internship_data['skills'])}")
    
    # Calculate skill score
    skill_metrics = matcher.calculate_skill_score(student_data['skills'], internship_data['skills'])
    print(f"\nSkill Metrics:")
    print(f"  Jaccard Similarity: {skill_metrics['jaccard']:.2%}")
    print(f"  Coverage: {skill_metrics['coverage']:.2%}")
    print(f"  Matching Skills: {skill_metrics['match_count']}/{skill_metrics['total_required']}")
    
    # Calculate program score
    program_metrics = matcher.calculate_program_score(
        student_data['program'],
        student_data['major'],
        student_data['department'],
        internship_data['title'],
        internship_data['description'],
        internship_data['industry']
    )
    print(f"\nProgram Metrics:")
    print(f"  Program Match: {program_metrics['program_match']:.2%}")
    print(f"  Major Match: {program_metrics['major_match']:.2%}")
    
    # Calculate semantic score
    student_text = " ".join([
        " ".join(student_data['skills']),
        student_data['program'],
        student_data['major'],
        student_data['about']
    ])
    internship_text = " ".join([
        internship_data['title'],
        internship_data['description'],
        " ".join(internship_data['skills'])
    ])
    semantic_score = matcher.calculate_semantic_score(student_text, internship_text)
    print(f"\nSemantic Score: {semantic_score:.2%}")
    
    # Calculate final score (without historical component for this test)
    skill_component = skill_metrics['jaccard'] * 0.6 + skill_metrics['coverage'] * 0.4
    program_component = program_metrics['program_match'] * 0.6 + program_metrics['major_match'] * 0.4
    
    final_score = (
        skill_component * matcher.skill_weight +
        program_component * matcher.program_weight +
        semantic_score * matcher.semantic_weight +
        0.5 * matcher.historical_weight  # Neutral historical score
    )
    
    print(f"\n{'='*60}")
    print(f"FINAL MATCH SCORE: {final_score:.2%}")
    print(f"{'='*60}")
    print(f"\nScore Breakdown:")
    print(f"  Skills ({matcher.skill_weight:.0%}): {skill_component:.4f} → {skill_component * matcher.skill_weight:.4f}")
    print(f"  Program ({matcher.program_weight:.0%}): {program_component:.4f} → {program_component * matcher.program_weight:.4f}")
    print(f"  Semantic ({matcher.semantic_weight:.0%}): {semantic_score:.4f} → {semantic_score * matcher.semantic_weight:.4f}")
    print(f"  Historical ({matcher.historical_weight:.0%}): 0.5000 → {0.5 * matcher.historical_weight:.4f}")
    
    if final_score >= 0.60:
        print(f"\n✓ RECOMMENDED: This is a {('Excellent' if final_score >= 0.75 else 'Strong')} match!")
    else:
        print(f"\n✗ NOT RECOMMENDED: Match score below threshold")
