"""Test program relevance with dual-encoder approach"""
from ml_models.enhanced_matcher import get_matcher

# Initialize matcher
matcher = get_matcher()
print(f"✓ Matcher initialized")
print(f"  Using Sentence Transformers: {matcher.use_sentence_transformers}")
print(f"  Using Simple Cosine: {matcher.use_simple_cosine}")

# Test 1: Computer Engineering student with Technical Writer position (should be low match)
print("\n" + "="*60)
print("TEST 1: Computer Engineering → Technical Writer")
print("="*60)

student_data_1 = {
    'student_id': 1,
    'skills': ['Python', 'C++', 'Embedded Systems', 'Circuit Design'],
    'program': 'Computer Engineering',
    'major': 'Hardware Engineering',
    'department': 'College of Engineering',
    'about': 'Interested in embedded systems and hardware design'
}

internship_data_1 = {
    'internship_id': 1,
    'employer_id': 1,
    'industry_id': 1,
    'skills': ['Documentation', 'Communication', 'Technical Writing', 'Markdown'],
    'title': 'Technical Writer Intern',
    'description': 'Looking for someone to write documentation and user guides',
    'posting_type': 'internship',
    'industry': 'Technology',
    'company_name': 'SentryTECH',
    'address': 'Batangas City'
}

result_1 = matcher._calculate_simple_cosine_match(student_data_1, internship_data_1)

print(f"\nMatch Score: {result_1['match_score']:.4f} ({result_1['match_score']*100:.2f}%)")
print(f"Match Label: {result_1['match_label']}")
print(f"Recommended: {result_1['is_recommended']}")
print(f"Semantic Similarity: {result_1['match_score']:.4f}")
print(f"Skill Match: {result_1['skill_match_count']}/{result_1['total_required_skills']}")

# Test 2: Computer Engineering student with Software Engineering position (should be high match)
print("\n" + "="*60)
print("TEST 2: Computer Engineering → Software Engineering")
print("="*60)

internship_data_2 = {
    'internship_id': 2,
    'employer_id': 2,
    'industry_id': 1,
    'skills': ['Python', 'C++', 'Embedded Systems', 'Linux'],
    'title': 'Embedded Software Engineer Intern',
    'description': 'Looking for Computer Engineering student with embedded systems and programming experience',
    'posting_type': 'internship',
    'industry': 'Technology',
    'company_name': 'Tech Solutions',
    'address': 'Manila'
}

result_2 = matcher._calculate_simple_cosine_match(student_data_1, internship_data_2)

print(f"\nMatch Score: {result_2['match_score']:.4f} ({result_2['match_score']*100:.2f}%)")
print(f"Match Label: {result_2['match_label']}")
print(f"Recommended: {result_2['is_recommended']}")
print(f"Semantic Similarity: {result_2['match_score']:.4f}")
print(f"Skill Match: {result_2['skill_match_count']}/{result_2['total_required_skills']}")

# Test 3: Business student with Marketing position (should be high match)
print("\n" + "="*60)
print("TEST 3: Business → Marketing")
print("="*60)

student_data_3 = {
    'student_id': 3,
    'skills': ['Marketing', 'Social Media', 'Content Creation', 'Analytics'],
    'program': 'Business Administration',
    'major': 'Marketing',
    'department': 'College of Business',
    'about': 'Passionate about digital marketing and brand management'
}

internship_data_3 = {
    'internship_id': 3,
    'employer_id': 3,
    'industry_id': 2,
    'skills': ['Marketing', 'Social Media', 'SEO', 'Content Writing'],
    'title': 'Digital Marketing Intern',
    'description': 'Looking for Business or Marketing student with social media experience',
    'posting_type': 'internship',
    'industry': 'Marketing',
    'company_name': 'Marketing Agency',
    'address': 'Quezon City'
}

result_3 = matcher._calculate_simple_cosine_match(student_data_3, internship_data_3)

print(f"\nMatch Score: {result_3['match_score']:.4f} ({result_3['match_score']*100:.2f}%)")
print(f"Match Label: {result_3['match_label']}")
print(f"Recommended: {result_3['is_recommended']}")
print(f"Semantic Similarity: {result_3['match_score']:.4f}")
print(f"Skill Match: {result_3['skill_match_count']}/{result_3['total_required_skills']}")

print("\n" + "="*60)
print("✓ ALL TESTS COMPLETE")
print("="*60)
print("\nExpected Results:")
print("  Test 1 (CompEng → Tech Writer): LOW score, NOT recommended")
print("  Test 2 (CompEng → Embedded SW): HIGH score, recommended")
print("  Test 3 (Business → Marketing): HIGH score, recommended")
