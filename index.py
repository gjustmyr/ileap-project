# ============================================================
# 🚀 Job Applicant Matching System | AI-Powered Skill Matching
# ============================================================

# ── Step 1: Import Libraries ─────────────────────────────────
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings('ignore')

# ── Step 2: Load Dataset ─────────────────────────────────────
df = pd.read_csv("datasets.csv")

# ── Step 3: Prepare Data ──────────────────────────────────────
# Clean and prepare the dataset
df['Resume'] = df['Resume'].fillna('')
df['Job Roles'] = df['Job Roles'].fillna('')
df['Job Description'] = df['Job Description'].fillna('')

# ── Step 4: Build Hybrid Text Field ──────────────────────────
# Combine resume, job roles, and job description for matching
df['hybrid_text'] = (
    df['Resume'] + ' ' +
    df['Job Roles'] + ' ' +
    df['Job Description']
)

sampled_df = df  # Use full dataset

# ── Step 6: TF-IDF Similarity Matrix ─────────────────────────
hybrid_vectorizer = TfidfVectorizer(stop_words='english')
hybrid_matrix     = hybrid_vectorizer.fit_transform(sampled_df['hybrid_text'])
hybrid_sim_matrix = cosine_similarity(hybrid_matrix, hybrid_matrix)

# ── Step 7: Count Vectorizer Similarity Matrix ───────────────
alt_vectorizer = CountVectorizer()
alt_matrix     = alt_vectorizer.fit_transform(sampled_df['hybrid_text'])
alt_sim_matrix = cosine_similarity(alt_matrix, alt_matrix)

# ── Step 8: Core Recommendation Functions ────────────────────
def recommend_by_hybrid(applicant_index, top_n=5, method='tfidf'):
    sim_matrix  = hybrid_sim_matrix if method == 'tfidf' else alt_sim_matrix
    sim_scores  = sorted(enumerate(sim_matrix[applicant_index]), key=lambda x: x[1], reverse=True)
    top_matches = sim_scores[1:top_n + 1]

    print(f"Applicants similar to: {sampled_df.iloc[applicant_index]['Job Applicant Name']} ({method}-based)\n")
    for idx, score in top_matches:
        print(f"Name:       {sampled_df.iloc[idx]['Job Applicant Name']}")
        print(f"Age:        {sampled_df.iloc[idx]['Age']}")
        print(f"Job Role:   {sampled_df.iloc[idx]['Job Roles']}")
        print(f"Resume:     {sampled_df.iloc[idx]['Resume'][:100]}...")
        print(f"Similarity: {score:.4f}\n")


def recommend_by_job_role(role_keyword, top_n=5, method='tfidf'):
    matches = sampled_df[sampled_df['Job Roles'].str.lower().str.contains(role_keyword.lower())]
    if matches.empty:
        print("No matching job role found.")
        return
    applicant_index = matches.index[0]
    print(f"Found match: {sampled_df.iloc[applicant_index]['Job Applicant Name']} - {sampled_df.iloc[applicant_index]['Job Roles']} (Index: {applicant_index})\n")
    recommend_by_hybrid(applicant_index, top_n, method)


# ── Step 9: Filtered Recommendation Functions ────────────────
def recommend_with_filters(applicant_index, top_n=5, method='tfidf',
                            gender=None, age_range=None, job_role=None):
    sim_matrix   = hybrid_sim_matrix if method == 'tfidf' else alt_sim_matrix
    sim_scores   = sorted(enumerate(sim_matrix[applicant_index]), key=lambda x: x[1], reverse=True)
    filtered_applicants = []

    for idx, score in sim_scores[1:]:
        row = sampled_df.iloc[idx]
        if gender and gender.lower() not in str(row['Gender']).lower():
            continue
        if age_range:
            min_age, max_age = age_range
            if not (min_age <= row['Age'] <= max_age):
                continue
        if job_role and job_role.lower() not in str(row['Job Roles']).lower():
            continue
        filtered_applicants.append((idx, score))
        if len(filtered_applicants) == top_n:
            break

    if not filtered_applicants:
        print("No applicants found matching your filters.")
        return

    print(f"Applicants similar to: {sampled_df.iloc[applicant_index]['Job Applicant Name']} ({method}-based) with filters\n")
    for idx, score in filtered_applicants:
        print(f"Name:       {sampled_df.iloc[idx]['Job Applicant Name']}")
        print(f"Age:        {sampled_df.iloc[idx]['Age']}")
        print(f"Gender:     {sampled_df.iloc[idx]['Gender']}")
        print(f"Job Role:   {sampled_df.iloc[idx]['Job Roles']}")
        print(f"Resume:     {sampled_df.iloc[idx]['Resume'][:100]}...")
        print(f"Similarity: {score:.4f}\n")


