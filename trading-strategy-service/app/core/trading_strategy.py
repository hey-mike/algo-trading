from app.models.market_data import MarketData
from app.models.trade_signal import TradeSignal
from app.models.strategy import Strategy
from app.core.database import get_strategy_collection
from app.utils.logging import get_logger
from bson import ObjectId
from typing import List, Optional


logger = get_logger

async def execute_strategy(strategy: Strategy, market_data: MarketData) -> Optional[TradeSignal]:
    if strategy.name == "Moving Average Crossover":
        return await moving_average_crossover(strategy, market_data)
    elif strategy.name == "RSI Overbought/Oversold":
        return await rsi_strategy(strategy, market_data)
    else:
        logger.warning(f"Unsupported strategy: {strategy.name}")
        return None

async def moving_average_crossover(strategy: Strategy, market_data: MarketData) -> Optional[TradeSignal]:
    # Implement moving average crossover strategy logic here
    # ...
    return None

async def rsi_strategy(strategy: Strategy, market_data: MarketData) -> Optional[TradeSignal]:
    # Implement RSI overbought/oversold strategy logic here
    # ...
    return None

async def process_market_data(market_data: MarketData):
    try:
        logger.info(f"Processing market data for symbol {market_data.symbol}")
        strategies = await get_strategies_by_symbol(market_data.symbol)
        for strategy in strategies:
            trade_signal = await execute_strategy(strategy, market_data)
            if trade_signal:
                logger.info(f"Trade signal generated: {trade_signal}")
                # Publish the trade signal to the message queue or perform other actions
    except Exception as e:
        logger.exception(f"Error processing market data: {e}")

async def create_strategy(strategy_data: dict) -> str:
    try:
        strategy = Strategy(**strategy_data)
        collection = await get_strategy_collection()
        result = await collection.insert_one(strategy.dict())
        return str(result.inserted_id)
    except Exception as e:
        logger.exception(f"Error creating strategy: {e}")
        raise e

async def get_strategy_by_id(strategy_id: str) -> Optional[Strategy]:
    try:
        collection = await get_strategy_collection()
        strategy_data = await collection.find_one({"_id": ObjectId(strategy_id)})
        if strategy_data:
            return Strategy(**strategy_data)
        return None
    except Exception as e:
        logger.exception(f"Error retrieving strategy: {e}")
        raise e

async def get_strategies_by_symbol(symbol: str) -> List[Strategy]:
    try:
        collection = await get_strategy_collection()
        strategies = await collection.find({"config.symbol": symbol}).to_list(length=None)
        return [Strategy(**strategy) for strategy in strategies]
    except Exception as e:
        logger.exception(f"Error retrieving strategies: {e}")
        raise e

async def update_strategy(strategy_id: str, update_data: dict) -> Optional[Strategy]:
    try:
        collection = await get_strategy_collection()
        strategy_data = await collection.find_one_and_update(
            {"_id": ObjectId(strategy_id)},
            {"$set": update_data},
            return_document=True
        )
        if strategy_data:
            return Strategy(**strategy_data)
        return None
    except Exception as e:
        logger.exception(f"Error updating strategy: {e}")
        raise e