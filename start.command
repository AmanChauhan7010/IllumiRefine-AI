#!/bin/bash

# Navigate to project root directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "========================================================"
echo "   🌟 Starting IllumiRefine AI (Full Stack Suite)"
echo "========================================================"

# 1. Check & start Python FastAPI backend on port 8000
if ! lsof -i :8000 > /dev/null 2>&1; then
    echo "▶ Starting Python FastAPI backend (Port 8000)..."
    ./venv/bin/python main.py &
    BACKEND_PID=$!
    sleep 2
else
    echo "✔ Backend is already online at http://localhost:8000"
fi

# 2. Check & start React Frontend on port 3000
if ! lsof -i :3000 > /dev/null 2>&1; then
    echo "▶ Starting React Frontend UI (Port 3000)..."
    cd frontend && npm start
else
    echo "✔ Frontend is already online. Opening browser..."
    open "http://localhost:3000"
fi
