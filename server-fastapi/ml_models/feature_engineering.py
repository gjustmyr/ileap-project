"""
STEP 2: Feature Engineering

Extract numerical features from student profiles and job postings for ML models.

Features:
1. Skills overlap (Jaccard similarity and count)
2. Industry/role match (binary)
3. Text similarity (TF-IDF cosine similarity)
4. Posting type (internship vs job_placement)
"""

import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def jaccard_similarity(set1, set2):
    """Calculate Jaccard similarity between two sets"""
    if not set1 or not set2:
        return 0.0
    
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    
    return intersection / union if union > 0 else 0.0


def extract_features(row):
    """
    Extract numerical features from a single row
    
    Returns a dictionary of features
    """
    features = {}
    
    # Parse skills from JSON strings
    try:
        student_skills = set(json.loads(row['student_skills'])) if row['student_skills'] else set()
        internship_skills = set(json.loads(row['internship_skills'])) if row['internship_skills'] else set()
    except:
        student_skills = set()
        internship_skills = set()
    
    # Normalize to lowercase for better matching
    student_skills = {s.lower() for s in student_skills}
    internship_skills = {s.lower() for s in internship_skills}
    
    # Feature 1: Skills overlap (Jaccard similarity)
    features['skills_jaccard'] = jaccard_similarity(student_skills, internship_skills)
    
    # Feature 2: Skills match count
    features['skills_match_count'] = len(student_skills.intersection(internship_skills))
    
    # Feature 3: Skills required count
    features['skills_required_count'] = len(internship_skills)
    
    # Feature 4: Skills coverage (what % of required skills does student have?)
    if len(internship_skills) > 0:
        features['skills_coverage'] = len(student_skills.intersection(internship_skills)) / len(internship_skills)
    else:
        features['skills_coverage'] = 0.0
    
    # Feature 5: Posting type (1 = job_placement, 0 = internship)
    features['is_job_placement'] = 1 if row['internship_type'] == 'job_placement' else 0
    
    # Feature 6: Program/Department relevance (simple keyword matching)
    student_program = str(row.get('student_program', '')).lower()
    student_major = str(row.get('student_major', '')).lower()
    student_department = str(row.get('student_department', '')).lower()
    
    internship_title = str(row.get('internship_title', '')).lower()
    internship_description = str(row.get('internship_description', '')).lower()
    industry_name = str(row.get('industry_name', '')).lower()
    
    # Check if student's program/major appears in job title or description
    program_in_title = 1 if (student_program and student_program in internship_title) else 0
    program_in_description = 1 if (student_program and student_program in internship_description) else 0
    major_in_title = 1 if (student_major and student_major in internship_title) else 0
    major_in_description = 1 if (student_major and student_major in internship_description) else 0
    
    features['program_match'] = program_in_title + program_in_description
    features['major_match'] = major_in_title + major_in_description
    
    return features


def extract_text_features(df, max_features=100):
    """
    Extract TF-IDF features from text fields
    
    Returns a DataFrame with TF-IDF cosine similarity scores
    """
    # Combine text fields for student and internship
    student_texts = []
    internship_texts = []
    
    for idx, row in df.iterrows():
        # Student text: skills + program + major + about
        try:
            student_skills = json.loads(row['student_skills']) if row['student_skills'] else []
        except:
            student_skills = []
        
        student_text = " ".join([
            " ".join(student_skills),
            str(row.get('student_program', '')),
            str(row.get('student_major', '')),
            str(row.get('student_department', '')),
            str(row.get('student_about', ''))[:200]  # Limit about text
        ])
        student_texts.append(student_text)
        
        # Internship text: title + description + skills
        try:
            internship_skills = json.loads(row['internship_skills']) if row['internship_skills'] else []
        except:
            internship_skills = []
        
        internship_text = " ".join([
            str(row.get('internship_title', '')),
            str(row.get('internship_description', ''))[:500],  # Limit description
            " ".join(internship_skills),
            str(row.get('industry_name', ''))
        ])
        internship_texts.append(internship_text)
    
    # Calculate TF-IDF cosine similarity for each pair
    print(f"Calculating TF-IDF cosine similarities for {len(df)} pairs...")
    
    cosine_similarities = []
    
    # Use a single vectorizer for all pairs to ensure consistent vocabulary
    all_texts = student_texts + internship_texts
    vectorizer = TfidfVectorizer(max_features=max_features, stop_words='english', lowercase=True)
    
    try:
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        
        # Calculate cosine similarity for each pair
        for i in range(len(student_texts)):
            student_vec = tfidf_matrix[i:i+1]
            internship_vec = tfidf_matrix[len(student_texts) + i:len(student_texts) + i + 1]
            similarity = cosine_similarity(student_vec, internship_vec)[0][0]
            cosine_similarities.append(similarity)
    
    except Exception as e:
        print(f"Warning: TF-IDF calculation failed: {e}")
        cosine_similarities = [0.0] * len(df)
    
    return cosine_similarities


def build_feature_matrix(df):
    """
    Build complete feature matrix for training
    
    Returns:
    - X: Feature matrix (numpy array)
    - y: Labels (numpy array)
    - feature_names: List of feature names
    """
    print("\n" + "="*60)
    print("FEATURE ENGINEERING")
    print("="*60)
    
    # Extract basic features for each row
    print("Extracting basic features...")
    features_list = []
    for idx, row in df.iterrows():
        features = extract_features(row)
        features_list.append(features)
    
    # Convert to DataFrame for easier manipulation
    import pandas as pd
    features_df = pd.DataFrame(features_list)
    
    print(f"✓ Extracted {len(features_df.columns)} basic features")
    print(f"  Features: {list(features_df.columns)}")
    
    # Extract text-based features (TF-IDF cosine similarity)
    print("\nExtracting text features (TF-IDF)...")
    cosine_sims = extract_text_features(df)
    features_df['text_cosine_similarity'] = cosine_sims
    
    print(f"✓ Added text cosine similarity feature")
    
    # Final feature matrix
    X = features_df.values
    y = df['label'].values
    feature_names = list(features_df.columns)
    
    print("\n" + "="*60)
    print("FEATURE MATRIX SUMMARY")
    print("="*60)
    print(f"Shape: {X.shape}")
    print(f"Features: {feature_names}")
    print(f"Labels: {len(y)} (Positive: {sum(y)}, Negative: {len(y) - sum(y)})")
    print("\nFeature statistics:")
    print(features_df.describe())
    
    return X, y, feature_names


if __name__ == "__main__":
    # Test with sample data
    import pandas as pd
    
    # Load training data
    try:
        df = pd.read_csv("ml_models/training_data.csv")
        print(f"Loaded {len(df)} training examples")
        
        # Build feature matrix
        X, y, feature_names = build_feature_matrix(df)
        
        print("\n✓ Feature engineering complete!")
        print(f"Ready for model training with {X.shape[0]} examples and {X.shape[1]} features")
        
    except FileNotFoundError:
        print("Error: training_data.csv not found. Run collect_training_data.py first.")
