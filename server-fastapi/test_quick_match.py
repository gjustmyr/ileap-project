"""Quick test of the matching system"""
from ml_models.enhanced_matcher import get_matcher

# Initialize matcher
matcher = get_matcher()
print(f"✓ Matcher initialized")
print(f"  Using Sentence Transformers: {matcher.use_sentence_transformers}")
print(f"  Using Simple Cosine: {matcher.use_simple_cosine}")

# Test data
student_data = {
    'student_id': 1,
    'skills': ['Python', 'JavaScript', 'React', 'SQL'],
    'program': 'Computer Science',
    'major': 'Software Engineering',
    'department': 'College of Engineering',
    'about': 'Passionate about web development'
}

internship_data = {
    'internship_id': 1,
    'employer_id': 1,
    'industry_id': 1,
    'skills': ['Python', 'React', 'Node.js'],
    'title': 'Software Engineering Intern',
    'description': 'Looking for a Computer Science student with Python and React experience',
    'posting_type': 'internship',
    'industry': 'Information Technology',
    'company_name': 'Tech Corp',
    'address': 'Manila, Philippines'
}

# Calculate match (without DB for quick test)
print("\n" + "="*60)
print("TESTING MATCH CALCULATION")
print("="*60)

result = matcher._calculate_simple_cosine_match(student_data, internship_data)

print(f"\nMatch Score: {result['match_score']:.4f} ({result['match_score']*100:.2f}%)")
print(f"Match Label: {result['match_label']}")
print(f"Recommended: {result['is_recommended']}")
print(f"Skill Match: {result['skill_match_count']}/{result['total_required_skills']}")

print("\n" + "="*60)
print("✓ TEST COMPLETE")
print("="*60)
