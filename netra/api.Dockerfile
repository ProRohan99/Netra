FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

# Install Poetry (optional) or just use pip with pyproject.toml
# For simplicity/speed in this context, we will use pip based on requirements
COPY pyproject.toml .
# Convert to requirements.txt-ish install or install poetry
RUN pip install poetry && poetry config virtualenvs.create false
RUN poetry install --no-dev

# Copy application code
COPY netra ./netra

# Run the API
CMD ["uvicorn", "netra.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
