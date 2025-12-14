#!/bin/bash
set -e

echo "🚀 Starting Netra v2 via Docker Compose (Lightweight Mode)..."

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH."
    exit 1
fi

echo "📦 Pulling images..."
docker compose -f deploy/v2/docker-compose.yml pull

echo "🔥 Igniting containers..."
docker compose -f deploy/v2/docker-compose.yml up -d

echo ""
echo "✅ Netra v2 Infrastructure is Online!"
echo "-------------------------------------"
echo "🕸️  Neo4j (Graph):      http://localhost:7474 (User: neo4j, Pass: netra-secret)"
echo "📨 Redis (Events):     localhost:6379"
echo "🗄️  MinIO (Storage):    http://localhost:9001 (User: admin, Pass: netra-storage-secret)"
echo "-------------------------------------"
