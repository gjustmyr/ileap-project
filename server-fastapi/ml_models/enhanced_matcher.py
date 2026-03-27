"""
Enhanced Student-Internship Matching System

This module provides an improved matching algorithm that:
1. Calculates match scores based on skills, program/major, and semantic similarity
2. Stores historical matches in the database for learning
3. Supports both rule-based and ML-based matching
4. Provides explainable recommendations
5. Uses Sentence Transformers for advanced semantic matching

Author: ILEAP Development Team
Version: 2.1.1
"""

import json
import re
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity

# Try to import sentence transformers, fall back to TF-IDF if not available
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    print("Warning: sentence-transformers not installed. Using TF-IDF fallback.")
    print("Install with: pip install sentence-transformers")


# Custom stop words for job matching
CUSTOM_STOP_WORDS = ENGLISH_STOP_WORDS.union({
    'intern', 'internship', 'position', 'role', 'job', 'opportunity',
    'looking', 'seeking', 'need', 'want', 'must', 'should', 'will',
    'company', 'team', 'work', 'working', 'experience', 'candidate',
    'student', 'trainee', 'applicant', 'individual', 'person',
    'join', 'hiring', 'recruiting', 'employment', 'career'
})

# Skill synonyms for normalization
SKILL_SYNONYMS = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'react.js': 'react',
    'reactjs': 'react',
    'react js': 'react',
    'node.js': 'nodejs',
    'node js': 'nodejs',
    'vue.js': 'vue',
    'vuejs': 'vue',
    'angular.js': 'angular',
    'angularjs': 'angular',
    'c++': 'cpp',
    'c#': 'csharp',
    '.net': 'dotnet',
    'asp.net': 'aspnet',
    'ml': 'machine learning',
    'ai': 'artificial intelligence',
    'db': 'database',
    'sql': 'structured query language',
    'nosql': 'non relational database',
    'ui': 'user interface',
    'ux': 'user experience',
    'api': 'application programming interface',
    'rest': 'restful api',
    'graphql': 'graph query language',
    'html5': 'html',
    'css3': 'css',
    'es6': 'javascript',
    'jquery': 'javascript library',
}

