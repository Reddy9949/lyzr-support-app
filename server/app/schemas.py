from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class StatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class SupportRequestBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    priority: Optional[PriorityEnum] = PriorityEnum.medium

class SupportRequestCreate(SupportRequestBase):
    pass

class SupportRequestUpdate(BaseModel):
    subject: Optional[str] = None
    message: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None

class SupportRequest(SupportRequestBase):
    id: int
    status: StatusEnum
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SupportResponse(BaseModel):
    id: str
    status: str
    message: str 