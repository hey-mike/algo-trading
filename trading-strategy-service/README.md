# Trading Strategy Service

## Overview

The Trading Strategy Service is a core component of a larger trading bot system, designed to manage, evaluate, and execute trading strategies based on real-time market data. Built with FastAPI, this service analyzes incoming market data, decides on trade actions according to predefined strategies, and emits trade signals for execution.

## Features

- Add and list trading strategies via RESTful API.
- Real-time analysis of market data.
- Emitting trade signals based on strategy evaluation.
- Integration with RabbitMQ for message passing within the trading bot ecosystem.

## Requirements

- Python 3.7+
- FastAPI
- Uvicorn
- Pydantic
- Pika (for RabbitMQ interaction)

## Setup

### Environment Setup

Ensure you have Python 3.7 or newer installed on your system.

### Installing Dependencies

Install the required Python packages using the following command:

```bash
pip install -r requirements.txt
```

### Running the Service

Start the service with Uvicorn:

```bash
uvicorn app.main:app --reload
```

The `--reload` flag is recommended for development as it automatically reloads the server on code changes.

## Usage

### Adding a Trading Strategy

```bash
curl -X 'POST' \\ 'http://127.0.0.1:8000/strategies/' \\ -H 'accept: application/json' \\ -H 'Content-Type: application/json' \\ -d '{ "name": "Simple Moving Average", "parameters": { "period": 14 }, "description": "A strategy based on simple moving average" }'
```

### Listing All Trading Strategies

```bash
curl -X 'GET' \\ 'http://127.0.0.1:8000/strategies/' \\ -H 'accept: application/json'
```

## Integration with RabbitMQ

This service publishes trade signals to a RabbitMQ exchange upon identifying a trading opportunity. Ensure RabbitMQ is running and accessible at the configured URL.

## Contributing

We welcome contributions to the Trading Strategy Service! Please feel free to submit pull requests or open issues for bugs, feature requests, or documentation improvements.

## License

MIT
