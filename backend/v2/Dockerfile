# Use Python 3.11 slim image (more stable than 3.13 alpha)
FROM python:3.11-slim

# Set working directory to backend directory
WORKDIR /backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=v2/app.py \
    FLASK_ENV=development \
    PYTHONPATH=/backend \
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
COPY v2/requirements.txt /backend/v2/

# Debug: Show contents of directory and requirements file
RUN ls -la /backend/v2/ && cat /backend/v2/requirements.txt

# Install required packages with verbose output
RUN pip install --verbose --no-cache-dir -r /backend/v2/requirements.txt

# Copy the entire project
COPY . .

# Expose port
EXPOSE 5001

# Command to run the application
WORKDIR /backend
CMD ["python", "-m", "v2.app"] 