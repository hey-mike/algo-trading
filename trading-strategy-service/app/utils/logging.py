import logging
from logging.handlers import RotatingFileHandler
import os
from app.core.config import settings

# Create a custom logger
logger = logging.getLogger(__name__)

# Set the logging level (e.g., DEBUG, INFO, WARNING, ERROR, CRITICAL)
logger.setLevel(logging.INFO)

# Create a formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Create a console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Create a file handler
if not os.path.exists('logs'):
    os.makedirs('logs')
file_handler = RotatingFileHandler('logs/trading_strategy_service.log', maxBytes=10485760, backupCount=10)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Define a function to get the logger instance
def get_logger():
    return logger