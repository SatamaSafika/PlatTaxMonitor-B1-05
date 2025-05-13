# Gunakan base image Python
FROM python:3.11

# Set working directory
WORKDIR /App

# Salin requirements dan install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install dependencies untuk opencv dan easyocr
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Salin semua file termasuk .env dari konteks build
COPY . .

EXPOSE 8000

# Jalankan FastAPI pakai uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
