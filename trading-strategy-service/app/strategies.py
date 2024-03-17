# app/strategies.py
from typing import List, Dict, Any

class MarketData:
    def __init__(self, prices: List[float]):
        self.prices = prices

class Strategy:
    def analyze(self, data: MarketData) -> Dict[str, Any]:
        """Analyze market data and return the analysis result."""
        raise NotImplementedError("Strategy.analyze() must be overridden.")

class SimpleMovingAverageStrategy(Strategy):
    def __init__(self, period: int = 14):
        self.period = period

    def analyze(self, data: MarketData) -> Dict[str, Any]:
        if len(data.prices) < self.period:
            return {"action": "hold", "reason": "Not enough data for analysis."}

        # Calculate the SMA
        sma = sum(data.prices[-self.period:]) / self.period
        latest_price = data.prices[-1]

        # Example decision logic based on SMA
        if latest_price > sma:
            return {"action": "buy", "reason": f"Price above SMA ({sma:.2f})."}
        elif latest_price < sma:
            return {"action": "sell", "reason": f"Price below SMA ({sma:.2f})."}
        else:
            return {"action": "hold", "reason": "Price equal to SMA."}

# Example usage
def analyze_market_data(strategy: Strategy, prices: List[float]) -> Dict[str, Any]:
    data = MarketData(prices)
    return strategy.analyze(data)

# This function could be expanded or modified to handle different types of strategies and market data inputs.
