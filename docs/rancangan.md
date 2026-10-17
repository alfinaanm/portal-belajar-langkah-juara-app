# Rancangan Awal Portal Belajar Langkah Juara
**Tahap 1: Rancang Dulu**

Dokumen ini disusun berdasarkan Product Requirements Document (PRD) Portal Belajar Langkah Juara (Bab 2, Bab 3, dan Bab 4) sebagai fondasi arsitektur hak akses, rute halaman, dan keputusan aturan bisnis aplikasi sebelum implementasi kode.

---

## 1. Daftar Fitur (Bab 4 PRD)

Berikut adalah daftar fitur fungsional yang diturunkan dari Bab 4 PRD:

### 4.1 Daftar dan Masuk
1. **Pendaftaran Akun Baru (4.1):** Siswa mendaftar dengan Nama, Email, dan Kata sandi, atau opsi Masuk dengan Google. Akun otomatis mendapatkan peran `siswa`.
2. **Masuk Akun / Otentikasi (4.1):** Pengguna masuk dengan email & kata sandi atau Google. Sistem membaca peran dan mengarahkan otomatis ke dasbor masing-masing peran.

### 4.2 Beranda
3. **Melihat Jadwal Kelas Berikutnya (4.2):** Siswa melihat jadwal kelas mendatang terdekat (nama kelas, hari, jam, ruang/tautan).
4. **Melihat Tugas Belum Dikumpulkan (4.2):** Siswa melihat daftar tugas aktif miliknya yang belum diserahkan, diurutkan dari batas waktu terdekat.

### 4.3 Program
5. **Melihat Daftar Program Aktif (4.3):** Siswa melihat kartu program aktif (nama, jenjang, jumlah pertemuan, harga).
6. **Mengajukan Pendaftaran Program (4.3):** Siswa mengajukan keikutsertaan program (status awal: `menunggu`).
7. **Melihat Status Pendaftaran Saya (4.3):** Siswa memantau status pendaftaran (`menunggu`, `aktif`, `ditolak`) beserta catatan staf jika ditolak.

### 4.4 Kelas Saya
8. **Melihat Daftar Kelas yang Diikuti (4.4):** Siswa melihat kartu kelas tempat ia terdaftar.
9. **Melihat Rincian Pertemuan & Materi (4.4):** Siswa melihat jadwal, daftar pertemuan, topik, dan tautan materi kelasnya.
10. **Melihat Daftar Tugas Kelas (4.4):** Siswa melihat tugas-tugas di dalam kelas tersebut.

### 4.5 Tugas
11. **Mengumpulkan Tugas (4.5):** Siswa menyerahkan tautan jawaban tugas (misal Google Drive) sebelum batas waktu.
12. **Melihat Nilai dan Komentar Tugas (4.5):** Siswa melihat hasil penilaian dan umpan balik dari tutor pengampu setelah dinilai.

### 4.6 Profil
13. **Melihat Data Profil Diri (4.6):** Menampilkan nama, email, nomor HP, nomor HP orang tua, dan peran.
14. **Memperbarui Data Profil Diri (4.6):** Siswa dapat mengubah nama, nomor HP, dan nomor HP orang tua. Peran lain dapat mengubah nama dan nomor HP.

### 4.7 Dasbor Staf
15. **Melihat Ringkasan Operasional Staf (4.7):** Staf memantau metrik pendaftaran menunggu konfirmasi dan daftar kelas hari ini.

### 4.8 Pendaftaran
16. **Melihat dan Menyaring Pendaftaran Siswa (4.8):** Staf melihat daftar pengajuan pendaftaran dengan filter status (`Semua`, `Menunggu`, `Aktif`, `Ditolak`).
17. **Memutuskan Pendaftaran Siswa (4.8):** Staf menyetujui (`aktif`) setelah verifikasi pembayaran di luar aplikasi, atau menolak (`ditolak`) dengan menyertakan Catatan Staf.

