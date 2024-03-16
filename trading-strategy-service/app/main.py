from fastapi import FastAPI
from app.api.endpoints import strategy, health_check

app = FastAPI()

# Include routers from endpoints
app.include_router(strategy.router)
app.include_router(health_check.router)

@app.get("/")
async def root():
    return {"message": "Trading Strategy Service is online."}
