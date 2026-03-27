"""
Test Script for Enhanced Matching System

This script tests the matching system with sample data to verify it's working correctly.

Usage:
    python scripts/test_matching_system.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import Student, Internship, Skill, Employer, Industry
from ml_models.enhanced_matcher import get_matcher


def test_matching_system():
    """Test the matching system with database data"""
    print("="*70)
    print("ENHANCED MATCHING SYSTEM - TEST SCRIPT")
    print("="*70)
    
    db = SessionLocal()
    
    try:
        # Get matcher
        print("\n1. Initializing matcher...")
        matcher = get_matcher()
        print("   ✓ Matcher initialized")
        print(f"   Weights: Skills={matcher.skill_weight}, Program={matcher.program_weight}, "
              f"Semantic={matcher.semantic_weight}, Historical={matcher.historical_weight}")
        
        # Get a sample student
        print("\n2. Fetching sample student...")
        student = db.query(Student).filter(Student.status == 'active').first()
        
        if not student:
            print("   ✗ No active students found in database")
            print("   Please add students first")
            return
        
        print(f"   ✓ Found student: {student.first_name} {student.last_name} (ID: {student.student_id})")
        print(f"   Program: {student.program}")
        print(f"   Major: {student.major}")
        student_skills = [skill.skill_name for skill in student.skills] if student.skills else []
        print(f"   Skills: {', '.join(student_skills) if student_skills else 'None'}")
        
        # Get sample internships
        print("\n3. Fetching active internships...")
        internships = db.query(Internship).filter(
            Internship.status.in_(['approved', 'open'])
        ).limit(10).all()
        
        if not internships:
            print("   ✗ No active internships found in database")
            print("   Please add internships first")
            return
        
        print(f"   ✓ Found {len(internships)} active internships")
        
        # Calculate matches
        print("\n4. Calculating match scores...")
        print("   " + "-"*66)
        
        matches = matcher.get_top_matches(
            db=db,
            student_id=student.student_id,
            limit=10,
            posting_type=None,
            min_score=0.20,  # Lower threshold for testing
            store_matches=True
        )
        
        if not matches:
            print("   ✗ No matches found (all scores below threshold)")
            print("   Try lowering min_score or adding more skills to student profile")
            return
        
        print(f"   ✓ Calculated {len(matches)} matches")
        print("\n5. Top Recommendations:")
        print("   " + "="*66)
        
        for i, match in enumerate(matches[:5], 1):
            print(f"\n   {i}. {match['internship_title']}")
            print(f"      Company: {match['company_name']}")
            print(f"      Match Score: {match['match_score']:.2%} ({match['match_label']})")
            print(f"      Recommended: {'✓ Yes' if match['is_recommended'] else '✗ No'}")
            print(f"      Components:")
            print(f"        - Skills: {match['components']['skill_score']:.4f}")
            print(f"        - Program: {match['components']['program_score']:.4f}")
            print(f"        - Semantic: {match['components']['semantic_score']:.4f}")
            print(f"        - Historical: {match['components']['historical_score']:.4f}")
            print(f"      Skill Match: {match['skill_metrics']['match_count']}/{match['skill_metrics']['total_required']} "
                  f"({match['skill_metrics']['coverage']:.0%} coverage)")
        
        # Test match explanation
        print("\n6. Testing match explanation...")
        if matches:
            top_match = matches[0]
            print(f"   Explaining why '{top_match['internship_title']}' was recommended...")
            
            # Get detailed breakdown
            skill_contrib = top_match['components']['skill_score'] * matcher.skill_weight
            program_contrib = top_match['components']['program_score'] * matcher.program_weight
            semantic_contrib = top_match['components']['semantic_score'] * matcher.semantic_weight
            historical_contrib = top_match['components']['historical_score'] * matcher.historical_weight
            
            print(f"\n   Score Contributions:")
            print(f"     Skills (40%):     {skill_contrib:.4f}")
            print(f"     Program (25%):    {program_contrib:.4f}")
            print(f"     Semantic (25%):   {semantic_contrib:.4f}")
            print(f"     Historical (10%): {historical_contrib:.4f}")
            print(f"     ─────────────────────────")
            print(f"     Total:            {top_match['match_score']:.4f}")
        
        print("\n" + "="*70)
        print("TEST COMPLETED SUCCESSFULLY ✓")
        print("="*70)
        print("\nNext Steps:")
        print("  1. Test API endpoints using curl or Postman")
        print("  2. Integrate with Angular frontend")
        print("  3. Monitor matching analytics")
        print("  4. Adjust weights if needed")
        
    except Exception as e:
        print(f"\n✗ Error during testing: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()


if __name__ == "__main__":
    test_matching_system()
