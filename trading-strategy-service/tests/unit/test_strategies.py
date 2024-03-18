import pytest
from app.api.strategies import create_strategy, get_strategies, update_strategy
from app.models.strategy import StrategyCreate, StrategyUpdate

@pytest.mark.asyncio
async def test_create_strategy(test_database):
    strategy_data = StrategyCreate(name="Test Strategy", buy_price=100.0, sell_price=200.0)
    strategy = await create_strategy(strategy_data, test_database.strategies)
    assert strategy.name == "Test Strategy"
    assert strategy.buy_price == 100.0
    assert strategy.sell_price == 200.0

@pytest.mark.asyncio
async def test_get_strategies(test_database):
    strategies = await get_strategies(test_database.strategies)
    assert isinstance(strategies, list)

@pytest.mark.asyncio
async def test_update_strategy(test_database):
    strategy_data = StrategyCreate(name="Test Strategy", buy_price=100.0, sell_price=200.0)
    strategy = await create_strategy(strategy_data, test_database.strategies)
    update_data = StrategyUpdate(name="Updated Strategy", buy_price=150.0)
    updated_strategy = await update_strategy(str(strategy.id), update_data, test_database.strategies)
    assert updated_strategy.name == "Updated Strategy"
    assert updated_strategy.buy_price == 150.0
    assert updated_strategy.sell_price == 200.0