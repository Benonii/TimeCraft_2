# Use Python 3.11 slim image (more stable than 3.13 alpha)
FROM python:3.11-slim

# Set working directory to backend directory
WORKDIR /backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=v2/app.py \
    FLASK_ENV=development \
    PYTHONPATH=/backend

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

# Copy requirements first
COPY v2/requirements.txt requirements.txt

# Install required packages one by one to identify any issues
RUN pip install --no-cache-dir -r requirements.txt || ( \
    echo "Failed to install requirements. Attempting individual installations..." && \
    pip install alembic==1.13.1 && \
    pip install bcrypt==4.1.2 && \
    pip install python-dotenv==1.0.0 && \
    pip install flasgger==0.9.7.1 && \
    pip install flask-cors==4.0.0 && \
    pip install flask==3.0.0 && \
    pip install passlib==1.7.4 && \
    pip install psycopg2-binary==2.9.9 && \
    pip install "pydantic[email,timezone]==2.5.3" && \
    pip install python-jose==3.3.0 && \
    pip install pytz==2024.1 && \
    pip install sqlalchemy==2.0.25 && \
    pip install uvicorn==0.27.1 \
    )

# Copy the entire project
COPY . .

# Expose port
EXPOSE 5001

# Command to run the application
WORKDIR /backend
CMD ["python", "-m", "v2.app"] 