### 4.9 Kelola Kelas
18. **Melihat Daftar Kelas Bimbel (4.9):** Staf melihat seluruh kelas, program terkait, tutor pengampu, jadwal, dan kuantitas siswa.
19. **Membuat Kelas Baru (4.9):** Staf membuat kelas baru, menentukan program, memilih tutor, jadwal (hari & jam), serta tempat.
20. **Memasukkan Siswa ke Kelas (4.9):** Staf memasukkan siswa yang memiliki status pendaftaran aktif pada program tersebut ke dalam kelas.

### 4.10 Data Siswa
21. **Melihat Data Kontak Siswa & Orang Tua (4.10):** Staf melihat daftar siswa terdaftar beserta nomor HP orang tua untuk keperluan komunikasi presensi/kendala (hanya baca, tanpa akses nilai).

### 4.11 Dasbor Tutor
22. **Melihat Ringkasan Dasbor Tutor (4.11):** Tutor melihat jadwal kelas yang ia ampu hari ini dan daftar seluruh kelas yang ia ajar.

### 4.12 Kelas yang Diajar
23. **Melihat Rincian Kelas yang Diajar (4.12):** Tutor melihat rincian siswa, pertemuan, dan tugas pada kelas yang ia ajar.
24. **Membuat Pertemuan & Tautan Materi (4.12):** Tutor menjadwalkan pertemuan baru, topik bahasan, dan menyematkan tautan materi ajar.
25. **Mengisi Presensi Siswa (4.12):** Tutor mencentang kehadiran siswa pada setiap pertemuan dan menyimpannya.

### 4.13 Tugas dan Nilai
26. **Membuat Tugas Baru (4.13):** Tutor membuat tugas baru untuk kelasnya lengkap dengan deskripsi dan batas waktu pengumpulan.
27. **Memeriksa Jawaban Tugas Siswa (4.13):** Tutor membuka daftar pengumpulan tugas siswa dan mengakses tautan pengerjaan siswa.
28. **Memberikan Nilai dan Komentar Tugas (4.13):** Tutor menginput nilai (skala 0–100) dan catatan evaluasi untuk siswa.

### 4.14 Dasbor Admin
29. **Melihat Metrik Utama Bimbel (4.14):** Super Admin melihat ringkasan siswa aktif, pendaftaran bulan berjalan, dan rata-rata kehadiran secara real-time.

### 4.15 Kelola Pengguna
30. **Melihat Daftar Seluruh Pengguna (4.15):** Super Admin melihat semua pengguna terdaftar dengan pencarian nama dan filter peran.
31. **Mengubah Peran Pengguna (4.15):** Super Admin menetapkan peran pengguna (`siswa`, `staf`, `tutor`, `super_admin`).
32. **Mengelola Status Aktif Akun (4.15):** Super Admin dapat mengaktifkan atau menonaktifkan akun pengguna.

### 4.16 Program (Admin)
33. **Melihat Seluruh Program (4.16):** Super Admin melihat master data program bimbel.
34. **Menambah & Mengatur Status Program (4.16):** Super Admin menambah program baru (nama, jenjang SMP/SMA, jumlah pertemuan, biaya) serta mengaktifkan/menonaktifkannya.

### 4.17 Laporan
35. **Melihat Rekapitulasi Bulanan (4.17):** Super Admin melihat laporan rekap siswa aktif per program, rekap kehadiran per kelas, dan rekap beban mengajar per tutor berdasarkan bulan yang dipilih.

---

## 2. Matriks Akses Pengguna

Keterangan:
- **Pengunjung:** Pengguna yang belum masuk / belum punya akun.
- **Pelanggan:** `siswa`
- **Staf depan:** `staf`
- **Tenaga ahli:** `tutor`
- **Super Admin:** `super_admin`
- **Tanda Simbol:**
  - `✓` : Akses penuh / diizinkan
  - `✕` : Akses ditolak / menu tidak tampil
  - `✓ milik sendiri` : Hanya dapat mengakses/melihat/mengubah data milik akunnya sendiri
  - `✓ kelas diajar` : Hanya dapat mengakses/mengelola kelas dan tugas yang ia ampu sendiri

