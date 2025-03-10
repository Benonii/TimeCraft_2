# Use Python 3.11 slim image (more stable than 3.13 alpha)
FROM python:3.11-slim

# Set working directory to backend directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=development \
    PYTHONPATH=/app \
    PIP_NO_CACHE_DIR=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        libpq-dev \
        build-essential \
        pkg-config \
        gcc \
        python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install build tools
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copy only requirements first for better caching
COPY ./requirements.txt .

# Install required packages with verbose output
RUN pip install --verbose --no-cache-dir -r requirements.txt

# Copy the application code
COPY . /app/v2/

# Create an empty __init__.py if it doesn't exist
RUN touch /app/__init__.py

# Expose port
EXPOSE 5001

# Command to run the application
WORKDIR /app
CMD ["python", "-m", "v2.app"]