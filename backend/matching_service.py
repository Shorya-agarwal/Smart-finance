from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_match_score(resume_text: str, job_desc_text: str) -> float:
    """
    Uses TF-IDF (Term Frequency-Inverse Document Frequency) to vectorize text
    and calculates the cosine similarity between the resume and job description.
    """
    try:
        # 1. Create a corpus of the two documents
        documents = [resume_text, job_desc_text]
        
        # 2. Convert text to vectors (removing stop words like 'the', 'and')
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        # 3. Calculate Cosine Similarity (Result is a matrix)
        # [0, 1] compares Doc 0 (Resume) with Doc 1 (JD)
        match_percentage = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        # 4. Convert to readable score (0-100)
        return round(match_percentage * 100, 2)
        
    except Exception as e:
        print(f"Error calculating score: {e}")
        return 0.0