def recommend_with_filters_by_role(job_role, top_n=5, method='tfidf',
                                     gender=None, age_range=None, filter_role=None):
    matches = sampled_df[sampled_df['Job Roles'].str.lower().str.contains(job_role.lower())]
    if matches.empty:
        print("No matching job role found.")
        return
    applicant_index = matches.index[0]
    print(f"Found match: {sampled_df.iloc[applicant_index]['Job Applicant Name']} (Index: {applicant_index})\n")
    recommend_with_filters(applicant_index, top_n, method, gender, age_range, filter_role)


# ── Step 10: Export Recommendations ──────────────────────────
def save_recommendations_to_csv(applicant_index, top_n=5, method='tfidf',
                                  filename='recommended_applicants.csv'):
    sim_matrix = hybrid_sim_matrix if method == 'tfidf' else alt_sim_matrix
    sim_scores = sorted(enumerate(sim_matrix[applicant_index]), key=lambda x: x[1], reverse=True)
    top_matches = sim_scores[1:top_n + 1]

    recs = [{
        'Name':             sampled_df.iloc[idx]['Job Applicant Name'],
        'Age':              sampled_df.iloc[idx]['Age'],
        'Gender':           sampled_df.iloc[idx]['Gender'],
        'Job Role':         sampled_df.iloc[idx]['Job Roles'],
        'Resume':           sampled_df.iloc[idx]['Resume'],
        'Similarity Score': round(score, 4)
    } for idx, score in top_matches]

    pd.DataFrame(recs).to_csv(filename, index=False)
    print(f"Top {top_n} recommendations saved to {filename}")


# ── Step 11: BERT Semantic Recommender ───────────────────────
from sentence_transformers import SentenceTransformer

bert_model       = SentenceTransformer('all-MiniLM-L6-v2')
bert_embeddings  = bert_model.encode(sampled_df['hybrid_text'].tolist(), show_progress_bar=True)
bert_sim_matrix  = cosine_similarity(bert_embeddings, bert_embeddings)


def recommend_by_bert(applicant_index, top_n=5):
    sim_scores = sorted(enumerate(bert_sim_matrix[applicant_index]), key=lambda x: x[1], reverse=True)
    top_matches = sim_scores[1:top_n + 1]

    print(f"Applicants similar to: {sampled_df.iloc[applicant_index]['Job Applicant Name']} (BERT-based)\n")
    for idx, score in top_matches:
        print(f"Name:       {sampled_df.iloc[idx]['Job Applicant Name']}")
        print(f"Age:        {sampled_df.iloc[idx]['Age']}")
        print(f"Job Role:   {sampled_df.iloc[idx]['Job Roles']}")
        print(f"Resume:     {sampled_df.iloc[idx]['Resume'][:100]}...")
        print(f"Similarity: {score:.4f}\n")


def recommend_by_bert_role(role_keyword, top_n=5):
    matches = sampled_df[sampled_df['Job Roles'].str.lower().str.contains(role_keyword.lower())]
    if matches.empty:
        print("No matching job role found.")
        return
    applicant_index = matches.index[0]
    print(f"Found match: {sampled_df.iloc[applicant_index]['Job Applicant Name']} (Index: {applicant_index})\n")
    recommend_by_bert(applicant_index, top_n)


# ── Step 12: Demo Calls ───────────────────────────────────────
print("=" * 60)
print("Job Applicant Matching System")
print("=" * 60)

# Example 1: Find similar applicants to a Software Engineer
recommend_by_job_role("Software Engineer", top_n=5, method='tfidf')

# Example 2: Find similar applicants using Count Vectorizer
recommend_by_job_role("Data Analyst", top_n=5, method='count')

# Example 3: Find similar applicants with filters
recommend_with_filters_by_role(
    job_role="Manager", top_n=5, method='tfidf',
    gender="Female", age_range=(30, 50)
)

# Example 4: BERT-based recommendations
recommend_by_bert_role("Cybersecurity Analyst", top_n=5)

# Example 5: Save recommendations to CSV
# save_recommendations_to_csv(0, top_n=5, method='tfidf')
