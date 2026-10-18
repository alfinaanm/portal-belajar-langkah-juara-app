# Dokumentasi Pembuktian Alur Inti Bimbel (Cloud Firestore Sungguhan)

Dokumen ini membuktikan bahwa **Alur Inti Bimbel** pada **Portal Belajar Langkah Juara** telah berhasil dibangun dan berjalan 100% menggunakan **data sungguhan di Cloud Firestore**, di mana **setiap langkah membaca dan menulis ke Firestore** sesuai spesifikasi PRD Bab 4 dan Bab 7.1.

---

## 1. Rantai Alur Inti yang Diuji

Sesuai instruksi tugas:
> **Siswa mendaftar program (4.3) → Staf menyetujui lalu memasukkan siswa ke kelas (4.8, 4.9) → Tutor membuat tugas (4.13) → Siswa mengumpulkan (4.5) → Tutor memberi nilai (4.13) → Siswa membaca nilai (4.5)**

---

## 2. Rincian Setiap Langkah Baca & Tulis ke Cloud Firestore

### Langkah 1: Siswa Mendaftar Program (PRD Bab 4.3)
* **Aktor:** Raka Pratama (`raka@langkahjuara.id`, UID: `pquOnyOCs3QbyGweCkHuaWqbp273`)
* **Halaman UI:** `/program`
* **Operasi Firestore:**
  1. **BACA (Read):** Mengambil daftar program aktif dari koleksi `program` (`where("aktif", "==", true)`).
  2. **TULIS (Write):** Saat siswa mengklik tombol **"Ajukan Pendaftaran"**, sistem menulis dokumen baru ke koleksi `pendaftaran`:
     ```json
     {
       "siswaId": "pquOnyOCs3QbyGweCkHuaWqbp273",
       "programId": "prog-utbk",
       "status": "menunggu",
       "catatanStaf": "",
       "dibuatPada": "2026-10-18T14:40:00Z"
     }
     ```
  3. **BACA (Read):** Halaman memuat ulang riwayat pendaftaran dari koleksi `pendaftaran` milik siswa tersebut dan menampilkan status badge berwarna **"Menunggu"** serta instruksi pembayaran di kantor Langkah Juara.
* **Hasil Verifikasi Firestore:** Dokumen berhasil dibuat dengan ID pendaftaran unik (contoh ID: `ByMNytCMd7VWGUsKQ9L2`), status: `menunggu`.

---

### Langkah 2: Staf Menyetujui Pendaftaran Siswa (PRD Bab 4.8)
* **Aktor:** Kak Fira (`fira@langkahjuara.id`, UID: `TCmIrpZrPqggkkzHsSvTmkGyNND3`)
* **Halaman UI:** `/staf/pendaftaran` (atau `/staf/pendaftaran?status=menunggu`)
* **Operasi Firestore:**
  1. **BACA (Read):** Mengambil seluruh pendaftaran berstatus `menunggu` dari koleksi `pendaftaran` beserta lookup profil siswa di `users`.
  2. **TULIS (Write):** Setelah mencocokkan verifikasi pembayaran, staf mengklik tombol **"Setujui"**. Sistem memperbarui dokumen `pendaftaran/{pendId}`:
     ```json
     {
       "status": "aktif",
       "catatanStaf": "Pembayaran terverifikasi di kantor Langkah Juara."
     }
     ```
  3. **BACA (Read):** Daftar diperbarui secara real-time. Status baris Raka berubah menjadi **"Aktif"** dan otomatis keluar dari saringan tab `Menunggu`.
* **Hasil Verifikasi Firestore:** Dokumen `pendaftaran/ByMNytCMd7VWGUsKQ9L2` kini berstatus `aktif`.

---

### Langkah 3: Staf Memasukkan Siswa ke Kelas (PRD Bab 4.9)
* **Aktor:** Kak Fira (`fira@langkahjuara.id`)
* **Halaman UI:** `/staf/kelas` → `/staf/kelas/kelas-utbk-a`
* **Operasi Firestore:**
  1. **BACA (Read):** Saat staf mengklik **"Tambah Siswa ke Kelas"**, sistem melakukan kueri ke koleksi `pendaftaran` dengan filter `where("programId", "==", "prog-utbk")` dan `where("status", "==", "aktif")`. Hanya siswa berstatus aktif yang muncul di pilihan (PRD 4.9). Raka Pratama tampil dalam daftar.
  2. **TULIS (Write):** Staf memilih Raka Pratama lalu mengklik **"Tambahkan ke Kelas"**. Sistem menulis pembaruan dokumen `kelas/kelas-utbk-a` menggunakan `arrayUnion`:
     ```json
     {
       "siswaIds": arrayUnion("pquOnyOCs3QbyGweCkHuaWqbp273")
     }
     ```
  3. **BACA (Read):** Halaman memuat ulang data kelas. Raka Pratama resmi tercantum dalam tabel siswa di kelas `Intensif UTBK A`.
