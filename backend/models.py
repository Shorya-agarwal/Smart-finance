from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    # Relationship updated
    applications = relationship("JobApplication", back_populates="recypient")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String)
    role_applied = Column(String)  # e.g., "Software Engineer"
    
    # We store the raw text to allow re-indexing later if needed
    resume_text = Column(Text)
    job_description = Column(Text)
    
    # This is the "Magic Number" our AI calculates
    match_score = Column(Float)  # 0.0 to 100.0
    
    status = Column(String, default="Pending") # Pending, Interview, Rejected
    date_applied = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    recypient = relationship("User", back_populates="applications")