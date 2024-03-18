from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from bson import ObjectId

class StrategyConfig(BaseModel):
    # Define the configuration fields for a strategy
    # Example fields:
    symbol: str
    timeframe: str
    parameters: Dict[str, Any]

class Strategy(BaseModel):
    id: Optional[str] = Field(default_factory=str)
    name: str
    description: Optional[str] = None
    config: StrategyConfig

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class StrategyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    config: StrategyConfig

class StrategyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[StrategyConfig] = None