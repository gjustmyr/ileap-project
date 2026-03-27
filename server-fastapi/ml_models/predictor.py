"""
STEP 4: Model Prediction Helper

Load trained model and make predictions on new student-internship pairs.
"""

import joblib
import json
import numpy as np
import os
from pathlib import Path


class MatchingModelPredictor:
    """Helper class for loading and using trained matching model"""
    
    def __init__(self, model_path="ml_models/best_model_latest.pkl"):
        """
        Initialize predictor with trained model
        
        Args:
            model_path: Path to saved model file
        """
        self.model = None
        self.feature_names = None
        self.metadata = None
        
        # Get absolute path
        base_dir = Path(__file__).parent.parent
        full_model_path = base_dir / model_path
        metadata_path = full_model_path.with_name(full_model_path.stem + "_metadata.json")
        
        # Load model
        try:
            self.model = joblib.load(full_model_path)
            print(f"✓ Model loaded from: {full_model_path}")
        except FileNotFoundError:
            print(f"❌ Model not found at: {full_model_path}")
            print("Run train_model.py first to train the model!")
            raise
        
        # Load metadata
        try:
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
                self.feature_names = self.metadata.get('feature_names', [])
            print(f"✓ Metadata loaded: {len(self.feature_names)} features")
        except FileNotFoundError:
            print(f"⚠ Metadata not found. Using default feature names.")
            self.feature_names = []
    
    
    def extract_features_from_data(self, student_data, internship_data):
        """
        Extract features from student and internship data
        
        Args:
            student_data: dict with keys: skills, program, major, department, about
            internship_data: dict with keys: skills, title, description, posting_type, industry
        
        Returns:
            Feature dictionary
        """
        features = {}
        
        # Parse skills
        student_skills = set(student_data.get('skills', []))
        internship_skills = set(internship_data.get('skills', []))
        
        # Normalize to lowercase
        student_skills = {s.lower() for s in student_skills if s}
        internship_skills = {s.lower() for s in internship_skills if s}
        
        # Feature 1: Skills Jaccard similarity
        if student_skills or internship_skills:
            intersection = len(student_skills.intersection(internship_skills))
            union = len(student_skills.union(internship_skills))
            features['skills_jaccard'] = intersection / union if union > 0 else 0.0
        else:
            features['skills_jaccard'] = 0.0
        
        # Feature 2: Skills match count
        features['skills_match_count'] = len(student_skills.intersection(internship_skills))
        
        # Feature 3: Skills required count
        features['skills_required_count'] = len(internship_skills)
        
        # Feature 4: Skills coverage
        if len(internship_skills) > 0:
            features['skills_coverage'] = len(student_skills.intersection(internship_skills)) / len(internship_skills)
        else:
            features['skills_coverage'] = 0.0
        
        # Feature 5: Posting type
        features['is_job_placement'] = 1 if internship_data.get('posting_type') == 'job_placement' else 0
        
        # Feature 6: Program/major relevance
        student_program = str(student_data.get('program', '')).lower()
        student_major = str(student_data.get('major', '')).lower()
        
        internship_title = str(internship_data.get('title', '')).lower()
        internship_description = str(internship_data.get('description', ''))[:500].lower()
        
        program_in_title = 1 if (student_program and student_program in internship_title) else 0
        program_in_description = 1 if (student_program and student_program in internship_description) else 0
        major_in_title = 1 if (student_major and student_major in internship_title) else 0
        major_in_description = 1 if (student_major and student_major in internship_description) else 0
        
        features['program_match'] = program_in_title + program_in_description
        features['major_match'] = major_in_title + major_in_description
        
        # Feature 7: Text cosine similarity (TF-IDF)
        features['text_cosine_similarity'] = self._calculate_text_similarity(student_data, internship_data)
        
        return features
    
    
    def _calculate_text_similarity(self, student_data, internship_data):
        """
        Calculate TF-IDF cosine similarity between student profile and job posting
        
        This is a simplified version for prediction (not using pre-fitted vectorizer)
        """
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            
            # Build student text
            student_text = " ".join([
                " ".join(student_data.get('skills', [])),
                str(student_data.get('program', '')),
                str(student_data.get('major', '')),
                str(student_data.get('department', '')),
                str(student_data.get('about', ''))[:200]
            ])
            
            # Build internship text
            internship_text = " ".join([
                str(internship_data.get('title', '')),
                str(internship_data.get('description', ''))[:500],
                " ".join(internship_data.get('skills', [])),
                str(internship_data.get('industry', ''))
            ])
            
            # Calculate similarity
            vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
            tfidf_matrix = vectorizer.fit_transform([student_text, internship_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            return similarity
        
        except Exception as e:
            print(f"Warning: Text similarity calculation failed: {e}")
            return 0.0
    
    
    def predict(self, student_data, internship_data):
        """
        Predict match score for a student-internship pair
        
        Args:
            student_data: dict with student information
            internship_data: dict with internship information
        
        Returns:
            dict with:
                - match_score: probability of being a good match (0-1)
                - match_label: "Strong Match", "Good Match", "Weak Match", "Poor Match"
                - is_recommended: boolean
                - feature_values: dict of extracted features
        """
        if self.model is None:
            raise ValueError("Model not loaded. Initialize predictor first.")
        
        # Extract features
        features = self.extract_features_from_data(student_data, internship_data)
        
        # Convert to numpy array in correct order
        feature_vector = np.array([features.get(name, 0.0) for name in self.feature_names]).reshape(1, -1)
        
        # Predict
        match_probability = self.model.predict_proba(feature_vector)[0][1]
        
        # Determine match label
        if match_probability >= 0.7:
            match_label = "Strong Match"
            is_recommended = True
        elif match_probability >= 0.5:
            match_label = "Good Match"
            is_recommended = True
        elif match_probability >= 0.3:
            match_label = "Weak Match"
            is_recommended = False
        else:
            match_label = "Poor Match"
            is_recommended = False
        
        return {
            'match_score': float(match_probability),
            'match_label': match_label,
            'is_recommended': is_recommended,
            'feature_values': features
        }
    
    
    def predict_batch(self, student_data, internship_list):
        """
        Predict match scores for one student with multiple internships
        
        Args:
            student_data: dict with student information
            internship_list: list of internship dicts
        
        Returns:
            list of prediction results
        """
        results = []
        for internship_data in internship_list:
            try:
                prediction = self.predict(student_data, internship_data)
                prediction['internship_id'] = internship_data.get('internship_id')
                results.append(prediction)
            except Exception as e:
                print(f"Error predicting for internship {internship_data.get('internship_id')}: {e}")
                continue
        
        # Sort by match score (descending)
        results.sort(key=lambda x: x['match_score'], reverse=True)
        
        return results


# Global predictor instance (singleton pattern)
_predictor_instance = None


def get_predictor():
    """Get or create global predictor instance"""
    global _predictor_instance
    
    if _predictor_instance is None:
        try:
            _predictor_instance = MatchingModelPredictor()
        except Exception as e:
            print(f"Warning: Could not load matching model: {e}")
            _predictor_instance = None
    
    return _predictor_instance


if __name__ == "__main__":
    # Test predictor
    print("Testing MatchingModelPredictor...\n")
    
    try:
        predictor = MatchingModelPredictor()
        
        # Sample data
        student = {
            'skills': ['Python', 'JavaScript', 'React'],
            'program': 'Computer Science',
            'major': 'Software Engineering',
            'department': 'College of Engineering',
            'about': 'Passionate about web development and AI'
        }
        
        internship = {
            'skills': ['Python', 'React', 'Node.js'],
            'title': 'Software Engineering Intern',
            'description': 'Looking for a computer science student with web development experience',
            'posting_type': 'internship',
            'industry': 'Technology'
        }
        
        result = predictor.predict(student, internship)
        
        print("Prediction Result:")
        print(f"  Match Score: {result['match_score']:.2%}")
        print(f"  Match Label: {result['match_label']}")
        print(f"  Recommended: {result['is_recommended']}")
        print(f"\nFeature Values:")
        for feature, value in result['feature_values'].items():
            print(f"  {feature}: {value:.4f}")
        
    except Exception as e:
        print(f"Error: {e}")
        print("\nMake sure you've trained the model first by running:")
        print("  python ml_models/train_model.py")
