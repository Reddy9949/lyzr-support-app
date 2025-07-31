from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import uvicorn
from dotenv import load_dotenv
import os
import httpx
import json
from datetime import datetime
from services.lyzr_api import lyzr_service

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Lyzr Support API",
    description="API for Lyzr Support Application with Agent Management",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SupportRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    priority: Optional[str] = "medium"

class SupportResponse(BaseModel):
    id: str
    status: str
    message: str

class AgentCreate(BaseModel):
    name: str
    description: str
    tone: str
    personality: str
    knowledge_base: List[str]
    user_id: str

class AgentResponse(BaseModel):
    id: str
    name: str
    description: str
    tone: str
    personality: str
    knowledge_base: List[str]
    lyzr_agent_id: Optional[str]
    user_id: str
    is_active: bool
    created_at: str
    updated_at: str

class ChatMessage(BaseModel):
    agent_id: str
    message: str
    user_session: str

class ChatResponse(BaseModel):
    response: str
    confidence_score: float
    ticket_created: bool

class TicketCreate(BaseModel):
    agent_id: str
    question: str
    user_session: str
    confidence_score: Optional[float]

class AnalyticsResponse(BaseModel):
    agent_id: str
    total_conversations: int
    average_confidence: float
    tickets_created: int
    user_satisfaction: float
    response_time_avg: float

# In-memory storage (replace with database in production)
support_requests = []
agents = []
tickets = []
chat_sessions = []

@app.get("/")
async def root():
    return {"message": "Lyzr Support API is running", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "lyzr-support-api", "version": "2.0.0"}

# Agent Management Endpoints
@app.post("/api/agents", response_model=AgentResponse)
async def create_agent(agent_data: AgentCreate):
    """Create a new agent"""
    try:
        # Create Lyzr agent
        lyzr_agent = await lyzr_service.create_agent({
            "name": agent_data.name,
            "description": agent_data.description,
            "tone": agent_data.tone,
            "personality": agent_data.personality,
            "knowledge_base": agent_data.knowledge_base,
        })
        
        # Generate local agent ID
        agent_id = f"agent_{len(agents) + 1:04d}"
        
        # Store agent data
        agent = {
            "id": agent_id,
            "name": agent_data.name,
            "description": agent_data.description,
            "tone": agent_data.tone,
            "personality": agent_data.personality,
            "knowledge_base": agent_data.knowledge_base,
            "lyzr_agent_id": lyzr_agent.get("id"),
            "user_id": agent_data.user_id,
            "is_active": True,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }
        agents.append(agent)
        
        return AgentResponse(**agent)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents", response_model=List[AgentResponse])
async def get_agents(user_id: Optional[str] = None):
    """Get all agents, optionally filtered by user_id"""
    if user_id:
        user_agents = [agent for agent in agents if agent["user_id"] == user_id]
        return [AgentResponse(**agent) for agent in user_agents]
    return [AgentResponse(**agent) for agent in agents]

