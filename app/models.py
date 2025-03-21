"""
Data models for the regulation extraction application.
"""

from typing import List, Optional
from pydantic import BaseModel


class ConfigSettings:
    """Configuration settings for the application."""

    openai_api_key: str
    model: str
    max_tokens: int
    temperature: float


class MarketRequirementsRequest(BaseModel):
    """Request model for market requirements query."""

    product_type: str
    market: str
    detailed: bool = False


class Requirement(BaseModel):
    """Model representing a single regulatory requirement."""

    name: str
    description: str
    category: str
    source: Optional[str] = None


class MarketRequirementsResponse(BaseModel):
    """Response model for market requirements query."""

    product_type: str
    market: str
    requirements: List[Requirement]
    summary: str
