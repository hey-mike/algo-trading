from fastapi import HTTPException

class StrategyNotFound(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Strategy not found")