@app.get("/api/agents/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str):
    """Get a specific agent"""
    for agent in agents:
        if agent["id"] == agent_id:
            return AgentResponse(**agent)
    raise HTTPException(status_code=404, detail="Agent not found")

@app.put("/api/agents/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: str, agent_data: AgentCreate):
    """Update an agent"""
    for i, agent in enumerate(agents):
        if agent["id"] == agent_id:
            # Update Lyzr agent
            lyzr_agent = await lyzr_service.update_agent(
                agent["lyzr_agent_id"] or agent_id,
                {
                    "name": agent_data.name,
                    "description": agent_data.description,
                    "tone": agent_data.tone,
                    "personality": agent_data.personality,
                    "knowledge_base": agent_data.knowledge_base,
                }
            )
            
            # Update local agent
            agents[i].update({
                "name": agent_data.name,
                "description": agent_data.description,
                "tone": agent_data.tone,
                "personality": agent_data.personality,
                "knowledge_base": agent_data.knowledge_base,
                "lyzr_agent_id": lyzr_agent.get("id"),
                "updated_at": datetime.now().isoformat(),
            })
            return AgentResponse(**agents[i])
    raise HTTPException(status_code=404, detail="Agent not found")

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Delete an agent"""
    for i, agent in enumerate(agents):
        if agent["id"] == agent_id:
            # Delete from Lyzr
            if agent["lyzr_agent_id"]:
                await lyzr_service.delete_agent(agent["lyzr_agent_id"])
            
            # Remove from local storage
            agents.pop(i)
            return {"message": "Agent deleted successfully"}
    raise HTTPException(status_code=404, detail="Agent not found")

# Chat Endpoints
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_agent(chat_data: ChatMessage):
    """Send a message to an agent"""
    try:
        # Find the agent
        agent = None
        for a in agents:
            if a["id"] == chat_data.agent_id:
                agent = a
                break
        
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        if not agent["is_active"]:
            raise HTTPException(status_code=400, detail="Agent is not active")
        
        # Chat with Lyzr agent
        lyzr_response = await lyzr_service.chat_with_agent(
            agent["lyzr_agent_id"] or chat_data.agent_id,
            chat_data.message
        )
        
        # Log chat session
        chat_session = {
            "id": f"chat_{len(chat_sessions) + 1:04d}",
            "agent_id": chat_data.agent_id,
            "user_session": chat_data.user_session,
            "message": chat_data.message,
            "response": lyzr_response["response"],
            "confidence_score": lyzr_response.get("confidence_score", 0.0),
            "created_at": datetime.now().isoformat(),
        }
        chat_sessions.append(chat_session)
        
        # Create ticket if confidence is low
        ticket_created = False
        if lyzr_response.get("confidence_score", 1.0) < 0.7:
            ticket = {
                "id": f"ticket_{len(tickets) + 1:04d}",
                "agent_id": chat_data.agent_id,
                "question": chat_data.message,
                "user_session": chat_data.user_session,
                "status": "open",
                "confidence_score": lyzr_response.get("confidence_score", 0.0),
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
            }
            tickets.append(ticket)
            ticket_created = True
        
        return ChatResponse(
            response=lyzr_response["response"],
            confidence_score=lyzr_response.get("confidence_score", 0.0),
            ticket_created=ticket_created
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics Endpoints
@app.get("/api/agents/{agent_id}/analytics", response_model=AnalyticsResponse)
async def get_agent_analytics(agent_id: str):
    """Get analytics for a specific agent"""
    try:
        # Find the agent
        agent = None
        for a in agents:
            if a["id"] == agent_id:
                agent = a
                break
        
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # Get analytics from Lyzr
        analytics = await lyzr_service.get_agent_analytics(
            agent["lyzr_agent_id"] or agent_id
        )
        
        return AnalyticsResponse(**analytics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/overview")
async def get_overview_analytics():
    """Get overview analytics for all agents"""
    try:
        total_agents = len(agents)
        total_chats = len(chat_sessions)
        total_tickets = len(tickets)
        open_tickets = len([t for t in tickets if t["status"] == "open"])
        
        # Calculate average confidence
        if chat_sessions:
            avg_confidence = sum(cs.get("confidence_score", 0) for cs in chat_sessions) / len(chat_sessions)
        else:
            avg_confidence = 0.0
        
        return {
            "total_agents": total_agents,
            "total_chats": total_chats,
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "average_confidence": round(avg_confidence, 2),
            "active_agents": len([a for a in agents if a["is_active"]])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ticket Management Endpoints
@app.post("/api/tickets")
async def create_ticket(ticket_data: TicketCreate):
    """Create a new ticket"""
    try:
        ticket = {
            "id": f"ticket_{len(tickets) + 1:04d}",
            "agent_id": ticket_data.agent_id,
            "question": ticket_data.question,
            "user_session": ticket_data.user_session,
            "status": "open",
            "confidence_score": ticket_data.confidence_score,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }
        tickets.append(ticket)
        return ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tickets")
async def get_tickets(agent_id: Optional[str] = None, status: Optional[str] = None):
    """Get all tickets, optionally filtered"""
    filtered_tickets = tickets
    
    if agent_id:
        filtered_tickets = [t for t in filtered_tickets if t["agent_id"] == agent_id]
    
    if status:
        filtered_tickets = [t for t in filtered_tickets if t["status"] == status]
    
    return filtered_tickets

@app.put("/api/tickets/{ticket_id}")
async def update_ticket(ticket_id: str, status: str, manual_response: Optional[str] = None):
    """Update a ticket"""
    for i, ticket in enumerate(tickets):
        if ticket["id"] == ticket_id:
            tickets[i].update({
                "status": status,
                "manual_response": manual_response,
                "updated_at": datetime.now().isoformat(),
            })
            return tickets[i]
    raise HTTPException(status_code=404, detail="Ticket not found")

# Legacy Support Endpoints (for backward compatibility)
@app.post("/api/support", response_model=SupportResponse)
async def create_support_request(request: SupportRequest):
    """Create a new support request"""
    try:
        request_id = f"SR-{len(support_requests) + 1:04d}"
        support_request = {
            "id": request_id,
            "name": request.name,
            "email": request.email,
            "subject": request.subject,
            "message": request.message,
            "priority": request.priority,
            "status": "pending"
        }
        support_requests.append(support_request)
        
        return SupportResponse(
            id=request_id,
            status="success",
            message="Support request created successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/support", response_model=List[dict])
async def get_support_requests():
    """Get all support requests"""
    return support_requests

@app.get("/api/support/{request_id}")
async def get_support_request(request_id: str):
    """Get a specific support request"""
    for request in support_requests:
        if request["id"] == request_id:
            return request
    raise HTTPException(status_code=404, detail="Support request not found")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 