| Fitur (subbab PRD) | Pengunjung | Pelanggan (Siswa) | Staf depan (Staf) | Tenaga ahli (Tutor) | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Daftar Akun Baru (4.1)** | ✓ | ✕ | ✕ | ✕ | ✕ |
| **Masuk Akun (4.1)** | ✓ | ✕ | ✕ | ✕ | ✕ |
| **Melihat Beranda Siswa (4.2)** | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| **Melihat Program Aktif (4.3)** | ✕ | ✓ | ✕ | ✕ | ✓ |
| **Mengajukan Pendaftaran Program (4.3)** | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| **Melihat Status Pendaftaran Saya (4.3)** | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| **Melihat Daftar & Rincian Kelas Saya (4.4)** | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| **Mengumpulkan Tugas Siswa (4.5)** | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| **Melihat Nilai & Komentar Tugas (4.5)** | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| **Melihat Profil Sendiri (4.6)** | ✕ | ✓ milik sendiri | ✓ milik sendiri | ✓ milik sendiri | ✓ milik sendiri |
| **Mengubah Profil Sendiri (4.6)** | ✕ | ✓ milik sendiri | ✓ milik sendiri | ✓ milik sendiri | ✓ milik sendiri |
| **Melihat Dasbor Staf (4.7)** | ✕ | ✕ | ✓ | ✕ | ✓ |
| **Melihat & Menyaring Pendaftaran Siswa (4.8)** | ✕ | ✕ | ✓ | ✕ | ✓ |
| **Menyetujui / Menolak Pendaftaran Siswa (4.8)** | ✕ | ✕ | ✓ | ✕ | ✓ |
| **Melihat & Mengelola Kelas (4.9)** | ✕ | ✕ | ✓ | ✕ | ✓ |
| **Memasukkan Siswa ke Kelas (4.9)** | ✕ | ✕ | ✓ | ✕ | ✓ |
| **Melihat Data Siswa & Kontak Ortu (4.10)** | ✕ | ✕ | ✓ | ✕ | ✓ |
| **Melihat Dasbor Tutor (4.11)** | ✕ | ✕ | ✕ | ✓ kelas diajar | ✓ |
| **Melihat Rincian Kelas yang Diajar (4.12)** | ✕ | ✕ | ✕ | ✓ kelas diajar | ✓ |
| **Membuat Pertemuan & Materi (4.12)** | ✕ | ✕ | ✕ | ✓ kelas diajar | ✓ |
| **Mengisi Presensi Pertemuan (4.12)** | ✕ | ✕ | ✕ | ✓ kelas diajar | ✓ |
| **Membuat Tugas Kelas (4.13)** | ✕ | ✕ | ✕ | ✓ kelas diajar | ✓ |
| **Melihat Pengumpulan Tugas Siswa (4.13)** | ✕ | ✕ | ✕ | ✓ kelas diajar | ✓ |
| **Memberi Nilai & Komentar Tugas (4.13)** | ✕ | ✕ | ✕ | ✓ kelas diajar | ✓ |
| **Melihat Dasbor Admin (4.14)** | ✕ | ✕ | ✕ | ✕ | ✓ |
| **Melihat & Mencari Pengguna (4.15)** | ✕ | ✕ | ✕ | ✕ | ✓ |
| **Mengubah Peran & Status Akun (4.15)** | ✕ | ✕ | ✕ | ✕ | ✓ |
| **Mengelola Master Program Bimbel (4.16)** | ✕ | ✕ | ✕ | ✕ | ✓ |
| **Melihat Laporan Rekapitulasi Bulanan (4.17)** | ✕ | ✕ | ✕ | ✕ | ✓ |

---

## 3. Peta Route Halaman

Sesuai spesifikasi Bab 4 dan Bab 6.2 PRD, semua halaman dilindungi oleh Route Guard. Jika pengguna belum masuk (`unauthenticated`), mereka akan diarahkan ke `/masuk` (dan dikembalikan ke rute tujuan setelah login). Jika peran yang masuk tidak memiliki izin, aplikasi akan menampilkan halaman **Akses Ditolak**.

