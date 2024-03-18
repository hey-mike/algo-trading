from fastapi import APIRouter
from app.api import strategies

router = APIRouter()
router.include_router(strategies.router, prefix="/strategies", tags=["Strategies"])