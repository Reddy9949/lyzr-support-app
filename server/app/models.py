from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import enum

Base = declarative_base()

class PriorityEnum(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class StatusEnum(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class SupportRequest(Base):
    __tablename__ = "support_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.medium)
    status = Column(Enum(StatusEnum), default=StatusEnum.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 