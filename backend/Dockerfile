FROM python:3.13-slim

WORKDIR /app

# Install system dependencies needed for compiling psycopg2 if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements into backend package folder
COPY requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy source code
COPY . /app/backend/

EXPOSE 8000

ENV PYTHONPATH=/app

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
