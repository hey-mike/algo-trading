from pydantic import BaseModel

class TradeSignal(BaseModel):
    symbol: str
    signal_type: str
    price: float