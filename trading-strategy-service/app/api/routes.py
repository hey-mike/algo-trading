from fastapi import APIRouter
from app.api import strategies, health

router = APIRouter()
router.include_router(strategies.router, prefix="/strategies", tags=["Strategies"])
router.include_router(health.router, tags=["Health"])