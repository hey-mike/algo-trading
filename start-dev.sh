#!/bin/bash

# Define your network and Docker Compose files
NETWORK_NAME="backend-network"
INFRA_COMPOSE_FILE="docker-compose.infra.yml"
APP_COMPOSE_FILE="docker-compose.dev.yml"

# Function to check if the Docker network exists
network_exists() {
    docker network ls | grep -w $NETWORK_NAME > /dev/null
}

# Function to create Docker network if it does not exist
create_network() {
    if network_exists; then
        echo "Network $NETWORK_NAME already exists."
    else
        echo "Creating network $NETWORK_NAME..."
        docker network create $NETWORK_NAME
    fi
}

# Function to start all services together
start_all_services() {
    echo "Starting all services..."
    docker-compose -f $INFRA_COMPOSE_FILE -f $APP_COMPOSE_FILE up -d --build
}
# Function to tail logs from application services only
tail_app_logs() {
    echo "Tailing logs from application services..."
 docker-compose -f $INFRA_COMPOSE_FILE -f $APP_COMPOSE_FILE logs -f
}

# Main script execution
# 1. Create network if it doesn't exist
create_network

# 2. Start all services together
start_all_services

tail_app_logs


echo "All services have been started."
