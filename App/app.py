from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import re
import torch
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv, dotenv_values
load_dotenv("App/.env")

DATABASE_URL = os.getenv("DATABASE_URL")
print(DATABASE_URL)

# Gunakan path dinamis
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "weights", "best.pt")

# Load model
model = YOLO(MODEL_PATH)

reader = easyocr.Reader(['en'])

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class DeteksiRecord(Base):
    __tablename__ = "deteksi_record"

    id_record = Column(Integer, primary_key=True, index=True)
    timestamp_deteksi = Column(DateTime, default=datetime.utcnow) 
    plat_nomor = Column(String(15), nullable=False)
    bulan_tahun_pajak = Column(String(10), nullable=True)

# Setup FastAPI
app = FastAPI()

# CORS setup (biar bisa diakses dari FE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder sementara
TEMP_FOLDER = "temp"
os.makedirs(TEMP_FOLDER, exist_ok=True)

@app.post("/detect/")
async def detect_plate(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model.predict(image)
    detected_data = []

    db = SessionLocal()  # buka koneksi DB

    for i, result in enumerate(results):
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            plate_crop = image[y1:y2, x1:x2]
            plate_gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)

            cropped_plate_path = os.path.join(TEMP_FOLDER, f"plate_{i}.jpg")
            cv2.imwrite(cropped_plate_path, plate_crop)

            ocr_results = reader.readtext(plate_gray)
            detected_text = " ".join([text[1] for text in ocr_results])
            detected_text = re.sub(r"[^\w\s\.\-]", "", detected_text)

            plat_nomor_pattern = r"[A-Z]{1,2} \d{1,4} [A-Z]{1,3}"
            pajak_pattern = r"\b\d{2}[\.\,\-\s]?\d{2}\b"

            plat_nomor = re.search(plat_nomor_pattern, detected_text)
            pajak = re.findall(r"\b\d{2}\b", detected_text)
            bulan_tahun_pajak = f"{pajak[0]}.{pajak[1]}" if len(pajak) >= 2 else "Tidak ditemukan"

            plat_result = plat_nomor.group() if plat_nomor else "Tidak ditemukan"

            # ✅ Simpan ke database
            record = DeteksiRecord(
                plat_nomor=plat_result,
                bulan_tahun_pajak=bulan_tahun_pajak
            )
            db.add(record)
            db.commit()

            detected_data.append({
                "plat_nomor": plat_result,
                "bulan_tahun_pajak": bulan_tahun_pajak,
            })

    db.close()

    return {"results": detected_data}

@app.get("/")
def read_root():
    return {"message": "API is running. Go to /detect/ to upload an image."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
