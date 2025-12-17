from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    # Relationship: One user has many transactions
    transactions = relationship("Transaction", back_populates="owner")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)  # Financial value
    category = Column(String)  # e.g., "Food", "Rent"
    description = Column(String)
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Link to the User table
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship: A transaction belongs to one owner
    owner = relationship("User", back_populates="transactions")