from pydantic import BaseModel

class MarketData(BaseModel):
    event_type: str
    event_time: int
    symbol: str
    price: str
    quantity: str
    trade_id: int
    is_buyer_maker: bool
    trade_time: int