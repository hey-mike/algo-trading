from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.strategy import StrategyCreate, StrategyUpdate, Strategy
from app.core.database import get_strategy_collection
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=Strategy)
async def create_strategy(strategy: StrategyCreate, collection=Depends(get_strategy_collection)):
    result = await collection.insert_one(strategy.dict())
    return await collection.find_one({"_id": result.inserted_id})

@router.get("/", response_model=List[Strategy])
async def get_strategies(collection=Depends(get_strategy_collection)):
    strategies = await collection.find().to_list(length=100)
    return strategies

@router.put("/{strategy_id}", response_model=Strategy)
async def update_strategy(strategy_id: str, strategy: StrategyUpdate, collection=Depends(get_strategy_collection)):
    result = await collection.update_one({"_id": ObjectId(strategy_id)}, {"$set": strategy.dict(exclude_unset=True)})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Strategy not found")
    return await collection.find_one({"_id": ObjectId(strategy_id)})