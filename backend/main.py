from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # <--- NEW IMPORT
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import models
from database import engine, get_db
from ai_service import categorize_expense
from alert_service import check_and_alert

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS CONFIGURATION (THE FIX) ---
origins = [
    "http://localhost:5173", # Your React App
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],
)
# ------------------------------------

# Pydantic Models
class TransactionCreate(BaseModel):
    description: str
    amount: float
    user_id: int

from datetime import datetime
class TransactionResponse(BaseModel):
    id: int
    description: str
    amount: float
    category: str
    date: Optional[datetime] = None # Pydantic will handle datetime conversion

    class Config:
        orm_mode = True

class AlertThresholdCreate(BaseModel):
    category: str
    amount_limit: float
    window: str = "TRANSACTION"
    user_id: int

class AlertThresholdResponse(BaseModel):
    id: int
    category: str
    amount_limit: float
    window: str
    user_id: int

    class Config:
        orm_mode = True

class TransactionWithAlerts(BaseModel):
    transaction: TransactionResponse
    alerts: List[str]

    class Config:
        orm_mode = True

@app.get("/")
def read_root():
    return {"message": "SmartFinance Backend is Running"}

@app.post("/transactions/", response_model=TransactionWithAlerts)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    # 1. AI Categorization
    ai_category = categorize_expense(transaction.description)
    
    # 2. Save to DB
    db_transaction = models.Transaction(
        description=transaction.description,
        amount=transaction.amount,
        category=ai_category,
        user_id=transaction.user_id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    # 3. Check for Alerts
    alerts = check_and_alert(db_transaction, db)

    return {"transaction": db_transaction, "alerts": alerts}

@app.get("/transactions/")
def read_transactions(db: Session = Depends(get_db)):
    # Get all transactions, newest first
    return db.query(models.Transaction).order_by(models.Transaction.id.desc()).all()

@app.post("/alerts/")
def create_alert_threshold(alert: AlertThresholdCreate, db: Session = Depends(get_db)):
    # Check if exists
    existing_alert = db.query(models.AlertThreshold).filter(
        models.AlertThreshold.user_id == alert.user_id,
        models.AlertThreshold.category == alert.category,
        models.AlertThreshold.window == alert.window
    ).first()

    if existing_alert:
        # Update existing
        existing_alert.amount_limit = alert.amount_limit
        db.commit()
        db.refresh(existing_alert)
        return existing_alert

    db_alert = models.AlertThreshold(
        category=alert.category,
        amount_limit=alert.amount_limit,
        window=alert.window,
        user_id=alert.user_id
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

@app.get("/alerts/", response_model=List[AlertThresholdResponse])
def read_alerts(db: Session = Depends(get_db)):
    return db.query(models.AlertThreshold).all()