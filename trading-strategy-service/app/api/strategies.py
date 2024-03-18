from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.strategy import StrategyCreate, StrategyUpdate, Strategy
from app.core.database import database
from app.utils.logging import get_logger
from bson import ObjectId

logger = get_logger()
router = APIRouter()

@router.post("/", response_model=Strategy)
async def create_strategy(strategy: StrategyCreate, collection=Depends(database.get_strategy_collection)):
    result = await collection.insert_one(strategy.dict())
    logger.info(f"Created strategy with ID: {result.inserted_id}")
    return await collection.find_one({"_id": result.inserted_id})

@router.get("/", response_model=List[Strategy])
async def get_strategies(collection=Depends(database.get_strategy_collection)):
    strategies = await collection.find().to_list(length=100)
    logger.info(f"Retrieved {len(strategies)} strategies")
    return strategies

@router.put("/{strategy_id}", response_model=Strategy)
async def update_strategy(strategy_id: str, strategy: StrategyUpdate, collection=Depends(database.get_strategy_collection)):
    result = await collection.update_one({"_id": ObjectId(strategy_id)}, {"$set": strategy.dict(exclude_unset=True)})
    if result.modified_count == 0:
        logger.warning(f"Strategy with ID {strategy_id} not found")
        raise HTTPException(status_code=404, detail="Strategy not found")
    logger.info(f"Updated strategy with ID: {strategy_id}")
    return await collection.find_one({"_id": ObjectId(strategy_id)})