from pydantic import BaseModel

class StrategyBase(BaseModel):
    name: str
    buy_price: float
    sell_price: float

class StrategyCreate(StrategyBase):
    pass

class StrategyUpdate(StrategyBase):
    pass

class Strategy(StrategyBase):
    id: str