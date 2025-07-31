import httpx
import os
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
import json

class LyzrAPIService:
    def __init__(self):
        self.api_key = os.getenv("LYZR_API_KEY")
        self.base_url = os.getenv("LYZR_API_URL", "https://api.lyzr.ai")
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            } if self.api_key else {}
        )

    async def create_agent(self, agent_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new Lyzr agent"""
        if not self.api_key:
            # Mock response for development
            return {
                "id": f"lyzr_agent_{hash(agent_data['name']) % 10000}",
                "status": "created",
                "name": agent_data["name"],
                "description": agent_data["description"]
            }

        try:
            response = await self.client.post(
                f"{self.base_url}/agents",
                json={
                    "name": agent_data["name"],
                    "description": agent_data["description"],
                    "tone": agent_data["tone"],
                    "personality": agent_data["personality"],
                    "knowledge_base": agent_data["knowledge_base"],
                    "settings": {
                        "temperature": 0.7,
                        "max_tokens": 1000,
                        "fallback_threshold": 0.7
                    }
                }
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Lyzr API error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create Lyzr agent: {str(e)}"
            )

    async def chat_with_agent(self, agent_id: str, message: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """Send a message to a Lyzr agent"""
        if not self.api_key:
            # Mock response for development
            return {
                "response": f"Thank you for your message: '{message}'. This is a mock response from the Lyzr agent.",
                "confidence_score": 0.85,
                "ticket_created": False,
                "agent_id": agent_id
            }

        try:
            payload = {
                "agent_id": agent_id,
                "message": message,
                "context": context or {}
            }
            
            response = await self.client.post(
                f"{self.base_url}/chat",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Lyzr API error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to chat with Lyzr agent: {str(e)}"
            )

    async def update_agent(self, agent_id: str, agent_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing Lyzr agent"""
        if not self.api_key:
            # Mock response for development
            return {
                "id": agent_id,
                "status": "updated",
                "name": agent_data["name"],
                "description": agent_data["description"]
            }

        try:
            response = await self.client.put(
                f"{self.base_url}/agents/{agent_id}",
                json={
                    "name": agent_data["name"],
                    "description": agent_data["description"],
                    "tone": agent_data["tone"],
                    "personality": agent_data["personality"],
                    "knowledge_base": agent_data["knowledge_base"]
                }
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Lyzr API error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to update Lyzr agent: {str(e)}"
            )

    async def delete_agent(self, agent_id: str) -> Dict[str, Any]:
        """Delete a Lyzr agent"""
        if not self.api_key:
            # Mock response for development
            return {
                "id": agent_id,
                "status": "deleted"
            }

        try:
            response = await self.client.delete(f"{self.base_url}/agents/{agent_id}")
            response.raise_for_status()
            return {"id": agent_id, "status": "deleted"}
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Lyzr API error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete Lyzr agent: {str(e)}"
            )

    async def get_agent_analytics(self, agent_id: str) -> Dict[str, Any]:
        """Get analytics for a Lyzr agent"""
        if not self.api_key:
            # Mock analytics for development
            return {
                "agent_id": agent_id,
                "total_conversations": 150,
                "average_confidence": 0.82,
                "tickets_created": 12,
                "user_satisfaction": 4.5,
                "response_time_avg": 2.3
            }

        try:
            response = await self.client.get(f"{self.base_url}/agents/{agent_id}/analytics")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Lyzr API error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get agent analytics: {str(e)}"
            )

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Global instance
lyzr_service = LyzrAPIService() 