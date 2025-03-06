from fastapi import FastAPI, File, UploadFile
import uvicorn
import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import re
import os

# Inisialisasi FastAPI
app = FastAPI()

# Load model YOLOv8 dari .pt
model = YOLO(r"C:\Users\Neanake\PlatTaxMonitor-B1-05\AI\training_results\weights\best.pt")

# Inisialisasi EasyOCR
reader = easyocr.Reader(['en'])

# Folder penyimpanan sementara
TEMP_FOLDER = "temp"
os.makedirs(TEMP_FOLDER, exist_ok=True)

@app.post("/detect/")
async def detect_plate(file: UploadFile = File(...)):
    # Baca file gambar
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Jalankan deteksi YOLOv8
    results = model.predict(image)

    detected_data = []

    for i, result in enumerate(results):
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])

            # Crop plat nomor
            plate_crop = image[y1:y2, x1:x2]

            # Convert ke grayscale
            plate_gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)

            # Simpan hasil crop sementara
            cropped_plate_path = os.path.join(TEMP_FOLDER, f"plate_{i}.jpg")
            cv2.imwrite(cropped_plate_path, plate_crop)

            # Jalankan OCR
            ocr_results = reader.readtext(plate_gray)
            detected_text = " ".join([text[1] for text in ocr_results])

            # Bersihkan teks OCR
            detected_text = re.sub(r"[^\w\s\.\-]", "", detected_text)

            # Cari nomor plat
            plat_nomor_pattern = r"[A-Z]{1,2} \d{1,4} [A-Z]{1,3}"
            pajak_pattern = r"\d{2}[\.\,\-\s]?\d{2}"

            plat_nomor = re.search(plat_nomor_pattern, detected_text)
            pajak = re.findall(r"\b\d{2}\b", detected_text)
            tanggal_pajak = f"{pajak[0]}.{pajak[1]}" if len(pajak) >= 2 else "Tidak ditemukan"

            detected_data.append({
                "plat_nomor": plat_nomor.group() if plat_nomor else "Tidak ditemukan",
                "tanggal_pajak": tanggal_pajak,
                "confidence": conf
            })

    return {"results": detected_data}


# Root endpoint untuk memberi pesan sederhana
@app.get("/")
def read_root():
    return {"message": "API is running. Go to /detect/ to upload an image."}


# Main function untuk menjalankan server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