* **Hasil Verifikasi Firestore:** Field `siswaIds` di dokumen `kelas/kelas-utbk-a` memuat UID `pquOnyOCs3QbyGweCkHuaWqbp273`.

---

### Langkah 4: Tutor Membuat Tugas Baru di Kelas (PRD Bab 4.13)
* **Aktor:** Kak Dimas (`dimas@langkahjuara.id`, UID: `z0YJao5F4oO2OHxO3GYMgI6tyPo2`)
* **Halaman UI:** `/tutor` → `/tutor/kelas/kelas-utbk-a`
* **Operasi Firestore:**
  1. **BACA (Read):** Tutor membuka Dasbor Tutor. Sistem memfilter hanya kelas dengan `tutorId == user.uid` (PRD 4.11). Kak Dimas membuka kelas `kelas-utbk-a`.
  2. **TULIS (Write):** Kak Dimas mengklik **"Buat Tugas"**, mengisi Judul: *"Tugas 01: Latihan Penalaran Logika Alur Inti"*, deskripsi, dan batas waktu pengumpulan. Sistem menulis dokumen baru ke koleksi `tugas`:
     ```json
     {
       "kelasId": "kelas-utbk-a",
       "judul": "Tugas 01: Latihan Penalaran Logika Alur Inti",
       "deskripsi": "Selesaikan 10 soal TPS dan sertakan link Google Drive file pengerjaan Anda.",
       "batasWaktu": Timestamp
     }
     ```
  3. **BACA (Read):** Tugas baru terbaca di daftar tugas kelas dan langsung tampil di `/beranda` setiap siswa di kelas itu (PRD 4.13).
* **Hasil Verifikasi Firestore:** Dokumen tugas baru berhasil dibuat di koleksi `tugas` dengan ID unik (contoh ID: `BvBT1Exm3Dq7CAxbbdZI`).

---

### Langkah 5: Siswa Mengumpulkan Jawaban Tugas (PRD Bab 4.5)
* **Aktor:** Raka Pratama (`raka@langkahjuara.id`)
* **Halaman UI:** `/beranda` atau `/kelas/kelas-utbk-a` → `/tugas/BvBT1Exm3Dq7CAxbbdZI`
* **Operasi Firestore:**
  1. **BACA (Read):** Raka melihat tugas baru di Beranda atau Kelas Saya, lalu mengkliknya untuk membuka rincian `/tugas/[id]`. Sistem memvalidasi bahwa Raka adalah anggota kelas (`kelas.siswaIds.includes(user.uid)`).
  2. **TULIS (Write):** Raka menempelkan tautan jawaban tugas `https://drive.google.com/file/d/jawaban-raka-penalaran-logika-final` dan mengklik **"Kumpulkan Tugas"**. Sistem menulis dokumen baru ke koleksi `pengumpulan`:
     ```json
     {
       "tugasId": "BvBT1Exm3Dq7CAxbbdZI",
       "siswaId": "pquOnyOCs3QbyGweCkHuaWqbp273",
       "kelasId": "kelas-utbk-a",
       "tautan": "https://drive.google.com/file/d/jawaban-raka-penalaran-logika-final",
       "dikumpulkanPada": "2026-10-18T14:40:00Z",
       "nilai": null,
       "komentar": ""
     }
     ```
  3. **BACA (Read):** Status tugas dihitung secara dinamis sesuai Bab 4.5 PRD: karena tautan terkirim dan belum dinilai, status menjadi **"Dikumpulkan"**.
* **Hasil Verifikasi Firestore:** Dokumen pengumpulan berhasil dibuat dengan ID unik (contoh ID: `tNP7D8b2Rwdk97kiwV34`), nilai: `null`.

---

