#!/bin/bash

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to build the component
build_component() {
    echo "Building component..."
    npm run build
}

# Function to start Home Assistant
start_ha() {
    echo "Starting Home Assistant..."
    docker-compose up -d
    echo "Home Assistant will be available at http://localhost:8123"
    echo "Initial startup may take a few minutes."
}

# Function to stop Home Assistant
stop_ha() {
    echo "Stopping Home Assistant..."
    docker-compose down
}

# Function to show logs
show_logs() {
    docker-compose logs -f homeassistant
}

# Function to rebuild and restart
rebuild() {
    build_component
    docker-compose restart homeassistant
}

# Main script
case "$1" in
    "start")
        check_docker
        build_component
        start_ha
        ;;
    "stop")
        stop_ha
        ;;
    "logs")
        show_logs
        ;;
    "rebuild")
        rebuild
        ;;
    *)
        echo "Usage: $0 {start|stop|logs|rebuild}"
        echo "  start   - Build component and start Home Assistant"
        echo "  stop    - Stop Home Assistant"
        echo "  logs    - Show Home Assistant logs"
        echo "  rebuild - Rebuild component and restart Home Assistant"
        exit 1
        ;;
esac