| Halaman | Alamat | Peran yang boleh membuka | Belum masuk | Peran lain |
| :--- | :--- | :--- | :--- | :--- |
| **Daftar Akun** | `/daftar` | Publik (Pengunjung) | Boleh buka | Diarahkan ke dasbor perannya |
| **Masuk Akun** | `/masuk` | Publik (Pengunjung) | Boleh buka | Diarahkan ke dasbor perannya |
| **Beranda Siswa** | `/beranda` | `siswa`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Katalog Program Siswa** | `/program` | `siswa`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Daftar Kelas Siswa** | `/kelas` | `siswa`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Rincian Kelas Siswa** | `/kelas/[id]` | `siswa` (anggota kelas), `super_admin` | ke `/masuk` | Akses Ditolak |
| **Rincian & Kumpul Tugas** | `/tugas/[id]` | `siswa` (anggota kelas), `super_admin` | ke `/masuk` | Akses Ditolak |
| **Profil Pengguna** | `/profil` | `siswa`, `staf`, `tutor`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Dasbor Staf** | `/staf` | `staf`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelola Pendaftaran** | `/staf/pendaftaran` | `staf`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelola Kelas (Daftar)** | `/staf/kelas` | `staf`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelola Kelas (Rincian & Siswa)** | `/staf/kelas/[id]` | `staf`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Data Siswa & Kontak Ortu** | `/staf/siswa` | `staf`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Dasbor Tutor** | `/tutor` | `tutor`, `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelas yang Diajar (Rincian & Presensi)**| `/tutor/kelas/[id]`| `tutor` (pengampu kelas), `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelola Tugas & Penilaian** | `/tutor/tugas/[id]` | `tutor` (pengampu kelas), `super_admin` | ke `/masuk` | Akses Ditolak |
| **Dasbor Super Admin** | `/admin` | `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelola Pengguna (Daftar)** | `/admin/pengguna` | `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelola Pengguna (Ubah Peran/Status)** | `/admin/pengguna/[id]` | `super_admin` | ke `/masuk` | Akses Ditolak |
| **Kelola Master Program** | `/admin/program` | `super_admin` | ke `/masuk` | Akses Ditolak |
| **Laporan Rekapitulasi** | `/admin/laporan` | `super_admin` | ke `/masuk` | Akses Ditolak |

---

## 4. Keputusan Wajib Rancangan

Berikut adalah jawaban atas pertanyaan penentu rancangan untuk Bimbingan Belajar Langkah Juara beserta rujukan subbab PRD:

### 1. Bolehkah staf mengubah nilai tugas?
* **Jawaban:** **TIDAK BOLEH.**
* **Dasar PRD:**
  - **Subbab 2.3 & Tabel 2.4 (Yang tidak boleh dilihat tiap peran):** Pada baris *"Memberi atau mengubah nilai"*, peran Staf secara eksplisit dinyatakan **"Tidak bisa"** (hanya Tutor pengampu kelas bersangkutan dan Super Admin yang bisa). Selain itu pada baris *"Nilai dan jawaban siswa lain"*, bagi Staf dinyatakan **"Tidak tampil"**.
  - **Subbab 4.9 (Kelola Kelas - Validasi):** Ditegaskan bahwa: *"Staf tidak bisa membuat pertemuan, mengisi presensi, atau memberi nilai."*
  - **Subbab 4.10 (Data Siswa - Validasi):** Ditegaskan bahwa: *"Halaman ini hanya untuk membaca. Staf tidak bisa melihat atau mengubah nilai."*
  - **Subbab 6.2 (Penjagaan Halaman dan Data):** Firestore Security Rules secara ketat mengunci field `nilai` dan `komentar` hanya untuk tutor kelas tersebut dan Super Admin.
  - **Subbab 8 (Pengujian):** Uji tembus dengan akun staf mencoba mengubah nilai lewat konsol peramban diuji secara spesifik dan wajib ditolak.

