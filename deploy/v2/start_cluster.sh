#!/bin/bash
set -e

# Add local tools to PATH
if [ -d "$(pwd)/_tools" ]; then
    export PATH="$(pwd)/_tools:$PATH"
fi

echo "🚀 Starting Minikube Cluster..."

if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube not found. Run 'bash deploy/v2/install_deps.sh' first."
    exit 1
fi

# Start Minikube (using Docker driver by default)
minikube start --driver=docker --memory=4096 --cpus=2

echo "✅ Cluster is running!"
echo "👉 Now you can run: bash deploy/v2/setup_v2.sh"
