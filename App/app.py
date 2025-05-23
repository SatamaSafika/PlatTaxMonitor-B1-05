from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import re
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import os
from dotenv import load_dotenv
from typing import List
import httpx

# Load environment variables
load_dotenv(".env")
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables")
BACKEND_URL = os.getenv("BACKEND_URL")
if not BACKEND_URL:
    raise ValueError("BACKEND_URL is not set in the environment variables")

# Setup paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "weights", "best.pt")

# Load YOLO and EasyOCR
model = YOLO(MODEL_PATH)
reader = easyocr.Reader(['en'])

# Setup SQLAlchemy
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Define DeteksiRecord table (for storing detection results)
class DeteksiRecord(Base):
    __tablename__ = "deteksi_record"
    id_record = Column(Integer, primary_key=True, index=True)
    timestamp_deteksi = Column(DateTime, default=datetime.utcnow)
    plat_nomor = Column(String(15), nullable=False)

# Define the TagihanPajak table with the correct columns
class TagihanPajak(Base):
    __tablename__ = "tagihan_pajak"
    id_tagihan = Column(Integer, primary_key=True, index=True)
    plat_nomor = Column(String(15), ForeignKey("kendaraan.plat_nomor"))  # Foreign key to kendaraan
    nilai_tagihan = Column(Integer)
    timestamp_pembuatan_tagihan = Column(DateTime)

    kendaraan = relationship("Kendaraan", back_populates="tagihan_pajak")


# Update the Kendaraan model to include the relationship with TagihanPajak
class Kendaraan(Base):
    __tablename__ = "kendaraan"
    plat_nomor = Column(String(15), primary_key=True, index=True)  # Plat nomor as primary key
    harga_pajak = Column(Integer)
    nama_pemilik = Column(String(100))
    kategori_kendaraan = Column(String(50))
    email_pemilik = Column(String(100))
    tanggal_pajak_terakhir = Column(DateTime)
    tanggal_pajak_berlakutahunan = Column(DateTime)
    tanggal_pajak_berlakulimatahunan = Column(DateTime)

    # Relationship with TagihanPajak table
    tagihan_pajak = relationship("TagihanPajak", back_populates="kendaraan")

# Setup FastAPI app
app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://plat-tax-monitor-b1-05.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Temp folder
TEMP_FOLDER = "temp"
os.makedirs(TEMP_FOLDER, exist_ok=True)

import httpx

@app.post("/detect/")
async def detect_plate(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model.predict(image)
    detected_data = []
    db = SessionLocal()

    async with httpx.AsyncClient() as client:  # Menggunakan client HTTP async
        for i, result in enumerate(results):
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                plate_crop = image[y1:y2, x1:x2]
                plate_gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)

                cropped_plate_path = os.path.join(TEMP_FOLDER, f"plate_{i}.jpg")
                cv2.imwrite(cropped_plate_path, plate_crop)

                ocr_results = reader.readtext(plate_gray)
                detected_text = " ".join([text[1] for text in ocr_results])
                detected_text = re.sub(r"[^\w\s\.\-]", "", detected_text).upper().strip()

                print(f"\n[INFO] Detected raw text: {detected_text}")

                # Koreksi dan ekstrak plat nomor
                plat_result = extract_and_correct_plate(detected_text)
                if plat_result == "Tidak ditemukan":
                    print("[INFO] Plate not matched by format")
                    continue
                print(f"[INFO] Corrected plate: {plat_result}")

                # Mengambil data pajak dari API `/vehicle-tax/{plat_nomor}`
                vehicle_tax_url = f"{BACKEND_URL}/vehicle-tax/{plat_result}"
                response = await client.get(vehicle_tax_url)

                if response.status_code == 200:
                    vehicle_data = response.json()

                    detected_data.append({
                        "plat_nomor": plat_result,
                        "tax_date": vehicle_data.get("tax_date", "No tax information"),
                        "nama_pemilik": vehicle_data.get("nama_pemilik", "No owner info"),
                        "harga_pajak": vehicle_data.get("harga_pajak", 0),
                        "nilai_tagihan": vehicle_data.get("nilai_tagihan", 0),
                    })
                else:
                    print(f"[INFO] No data found for plate {plat_result}")

                # Simpan ke database hanya plat nomor (atau tambahan data lain jika diperlukan)
                record = DeteksiRecord(
                    plat_nomor=plat_result
                )   
                db.add(record)
                db.commit()

    db.close()
    return {"results": detected_data}

def extract_and_correct_plate(text: str) -> str:
    """
    Ekstrak dan koreksi plat nomor dari teks hasil OCR (format: huruf angka huruf)
    """
    text = re.sub(r'\s+', ' ', text).strip()

    # Pisahkan huruf dan angka jika tidak ada spasi
    text = re.sub(r'([A-Z])(\d)', r'\1 \2', text)
    text = re.sub(r'(\d)([A-Z])', r'\1 \2', text)

    match = re.match(r"([A-Z0-9]{1,2})\s+(\d{1,4})\s+([A-Z0-9]{1,3})", text)
    if not match:
        return "Tidak ditemukan"

    prefix, numbers, suffix = match.groups()

    replacements = {
        '0': 'O',
        '1': 'I',
        '2': 'Z',
        '5': 'S',
        '6': 'G',
        '8': 'B'
    }

    def correct_letters(s):
        return ''.join(replacements.get(c, c) for c in s)

    corrected_prefix = correct_letters(prefix)
    corrected_suffix = correct_letters(suffix)

    return f"{corrected_prefix} {numbers} {corrected_suffix}"

# Update the vehicle tax endpoint to also return nilai_tagihan based on timestamp_pembuatan_tagihan
@app.get("/vehicle-tax/{plat_nomor}")
async def get_vehicle_tax(plat_nomor: str):
    db = SessionLocal()
    try:
        # Query the vehicle based on plat_nomor
        kendaraan = db.execute(
            select(Kendaraan).filter(Kendaraan.plat_nomor == plat_nomor)
        ).scalars().first()

        if kendaraan:
            # Retrieve the valid tax date from `tanggal_pajak_berlakulimatahunan`
            tax_date = kendaraan.tanggal_pajak_berlakulimatahunan

            # Retrieve the latest tagihan (invoice) based on timestamp_pembuatan_tagihan
            latest_tagihan = db.execute(
                select(TagihanPajak).filter(TagihanPajak.plat_nomor == plat_nomor)
                .order_by(TagihanPajak.timestamp_pembuatan_tagihan.desc())
            ).scalars().first()

            if latest_tagihan:
                return {
                    "plat_nomor": plat_nomor,
                    "tax_date": tax_date if tax_date else "No tax information",
                    "nama_pemilik": kendaraan.nama_pemilik, 
                    "harga_pajak": kendaraan.harga_pajak,
                    "nilai_tagihan": latest_tagihan.nilai_tagihan
                }
            else:
                return {"detail": "No tagihan found for this vehicle"}
        else:
            return {"detail": "No records found for this vehicle"}

    except SQLAlchemyError as e:
        db.rollback()
        return {"error": f"Database error: {str(e)}"}

    finally:
        db.close()  

@app.get("/")
def read_root():
    return {"message": "API is running. Go to /detect/ to upload an image."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
