from pydantic import BaseModel
from datetime import datetime

class StrategyRequest(BaseModel):
    strategy_name: str
    parameters: dict

class TradeSignal(BaseModel):
    action: str
    symbol: str
    price: float
    volume: float
    timestamp: datetime
