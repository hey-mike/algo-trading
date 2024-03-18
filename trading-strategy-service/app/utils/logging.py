import logging
from logging.handlers import RotatingFileHandler
import os
from colorlog import ColoredFormatter
from app.core.config import settings

# Create a custom logger
logger = logging.getLogger(__name__)

# Set the logging level based on the environment variable
log_level = os.getenv('LOG_LEVEL', 'INFO')
logger.setLevel(log_level)

# Create a colored formatter for the console handler
console_formatter = ColoredFormatter(
    "%(log_color)s%(asctime)s - %(name)s - [%(levelname)s] - %(message)s",
    datefmt=None,
    reset=True,
    log_colors={
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'red,bg_white',
    },
    secondary_log_colors={},
    style='%'
)

# Create a console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(console_formatter)

# Configure the console handler based on the environment
if settings.ENVIRONMENT == 'production':
    console_handler.setLevel(logging.WARNING)
else:
    console_handler.setLevel(logging.DEBUG)

logger.addHandler(console_handler)

# Create a file handler
if not os.path.exists('logs'):
    os.makedirs('logs')
file_handler = RotatingFileHandler('logs/trading_strategy_service.log', maxBytes=10485760, backupCount=10)
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)

# Define a function to get the logger instance
def get_logger():
    return logger