### 2. Bolehkah Kak Dimas membuka kelas Kak Nadia?
* **Jawaban:** **TIDAK BOLEH.**
* **Dasar PRD:**
  - **Subbab 2.4 (Tabel Yang tidak boleh dilihat tiap peran):** Pada baris *"Kelas yang diajar tutor lain"*, hak akses bagi Tutor berstatus **"Tidak tampil"**.
  - **Subbab 4.11 (Dasbor Tutor - Perilaku otomatis):** Ditegaskan bahwa: *"Hanya kelas dengan tutorId sama dengan uid tutor yang masuk yang tampil."*
  - **Subbab 4.12 (Kelas yang Diajar - Validasi):** Dinyatakan dengan jelas: *"Bila Kak Nadia mengganti ID di alamat dengan kelas Kak Dimas, tampil Akses Ditolak."* (Begitu juga sebaliknya, Kak Dimas tidak berhak mengakses kelas Kak Nadia).
  - **Subbab 8 (Pengujian):** Uji tembus pengujian mencakup: *"Dengan akun tutor membuka kelas yang diajar tutor lain ... harus ditolak."*

### 3. Bolehkah Raka melihat nilai Salsa?
* **Jawaban:** **TIDAK BOLEH.**
* **Dasar PRD:**
  - **Subbab 1 (Ringkasan Eksekutif):** Menegaskan prinsip: *"Nilai tetap pribadi. Siswa hanya bisa membuka nilai miliknya sendiri, termasuk bila alamat halaman diubah."*
  - **Subbab 2.4 (Tabel Yang tidak boleh dilihat tiap peran):** Pada baris *"Nilai dan jawaban siswa lain"*, hak akses bagi Siswa secara tegas bertuliskan **"Tidak tampil"**.
  - **Subbab 4.5 (Tugas - Validasi):** Siswa hanya dapat mengakses dokumen pengumpulan miliknya sendiri. Jika mencoba membuka ID pengumpulan atau rincian tugas di luar kelasnya, sistem menampilkan *"Tugas tidak ditemukan"*.
  - **Subbab 6.2 (Penjagaan Halaman dan Data):** Security Rules Firestore memvalidasi kepemilikan dokumen pengumpulan melalui `siswaId == request.auth.uid`.
  - **Subbab 8 (Pengujian):** Skenario uji tembus: *"Membaca nilai siswa lain lewat konsol peramban ... harus ditolak."*

### 4. Halaman mana saja yang boleh dibuka Pak Arif?
* **Jawaban:** **SEMUA HALAMAN aplikasi boleh dibuka oleh Pak Arif (selaku Super Admin).**
* Pak Arif memiliki akses penuh tanpa batasan ke seluruh tingkatan halaman:
  1. **Halaman Publik / Autentikasi:** `/daftar`, `/masuk`
  2. **Halaman Siswa:** `/beranda`, `/program`, `/kelas`, `/kelas/[id]`, `/tugas/[id]`
  3. **Halaman Profil Akun:** `/profil`
  4. **Halaman Staf:** `/staf`, `/staf/pendaftaran`, `/staf/kelas`, `/staf/kelas/[id]`, `/staf/siswa`
  5. **Halaman Tutor:** `/tutor`, `/tutor/kelas/[id]`, `/tutor/tugas/[id]`
  6. **Halaman Khusus Super Admin:** `/admin`, `/admin/pengguna`, `/admin/pengguna/[id]`, `/admin/program`, `/admin/laporan`
* **Dasar PRD:**
  - **Subbab 2.1 (Empat pemegang akun):** *"Super Admin: Pemilik bimbel, Pak Arif. Membuka semua halaman peran lain, ditambah mengelola pengguna, program, dan laporan."*
  - **Subbab 2.3 (Hak akses per modul):** Pada kolom Super Admin, seluruh modul bertuliskan **"Penuh"** (termasuk Beranda, Kelas Saya, Tugas, Program, Dasbor Staf, Kelola Kelas, Dasbor Tutor, Kelas yang Diajar, Tugas & Nilai, Dasbor Admin, Program, Laporan, dan Kelola Pengguna).
  - **Subbab 3.1 (Peta Modul):** Menyatakan *"Super Admin (semua menu Siswa, Staf, dan Tutor, ditambah) Dasbor Admin, Kelola Pengguna, Program, Laporan"*.
  - **Subbab 4.14 (Dasbor Admin):** *"Super Admin juga melihat semua menu Staf, Tutor, dan Siswa."*
  - **Subbab 6.2 (Penjagaan Halaman dan Data):** Menegaskan aturan route guard: *"super_admin boleh membuka semua halaman."*
