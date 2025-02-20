# PlatTax-B1-05 🚗📸

Platax Monitor adalah sistem berbasis AI yang dirancang untuk mendeteksi plat nomor kendaraan secara otomatis.  
Sistem ini memanfaatkan teknologi Deep Learning untuk melakukan pengenalan plat nomor, kemudian memverifikasi masa berlaku pajak kendaraan.  
Platax Monitor juga dapat memberikan pengingat otomatis terkait jatuh tempo pembayaran pajak, membantu pemilik kendaraan untuk tetap patuh pada kewajiban pajaknya, dan mengurangi potensi denda akibat keterlambatan pembayaran. 💡

## Kelompok B1_05

- **Ketua Kelompok:** Alexander Johan Pramudito - 22/492990/TK/53976
- **Anggota 1:** Barbara Neanake Ajiesti - 22/494495/TK/54238
- **Anggota 2:** Satama Safika - 22/492880/TK/53955

## Project Senior Project TI

**Instansi:** Departemen Teknologi Elektro dan Teknologi Informasi, Fakultas Teknik, Universitas Gadjah Mada

---

## 📌 Latar Belakang

Banyak pemilik kendaraan yang lupa memperpanjang pajak kendaraan mereka, yang mengakibatkan denda dan ketidakpatuhan terhadap regulasi.  
PlatTax hadir sebagai solusi berbasis AI untuk mengotomatisasi deteksi plat nomor, memverifikasi status pajak kendaraan, dan mengingatkan pemilik kendaraan untuk membayar pajak tepat waktu.

## 🎯 Tujuan

- Mendeteksi dan mengenali plat nomor kendaraan secara otomatis.
- Memverifikasi status pajak kendaraan berdasarkan data yang tersedia.
- Memberikan pengingat kepada pemilik kendaraan sebelum jatuh tempo pembayaran pajak.

---

## 🏗️ Arsitektur Sistem

PlatTax Monitor bekerja dengan alur sebagai berikut:

1. **Pendeteksian Plat Nomor**
   - Kamera menangkap gambar kendaraan.
   - Model deep learning mengidentifikasi dan mengekstrak plat nomor.
2. **Verifikasi Pajak Kendaraan**
   - Sistem memeriksa status pajak kendaraan berdasarkan database yang tersedia.
3. **Notifikasi Otomatis**
   - Jika pajak kendaraan mendekati jatuh tempo, sistem mengirimkan pengingat melalui notifikasi.

---

## 🛠️ Use Case Diagram

![Use Case Diagram](https://github.com/SatamaSafika/ProductName-B1-05/blob/main/assets/Usecase_PlatTax.png?raw=true)

### Penjelasan Use Case

1. **Pemilik Kendaraan**
   - Mengunggah foto kendaraan untuk pengecekan pajak.
   - Menerima notifikasi pembayaran pajak.
2. **Sistem PlatTax**
   - Menganalisis gambar plat nomor menggunakan deep learning.
   - Memverifikasi status pajak kendaraan berdasarkan database yang tersedia.
   - Mengirimkan notifikasi kepada pemilik kendaraan jika pajak mendekati jatuh tempo.

---

## 📊 Lean Canvas

![Lean Canvas](https://github.com/SatamaSafika/ProductName-B1-05/blob/main/assets/LeanCanvas.png?raw=true)

---

## 📁 ERD (Entity Relationship Diagram)

![ERD](https://github.com/SatamaSafika/ProductName-B1-05/blob/main/assets/ERD.png?raw=true)

ERD menggambarkan hubungan antar entitas dalam sistem PlatTax Monitor, mencakup informasi pengguna, kendaraan, data pajak, serta proses verifikasi dan notifikasi pajak.

---

## 📅 Gantt Chart

![Gantt Chart](https://github.com/SatamaSafika/ProductName-B1-05/blob/main/assets/GanttChart.png?raw=true)

Gantt Chart ini menunjukkan perencanaan dan alur pengerjaan proyek PlatTax Monitor dari awal hingga implementasi. Diagram ini membantu dalam mengelola waktu dan memastikan setiap tahapan proyek selesai tepat waktu.

---

## 🚀 Kesimpulan

PlatTax Monitor menawarkan solusi inovatif untuk meningkatkan kepatuhan pajak kendaraan. Dengan teknologi AI, sistem ini dapat membantu pemilik kendaraan menghindari denda dan memastikan mereka selalu membayar pajak tepat waktu.
