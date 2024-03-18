from fastapi import APIRouter, HTTPException, status
from app.models.strategy import Strategy, StrategyCreate, StrategyUpdate
from app.core.trading_strategy import (
    create_strategy,
    get_strategy_by_id,
    get_strategies_by_symbol,
    update_strategy,
)
from app.utils.logging import get_logger
from typing import List

router = APIRouter()
logger = get_logger()

@router.post("/", response_model=str, status_code=status.HTTP_201_CREATED)
async def create_new_strategy(strategy: StrategyCreate):
    try:
        strategy_id = await create_strategy(strategy.dict())
        return strategy_id
    except Exception as e:
        logger.exception(f"Error creating strategy: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create strategy")

@router.get("/{strategy_id}", response_model=Strategy)
async def get_strategy(strategy_id: str):
    try:
        strategy = await get_strategy_by_id(strategy_id)
        if strategy:
            return strategy
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    except Exception as e:
        logger.exception(f"Error retrieving strategy: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve strategy")

@router.put("/{strategy_id}", response_model=Strategy)
async def update_strategy_by_id(strategy_id: str, strategy: StrategyUpdate):
    try:
        updated_strategy = await update_strategy(strategy_id, strategy.dict(exclude_unset=True))
        if updated_strategy:
            return updated_strategy
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    except Exception as e:
        logger.exception(f"Error updating strategy: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update strategy")

@router.get("/symbol/{symbol}", response_model=List[Strategy])
async def get_strategies_by_symbol(symbol: str):
    try:
        strategies = await get_strategies_by_symbol(symbol)
        return strategies
    except Exception as e:
        logger.exception(f"Error retrieving strategies: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve strategies")