# Program-to-job-title relevance keywords
PROGRAM_KEYWORDS = {
    'computer engineering': ['software', 'hardware', 'embedded', 'systems', 'network', 'programming', 'developer', 'engineer', 'it', 'tech support', 'database', 'web', 'mobile', 'cloud', 'firmware', 'iot', 'robotics', 'automation'],
    'computer science': ['software', 'developer', 'programmer', 'data', 'ai', 'ml', 'algorithm', 'web', 'mobile', 'cloud', 'database', 'backend', 'frontend', 'fullstack', 'devops', 'machine learning', 'artificial intelligence'],
    'information technology': ['it', 'support', 'network', 'systems', 'administrator', 'helpdesk', 'infrastructure', 'security', 'cybersecurity', 'server', 'cloud', 'technical support', 'system admin'],
    'information systems': ['analyst', 'business analyst', 'systems analyst', 'it', 'database', 'erp', 'crm', 'project management', 'business intelligence'],
    'electrical engineering': ['electrical', 'electronics', 'circuit', 'power', 'automation', 'control', 'embedded', 'instrumentation', 'plc', 'scada'],
    'mechanical engineering': ['mechanical', 'cad', 'design', 'manufacturing', 'production', 'maintenance', 'hvac', 'autocad', 'solidworks'],
    'civil engineering': ['civil', 'construction', 'structural', 'surveying', 'autocad', 'project engineer', 'site engineer', 'estimator'],
    'business': ['business', 'management', 'marketing', 'sales', 'finance', 'accounting', 'hr', 'human resources', 'operations', 'admin'],
    'accounting': ['accounting', 'accountant', 'bookkeeping', 'audit', 'tax', 'finance', 'payroll', 'accounts'],
    'marketing': ['marketing', 'digital marketing', 'social media', 'content', 'seo', 'advertising', 'brand', 'campaign'],
    'multimedia': ['graphic design', 'video editing', 'animation', 'photoshop', 'illustrator', 'premiere', 'after effects', 'ui', 'ux', 'designer'],
}


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
        use_simple_cosine: bool = True,
        use_sentence_transformers: bool = True
    ):
        """
        Initialize matcher with configurable weights
        
        Args:
            skill_weight: Weight for skill matching (default 40%)
            program_weight: Weight for program/major matching (default 25%)
            semantic_weight: Weight for semantic text similarity (default 25%)
            historical_weight: Weight for historical success patterns (default 10%)
            use_simple_cosine: If True, use only cosine similarity on merged text (default True)
            use_sentence_transformers: If True, use Sentence Transformers instead of TF-IDF (default True)
        """
        self.skill_weight = skill_weight
        self.program_weight = program_weight
        self.semantic_weight = semantic_weight
        self.historical_weight = historical_weight
        self.use_simple_cosine = use_simple_cosine
        self.use_sentence_transformers = use_sentence_transformers and SENTENCE_TRANSFORMERS_AVAILABLE
        
        # Initialize Sentence Transformer model if available
        self.sentence_model = None
        if self.use_sentence_transformers:
            try:
                # Use a lightweight, fast model optimized for semantic similarity
                self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
                print("✓ Sentence Transformers loaded successfully")
            except Exception as e:
                print(f"Warning: Failed to load Sentence Transformers: {e}")
                print("Falling back to TF-IDF")
                self.use_sentence_transformers = False
        
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
    
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Enhanced text cleaning for better matching
        
        Args:
            text: Raw text to clean
            
        Returns:
            Cleaned and normalized text
        """
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http[s]?://\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove special characters but keep spaces and hyphens
        text = re.sub(r'[^a-z0-9\s\-]', ' ', text)
        
        # Replace hyphens with spaces
        text = text.replace('-', ' ')
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove very short words (1-2 characters) except common tech terms
        words = text.split()
        words = [w for w in words if len(w) > 2 or w in ['ai', 'ml', 'ui', 'ux', 'db', 'js', 'ts', 'py', 'c', 'r']]
        
        return ' '.join(words).strip()
    
    
    @staticmethod
    def normalize_skills(skills: List[str]) -> List[str]:
        """
        Normalize skill names using synonym dictionary
        
        Args:
            skills: List of skill names
            
        Returns:
            List of normalized skill names
        """
        normalized = []
        for skill in skills:
            if not skill:
                continue
            skill_lower = skill.lower().strip()
            # Apply synonyms
            skill_normalized = SKILL_SYNONYMS.get(skill_lower, skill_lower)
            normalized.append(skill_normalized)
        return normalized
    
    
    @staticmethod
    def normalize_job_title(title: str) -> str:
        """
        Normalize job titles to handle similar variations
        
        Examples:
        - "Software Engineer" -> "software engineer developer"
        - "Full Stack Developer" -> "full stack developer engineer"
        - "Frontend Dev" -> "frontend developer engineer"
        
        Args:
            title: Job title to normalize
            
        Returns:
            Normalized title with common variations
        """
        if not title:
            return ""
        
        title_lower = title.lower()
        
        # Add common synonyms
        synonyms = {
            'engineer': 'engineer developer',
            'developer': 'developer engineer',
            'dev': 'developer engineer',
            'programmer': 'programmer developer engineer',
            'frontend': 'frontend front-end front end',
            'backend': 'backend back-end back end',
            'fullstack': 'fullstack full-stack full stack',
            'full stack': 'fullstack full-stack full stack',
            'jr': 'junior jr',
            'sr': 'senior sr',
            'intern': 'intern internship trainee',
            'internship': 'intern internship trainee',
        }
        
        # Apply synonyms
        for key, value in synonyms.items():
            if key in title_lower:
                title_lower = title_lower.replace(key, value)
        
        return title_lower
    
    
    @staticmethod
    def check_program_relevance(
        student_program: str,
        student_major: str,
        job_title: str,
        job_description: str
    ) -> float:
        """
        Check if job is relevant to student's program/major
        
        Returns a relevance factor between 0.3 and 1.0:
        - 1.0 = Highly relevant (keywords match)
        - 0.3 = Not relevant (no keywords match) - 70% penalty
        
        Args:
            student_program: Student's program (e.g., "Computer Engineering")
            student_major: Student's major (e.g., "Software Engineering")
            job_title: Internship title
            job_description: Internship description
            
        Returns:
            float: Relevance factor (0.3 to 1.0)
        """
        if not student_program and not student_major:
            return 1.0  # No penalty if no program info
        
        # Combine program and major for checking
        student_field = f"{student_program} {student_major}".lower()
        job_text = f"{job_title} {job_description[:500]}".lower()
        
        # Find relevant keywords for this program
        relevant_keywords = []
        for program, keywords in PROGRAM_KEYWORDS.items():
            if program in student_field:
                relevant_keywords.extend(keywords)
        
        if not relevant_keywords:
            return 1.0  # No penalty if program not in mapping
        
        # Check if any relevant keyword appears in job
        matches = 0
        for keyword in relevant_keywords:
            if keyword in job_text:
                matches += 1
        
        if matches > 0:
            return 1.0  # Relevant - no penalty
        
        # Not relevant - apply 70% penalty (return 0.3)
        return 0.3
    
    
    def calculate_skill_score(
        self,
        student_skills: List[str],
        internship_skills: List[str]
    ) -> Dict[str, float]:
        """
        Calculate skill matching score using hybrid approach:
        1. Exact matching (primary)
        2. Semantic similarity (secondary, for partial credit)
        
        Returns:
            dict with jaccard, coverage, match_count, and semantic_score
        """
        # Normalize skills first
        student_skills_normalized = self.normalize_skills(student_skills)
        internship_skills_normalized = self.normalize_skills(internship_skills)
        
        # Convert to sets for comparison
        student_skills_set = {s.lower().strip() for s in student_skills_normalized if s}
        internship_skills_set = {s.lower().strip() for s in internship_skills_normalized if s}
        
        # Calculate exact match metrics
        if not student_skills_set or not internship_skills_set:
            return {
                'jaccard': 0.0,
                'coverage': 0.0,
                'match_count': 0,
                'total_required': len(internship_skills_set)
            }
        
        intersection = student_skills_set.intersection(internship_skills_set)
        union = student_skills_set.union(internship_skills_set)
        
        exact_jaccard = len(intersection) / len(union) if union else 0.0
        exact_coverage = len(intersection) / len(internship_skills_set) if internship_skills_set else 0.0
        
        # Calculate semantic similarity for skills (if enabled and available)
        semantic_similarity = 0.0
        if (self.use_sentence_transformers and 
            hasattr(self, 'sentence_model') and 
            self.sentence_model is not None and 
            len(student_skills_set) > 0 and 
            len(internship_skills_set) > 0):
            try:
                # Create skill text
                student_skill_text = " ".join(student_skills_set)
                internship_skill_text = " ".join(internship_skills_set)
                
                # Calculate semantic similarity
                embeddings = self.sentence_model.encode([student_skill_text, internship_skill_text])
                semantic_similarity = cosine_similarity(
                    embeddings[0].reshape(1, -1),
                    embeddings[1].reshape(1, -1)
                )[0][0]
                semantic_similarity = max(0.0, min(1.0, float(semantic_similarity)))
            except Exception as e:
                print(f"Warning: Skill semantic similarity failed: {e}")
                semantic_similarity = 0.0
        
        # If semantic similarity is available, combine (80% exact, 20% semantic)
        # Otherwise, use 100% exact matching
        if semantic_similarity > 0:
            combined_jaccard = (exact_jaccard * 0.80) + (semantic_similarity * 0.20)
            combined_coverage = (exact_coverage * 0.80) + (semantic_similarity * 0.20)
        else:
            combined_jaccard = exact_jaccard
            combined_coverage = exact_coverage
        
        return {
            'jaccard': combined_jaccard,
            'coverage': combined_coverage,
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
        Calculate semantic similarity using Sentence Transformers or TF-IDF fallback
        
        Returns:
            float between 0.0 and 1.0
        """
        try:
            # Clean both texts
            student_text = self.clean_text(student_text)
            internship_text = self.clean_text(internship_text)
            
            if not student_text or not internship_text:
                return 0.0
            
            # Use Sentence Transformers if available (better accuracy)
            if self.use_sentence_transformers and self.sentence_model:
                return self._calculate_semantic_score_transformers(student_text, internship_text)
            
            # Fallback to TF-IDF (faster, but less accurate)
            return self._calculate_semantic_score_tfidf(student_text, internship_text)
        
        except Exception as e:
            print(f"Warning: Semantic similarity calculation failed: {e}")
            return 0.0
    
    
    def _calculate_semantic_score_transformers(
        self,
        student_text: str,
        internship_text: str
    ) -> float:
        """
        Calculate semantic similarity using Sentence Transformers
        
        This method uses pre-trained neural networks to understand semantic meaning,
        resulting in much better matching than TF-IDF.
        
        Returns:
            float between 0.0 and 1.0
        """
        try:
            # Generate embeddings (vector representations)
            embeddings = self.sentence_model.encode([student_text, internship_text])
            
            # Calculate cosine similarity between embeddings
            similarity = cosine_similarity(
                embeddings[0].reshape(1, -1),
                embeddings[1].reshape(1, -1)
            )[0][0]
            
            # Normalize to 0-1 range (sometimes can be slightly negative)
            similarity = max(0.0, min(1.0, similarity))
            
            return float(similarity)
        
        except Exception as e:
            print(f"Warning: Sentence Transformers calculation failed: {e}")
            # Fallback to TF-IDF
            return self._calculate_semantic_score_tfidf(student_text, internship_text)
    
    
    def _calculate_semantic_score_tfidf(
        self,
        student_text: str,
        internship_text: str
    ) -> float:
        """
        Calculate semantic similarity using TF-IDF (fallback method)
        
        Returns:
            float between 0.0 and 1.0
        """
        try:
            vectorizer = TfidfVectorizer(
                max_features=150,
                stop_words=list(CUSTOM_STOP_WORDS),
                lowercase=True,
                ngram_range=(1, 2),
                min_df=1,
                max_df=0.95
            )
            
            tfidf_matrix = vectorizer.fit_transform([student_text, internship_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            return float(similarity)
        
        except Exception as e:
            print(f"Warning: TF-IDF calculation failed: {e}")
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
        Calculate match score using pure dual-encoder approach
        
        Concatenates ALL student data into one string, ALL internship data into another,
        then feeds both to Sentence Transformers to get ONE cosine similarity score.
        
        No manual weighting, no component scores - just pure semantic similarity.
        
        Args:
            student_data: dict with student information
            internship_data: dict with internship information
        
        Returns:
            dict with match_score, match_label, and is_recommended only
        """
        # Concatenate ALL student information into ONE string
        student_skills = student_data.get('skills', [])
        student_skills_normalized = self.normalize_skills(student_skills)
        student_text = " ".join(filter(None, [
            " ".join(student_skills_normalized),
            student_data.get('program', ''),
            student_data.get('major', ''),
            student_data.get('department', ''),
            self.clean_html(student_data.get('about', '')),
        ]))
        
        # Concatenate ALL internship information into ONE string
        internship_skills = internship_data.get('skills', [])
        internship_skills_normalized = self.normalize_skills(internship_skills)
        internship_text = " ".join(filter(None, [
            self.normalize_job_title(internship_data.get('title', '')),
            self.clean_html(internship_data.get('description', '')),
            " ".join(internship_skills_normalized),
            internship_data.get('industry', ''),
            internship_data.get('company_name', ''),
            internship_data.get('address', '')
        ]))
        
        # Feed both strings to Sentence Transformers → Get ONE cosine similarity score
        cosine_similarity = self.calculate_semantic_score(student_text, internship_text)
        
        # Calculate skill match count for display only (not used in scoring)
        student_skills_set = {s.lower().strip() for s in student_skills_normalized if s}
        internship_skills_set = {s.lower().strip() for s in internship_skills_normalized if s}
        skill_match_count = len(student_skills_set.intersection(internship_skills_set))
        total_required_skills = len(internship_skills_set)
        
        # Determine recommendation based on cosine similarity threshold
        if cosine_similarity >= 0.40:
            match_label = "Recommended"
            is_recommended = True
        else:
            match_label = "Not Recommended"
            is_recommended = False
        
        # Return ONLY the final score and recommendation
        return {
            'match_score': round(cosine_similarity, 4),
            'match_label': match_label,
            'is_recommended': is_recommended,
            'skill_match_count': skill_match_count,
            'total_required_skills': total_required_skills
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
                    'skill_match_count': match_result.get('skill_match_count', 0),
                    'total_required_skills': match_result.get('total_required_skills', 0)
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
                # Prepare feature values as JSON (simplified - just skill counts)
                feature_values = json.dumps({
                    'skill_match_count': match.get('skill_match_count', 0),
                    'total_required_skills': match.get('total_required_skills', 0)
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