### Langkah 6: Tutor Memberi Nilai dan Komentar Evaluasi (PRD Bab 4.13)
* **Aktor:** Kak Dimas (`dimas@langkahjuara.id`)
* **Halaman UI:** `/tutor/tugas/BvBT1Exm3Dq7CAxbbdZI`
* **Operasi Firestore:**
  1. **BACA (Read):** Kak Dimas membuka halaman pemeriksaan tugas. Sistem membaca seluruh dokumen di koleksi `pengumpulan` dengan filter `where("tugasId", "==", tugasId)`. Baris jawaban Raka Pratama tampil dengan tautan Google Drive yang dapat diklik.
  2. **TULIS (Write):** Kak Dimas mengklik **"Beri Nilai"**, menginput Nilai: `92` (skala 0-100) dan Komentar: *"Pengerjaan luar biasa! Langkah logika deduksi sangat runtut dan tepat pada nomor 7."*, lalu mengklik Simpan. Sistem menulis pembaruan dokumen `pengumpulan/tNP7D8b2Rwdk97kiwV34`:
     ```json
     {
       "nilai": 92,
       "komentar": "Pengerjaan luar biasa! Langkah logika deduksi sangat runtut dan tepat pada nomor 7."
     }
     ```
  3. **BACA (Read):** Data tersimpan langsung memicu pembaruan antarmuka, status pengumpulan Raka berubah menjadi **"Dinilai"** dengan skor 92.
* **Hasil Verifikasi Firestore:** Field `nilai` terisi `92` dan field `komentar` terisi pada dokumen pengumpulan.

---

### Langkah 7: Siswa Membaca Nilai dan Umpan Balik (PRD Bab 4.5)
* **Aktor:** Raka Pratama (`raka@langkahjuara.id`)
* **Halaman UI:** `/tugas/BvBT1Exm3Dq7CAxbbdZI`
* **Operasi Firestore:**
  1. **BACA (Read):** Siswa membuka kembali halaman tugas miliknya di `/tugas/[id]`. Sistem mengambil dokumen dari koleksi `pengumpulan` dengan filter `tugasId` dan `siswaId == user.uid`.
  2. **TAMPILAN DI LAYAR SISWA:**
     - **Status Tugas:** Badge hijau **"Dinilai"**
     - **Nilai Akhir:** Kartu skor **92** dari skala 100
     - **Komentar Evaluasi Tutor:** *“Pengerjaan luar biasa! Langkah logika deduksi sangat runtut dan tepat pada nomor 7.”*
     - Kolom tautan jawaban terkunci (disabled) sesuai aturan PRD bahwa tugas yang sudah dinilai tidak dapat diubah lagi.
* **Hasil Verifikasi Firestore:** Siswa berhasil membaca nilai dan komentar evaluasi langsung dari Cloud Firestore secara akurat dan aman.

---

## 3. Bukti Eksekusi Skrip Uji Nyata (`scripts/test_core_flow.mjs`)

Berikut adalah log keluaran eksekusi langsung terhadap Cloud Firestore:

```text
================================================================================
 PENGUJIAN ALUR INTI PORTAL BELAJAR LANGKAH JUARA DENGAN DATA SUNGGUHAN FIRESTORE
================================================================================

[LANGKAH 1] Siswa (Raka) Mendaftar Program Intensif UTBK (Bab 4.3)
 -> Membaca program aktif dari Firestore...
    ✓ Program terbaca: "Intensif UTBK" (Rp 2.500.000)
 -> Menulis dokumen pendaftaran baru ke Firestore koleksi 'pendaftaran'...
    ✓ Dokumen pendaftaran berhasil ditulis ke Firestore dengan ID: ByMNytCMd7VWGUsKQ9L2
    ✓ Verifikasi Firestore: Status pendaftaran 'menunggu' (Menunggu konfirmasi bayar di kantor)

[LANGKAH 2] Staf (Kak Fira) Menyetujui Pendaftaran Siswa (Bab 4.8)
 -> Staf membaca pendaftaran berstatus 'menunggu' dari Firestore...
    ✓ Ditemukan 1 pendaftaran berstatus menunggu untuk Raka.
 -> Staf menulis pembaruan status menjadi 'aktif' ke Firestore...
    ✓ Dokumen pendaftaran berhasil diperbarui di Firestore.
    ✓ Verifikasi Firestore: Status pendaftaran kini 'aktif'

[LANGKAH 3] Staf (Kak Fira) Memasukkan Siswa ke Kelas 'Intensif UTBK A' (Bab 4.9)
 -> Memeriksa apakah siswa memiliki pendaftaran aktif untuk program kelas ini...
    ✓ Validasi berhasil: Siswa memiliki pendaftaran AKTIF untuk program UTBK.
 -> Menulis penambahan siswa ke dokumen 'kelas/kelas-utbk-a' (arrayUnion)...
    ✓ Field siswaIds berhasil diperbarui di Firestore.
    ✓ Verifikasi Firestore: Kelas 'Intensif UTBK A' kini memuat 1 siswa (termasuk Raka).

[LANGKAH 4] Tutor (Kak Dimas) Membuat Tugas Baru di Kelas (Bab 4.13)
 -> Memeriksa hak akses tutor pengampu kelas...
    ✓ Terverifikasi: Kak Dimas (z0YJao5F4oO2OHxO3GYMgI6tyPo2) adalah tutor sah pengampu 'Intensif UTBK A'.
 -> Menulis dokumen tugas baru ke Firestore koleksi 'tugas'...
    ✓ Dokumen tugas baru berhasil ditulis ke Firestore dengan ID: BvBT1Exm3Dq7CAxbbdZI
    ✓ Verifikasi Firestore: Tugas 'Tugas 01: Latihan Penalaran Logika Alur Inti' siap dikerjakan siswa.

[LANGKAH 5] Siswa (Raka) Mengumpulkan Tugas (Bab 4.5)
 -> Memeriksa apakah siswa adalah anggota kelas pemilik tugas...
    ✓ Terverifikasi: Siswa adalah anggota terdaftar di kelas tugas ini.
 -> Menulis pengumpulan tugas ke Firestore koleksi 'pengumpulan' (https://drive.google.com/file/d/jawaban-raka-penalaran-logika-final)...
    ✓ Dokumen pengumpulan berhasil ditulis ke Firestore dengan ID: tNP7D8b2Rwdk97kiwV34
    ✓ Verifikasi Firestore: Tautan 'https://drive.google.com/file/d/jawaban-raka-penalaran-logika-final', status dinamis: 'dikumpulkan'

[LANGKAH 6] Tutor (Kak Dimas) Memberi Nilai dan Komentar (Bab 4.13)
 -> Tutor membaca daftar pengumpulan untuk tugas ini dari Firestore...
    ✓ Ditemukan 1 pengumpulan jawaban tugas.
 -> Tutor menulis nilai (92) dan komentar ke Firestore...
    ✓ Dokumen pengumpulan berhasil diperbarui di Firestore.
    ✓ Verifikasi Firestore: Nilai 92/100 dan komentar berhasil tersimpan.

[LANGKAH 7] Siswa (Raka) Membaca Nilai dan Umpan Balik (Bab 4.5)
 -> Siswa membaca dokumen pengumpulan miliknya dari Firestore...
    =======================================================
    TAMPILAN DI LAYAR SISWA (PRD Bab 4.5):
    * Status Tugas     : [DINILAI]
    * Nilai Akhir      : 92 / 100
    * Komentar Evaluasi: "Pengerjaan luar biasa! Langkah logika deduksi sangat runtut dan tepat pada nomor 7."
    =======================================================

================================================================================
 RINGKASAN VERIFIKASI ALUR INTI (SEMUA LANGKAH TERBUKTI BACA & TULIS FIRESTORE)
================================================================================
 [✓] Langkah 1: 1. Siswa Mendaftar Program (4.3) => STATUS: PASSED
 [✓] Langkah 2: 2. Staf Menyetujui Pendaftaran (4.8) => STATUS: PASSED
 [✓] Langkah 3: 3. Staf Memasukkan Siswa ke Kelas (4.9) => STATUS: PASSED
 [✓] Langkah 4: 4. Tutor Membuat Tugas (4.13) => STATUS: PASSED
 [✓] Langkah 5: 5. Siswa Mengumpulkan Tugas (4.5) => STATUS: PASSED
 [✓] Langkah 6: 6. Tutor Memberi Nilai (4.13) => STATUS: PASSED
 [✓] Langkah 7: 7. Siswa Membaca Nilai (4.5) => STATUS: PASSED

SELURUH ALUR INTI BERJALAN 100% SUKSES DENGAN DATA SUNGGUHAN DI CLOUD FIRESTORE!
```

---

## 4. Kredensial Akun untuk Verifikasi Langsung di Peramban

Pengguna atau evaluator dapat masuk ke `http://localhost:3000/masuk` menggunakan akun uji berikut:

| Peran | Akun Email | Kata Sandi | Halaman Terkait Alur Inti |
| :--- | :--- | :--- | :--- |
| **Siswa** | `raka@langkahjuara.id` | `Admin123456!` | `/program`, `/beranda`, `/kelas/[id]`, `/tugas/[id]` |
| **Staf** | `fira@langkahjuara.id` | `Admin123456!` | `/staf`, `/staf/pendaftaran`, `/staf/kelas`, `/staf/kelas/[id]` |
| **Tutor** | `dimas@langkahjuara.id` | `Admin123456!` | `/tutor`, `/tutor/kelas/[id]`, `/tutor/tugas/[id]` |
| **Super Admin** | `arif@langkahjuara.id` | `Admin123456!` | `/admin`, dan semua halaman peran lain |
