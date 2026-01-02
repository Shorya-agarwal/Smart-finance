from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import models
from database import engine, get_db
from matching_service import calculate_match_score # <-- New Import

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DTOs (Data Transfer Objects) ---
class ApplicationCreate(BaseModel):
    candidate_name: str
    role_applied: str
    resume_text: str
    job_description: str
    user_id: int

class ApplicationResponse(BaseModel):
    id: int
    candidate_name: str
    role_applied: str
    match_score: float
    status: str
    
    class Config:
        from_attributes = True # Updated for Pydantic v2

@app.post("/applications/", response_model=ApplicationResponse)
def create_application(app_data: ApplicationCreate, db: Session = Depends(get_db)):
    # 1. Run the AI Match Logic locally
    score = calculate_match_score(app_data.resume_text, app_data.job_description)
    
    # 2. Save to Database
    new_app = models.JobApplication(
        candidate_name=app_data.candidate_name,
        role_applied=app_data.role_applied,
        resume_text=app_data.resume_text,
        job_description=app_data.job_description,
        match_score=score,
        user_id=app_data.user_id
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@app.get("/applications/", response_model=List[ApplicationResponse])
def get_applications(db: Session = Depends(get_db)):
    # Return highest match scores first
    return db.query(models.JobApplication).order_by(models.JobApplication.match_score.desc()).all()