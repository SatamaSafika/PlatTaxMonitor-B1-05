# Gunakan base image Python
FROM python:3.11

# Set working directory
WORKDIR /App

# Salin file requirements dan install dependencies
COPY requirements.txt ./ 
RUN pip install --no-cache-dir -r requirements.txt

# Install opencv dependencies (karena menggunakan cv2 dan EasyOCR juga butuh dependencies)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Salin semua file proyek ke dalam container
COPY . .

# Salin file .env ke dalam container
COPY .env .env

# Jalankan server FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
