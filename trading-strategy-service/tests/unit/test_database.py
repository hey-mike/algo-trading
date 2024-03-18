import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

@pytest.fixture(scope="module")
async def test_database():
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    db = client.test_database
    yield db
    await client.drop_database(db)
    await client.close()