from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import re
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv
from typing import List

# Load environment variables
load_dotenv("App/.env")
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables")

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

class DeteksiRecord(Base):
    __tablename__ = "deteksi_record"
    id_record = Column(Integer, primary_key=True, index=True)
    timestamp_deteksi = Column(DateTime, default=datetime.utcnow)
    plat_nomor = Column(String(15), nullable=False)

# Setup FastAPI app
app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temp folder
TEMP_FOLDER = "temp"
os.makedirs(TEMP_FOLDER, exist_ok=True)

@app.post("/detect/")
async def detect_plate(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model.predict(image)
    detected_data = []
    db = SessionLocal()

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

            # Simpan ke database hanya plat nomor
            record = DeteksiRecord(
                plat_nomor=plat_result
            )
            db.add(record)
            db.commit()

            detected_data.append({
                "plat_nomor": plat_result,
            })

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


def extract_tax_info(text: str, exclude_numbers: List[str]) -> str:
    """
    Mengekstrak informasi pajak dalam format bulan.tahun dari teks OCR,
    sambil mengecualikan angka-angka yang sudah dipakai dalam plat nomor.
    """
    candidates = re.findall(r'\d{1,4}(?:\.\d{1,4})?', text)

    # Filter angka yang sudah digunakan di plat
    filtered = [
        c for c in candidates
        if all(part not in exclude_numbers for part in re.split(r'\.', c))
    ]

    for i in range(len(filtered)):
        current = filtered[i]

        # Format langsung: xx.xx
        if '.' in current:
            parts = current.split('.')
            if len(parts) == 2 and all(p.isdigit() for p in parts):
                bulan, tahun = parts
                if 1 <= int(bulan) <= 12:
                    return f"{bulan.zfill(2)}.{tahun.zfill(2)}"

        # Format dua angka terpisah (tanpa titik)
        if i + 1 < len(filtered):
            bulan, tahun = filtered[i], filtered[i + 1]
            if (
                bulan.isdigit() and tahun.isdigit() and
                1 <= int(bulan) <= 12
            ):
                return f"{bulan.zfill(2)}.{tahun.zfill(2)}"

    return "Tidak ditemukan"

@app.get("/")
def read_root():
    return {"message": "API is running. Go to /detect/ to upload an image."}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
