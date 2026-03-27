"""
STEP 1: Collect Training Data from Existing Database

This script pulls student profiles and internship/job postings from your database,
and labels matches based on application history.

Positive examples (label=1): Student applied to the job
Negative examples (label=0): Student did NOT apply (random sampling)
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import Student, Internship, InternshipApplication, Employer, Industry
from sqlalchemy.orm import Session
import pandas as pd
from datetime import datetime
import json


def collect_training_data(db: Session, output_file="training_data.csv"):
    """
    Collect training data from database
    
    Strategy:
    - Positive examples: student applied to internship/job (from InternshipApplication)
    - Negative examples: student did NOT apply (random pairing)
    """
    
    print("="*60)
    print("STEP 1: COLLECTING TRAINING DATA")
    print("="*60)
    
    # Collect all applications (positive examples)
    applications = db.query(InternshipApplication).all()
    
    print(f"\n✓ Found {len(applications)} applications in database")
    
    # Build positive examples
    positive_examples = []
    for app in applications:
        student = app.student
        internship = app.internship
        
        if not student or not internship:
            continue
        
        # Extract student features
        student_skills = [skill.skill_name for skill in student.skills] if student.skills else []
        student_program = student.program or ""
        student_major = student.major or ""
        student_department = student.department or ""
        student_about = student.about or ""
        
        # Extract internship features
        internship_skills = [skill.skill_name for skill in internship.skills] if internship.skills else []
        internship_title = internship.title or ""
        internship_description = internship.full_description or ""
        internship_type = internship.posting_type or "internship"
        
        # Employer info
        employer_name = internship.employer.company_name if internship.employer else ""
        industry_name = internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else ""
        
        positive_examples.append({
            "student_id": student.student_id,
            "internship_id": internship.internship_id,
            "student_skills": json.dumps(student_skills),
            "student_program": student_program,
            "student_major": student_major,
            "student_department": student_department,
            "student_about": student_about,
            "internship_skills": json.dumps(internship_skills),
            "internship_title": internship_title,
            "internship_description": internship_description,
            "internship_type": internship_type,
            "employer_name": employer_name,
            "industry_name": industry_name,
            "application_status": app.status,
            "label": 1  # Positive match - student applied
        })
    
    print(f"✓ Built {len(positive_examples)} positive examples")
    
    # Build negative examples (random student-internship pairs that did NOT apply)
    print("\nGenerating negative examples...")
    
    # Get all students and internships
    all_students = db.query(Student).filter(Student.status == "active").all()
    all_internships = db.query(Internship).filter(Internship.status.in_(["open", "closed"])).all()
    
    print(f"  Total students: {len(all_students)}")
    print(f"  Total internships: {len(all_internships)}")
    
    # Create a set of (student_id, internship_id) pairs that HAVE applications
    applied_pairs = {(app.student_id, app.internship_id) for app in applications}
    
    print(f"  Applied pairs: {len(applied_pairs)}")
    
    negative_examples = []
    import random
    random.seed(42)  # For reproducibility
    
    # Generate negative examples: aim for 2x-3x the number of positive examples
    target_negatives = min(len(positive_examples) * 3, len(all_students) * len(all_internships))
    
    attempts = 0
    max_attempts = target_negatives * 10  # Safety limit
    
    while len(negative_examples) < target_negatives and attempts < max_attempts:
        attempts += 1
        
        # Randomly pair a student with an internship
        student = random.choice(all_students)
        internship = random.choice(all_internships)
        
        # Skip if this pair already applied
        if (student.student_id, internship.internship_id) in applied_pairs:
            continue
        
        # Skip if we already added this pair as negative
        if any(ex["student_id"] == student.student_id and ex["internship_id"] == internship.internship_id 
               for ex in negative_examples):
            continue
        
        # Extract features (same as positive examples)
        student_skills = [skill.skill_name for skill in student.skills] if student.skills else []
        student_program = student.program or ""
        student_major = student.major or ""
        student_department = student.department or ""
        student_about = student.about or ""
        
        internship_skills = [skill.skill_name for skill in internship.skills] if internship.skills else []
        internship_title = internship.title or ""
        internship_description = internship.full_description or ""
        internship_type = internship.posting_type or "internship"
        
        employer_name = internship.employer.company_name if internship.employer else ""
        industry_name = internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else ""
        
        negative_examples.append({
            "student_id": student.student_id,
            "internship_id": internship.internship_id,
            "student_skills": json.dumps(student_skills),
            "student_program": student_program,
            "student_major": student_major,
            "student_department": student_department,
            "student_about": student_about,
            "internship_skills": json.dumps(internship_skills),
            "internship_title": internship_title,
            "internship_description": internship_description,
            "internship_type": internship_type,
            "employer_name": employer_name,
            "industry_name": industry_name,
            "application_status": "none",
            "label": 0  # Negative match - student did NOT apply
        })
    
    print(f"✓ Built {len(negative_examples)} negative examples")
    
    # Combine all examples
    all_examples = positive_examples + negative_examples
    
    # Convert to DataFrame
    df = pd.DataFrame(all_examples)
    
    # Shuffle the data
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Save to CSV
    df.to_csv(output_file, index=False)
    
    print(f"\n{'='*60}")
    print(f"✓ Training data saved to: {output_file}")
    print(f"{'='*60}")
    print(f"Total examples: {len(df)}")
    print(f"Positive examples (applied): {len(positive_examples)} ({len(positive_examples)/len(df)*100:.1f}%)")
    print(f"Negative examples (did not apply): {len(negative_examples)} ({len(negative_examples)/len(df)*100:.1f}%)")
    print(f"\nClass distribution:")
    print(df['label'].value_counts())
    print(f"\nPosting type distribution:")
    print(df['internship_type'].value_counts())
    
    return df


if __name__ == "__main__":
    # Get database session
    db = next(get_db())
    
    try:
        # Collect data
        df = collect_training_data(db, output_file="ml_models/training_data.csv")
        
        print("\n" + "="*60)
        print("PREVIEW OF TRAINING DATA")
        print("="*60)
        print(df.head())
        print("\nColumn names:")
        print(df.columns.tolist())
        
    finally:
        db.close()
