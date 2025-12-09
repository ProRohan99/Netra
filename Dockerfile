FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy configuration
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi

# Copy source
COPY vortex ./vortex
COPY README.md ./

# Expose API port
EXPOSE 8000

# Run API
CMD ["uvicorn", "vortex.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
