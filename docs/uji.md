# Tabel Pengujian Hak Akses dan Route Guard

Dokumen ini memuat matriks pengujian hak akses, route guard, dan pengalihan otomatis untuk empat peran pengguna serta pengunjung sesuai dengan **PRD Bab 2.1, 2.2, 4.1, 6.2** dan **rancangan.md Bab 3, 4.4**.

---

## 1. Daftar Akun Uji

Pengujian dilakukan menggunakan empat akun uji yang telah terdaftar di Firebase Authentication dan tersimpan di koleksi Cloud Firestore `users/{uid}`:

| No | Peran (Role) | Email Akun Uji | Kata Sandi | Dokumen Firestore `users/{uid}` |
|:--:|:---|:---|:---|:---|
| 1 | **Pengunjung** | *(Belum masuk / Sesi Anonim)* | - | - |
| 2 | **Pelanggan** (`siswa`) | `raka@langkahjuara.id` | `Admin123456!` | UID: `pquOnyOCs3QbyGweCkHuaWqbp273`<br>role: `"siswa"` |
| 3 | **Staf Depan** (`staf`) | `fira@langkahjuara.id` | `Admin123456!` | UID: `TCmIrpZrPqggkkzHsSvTmkGyNND3`<br>role: `"staf"` |
| 4 | **Tenaga Ahli** (`tutor`) | `dimas@langkahjuara.id` | `Admin123456!` | UID: `z0YJao5F4oO2OHxO3GYMgI6tyPo2`<br>role: `"tutor"` |
| 5 | **Super Admin** (`super_admin`) | `arif@langkahjuara.id` | `Admin123456!` | UID: `YpC7uUD9KbOgRZY5M0TKla1VXaY2`<br>role: `"super_admin"` |

---

## 2. Kelompok Halaman yang Diuji

Sesuai peta route pada rancangan aplikasi, empat kelompok halaman yang diproteksi adalah:
1. **Kelompok Pelanggan**: `/beranda` (serta `/program`, `/kelas`, `/tugas`, `/profil`) — Izin: `siswa`, `super_admin`
2. **Kelompok Staf Depan**: `/staf` — Izin: `staf`, `super_admin`
3. **Kelompok Tenaga Ahli**: `/tutor` — Izin: `tutor`, `super_admin`
4. **Kelompok Admin**: `/admin`, `/admin/pengguna` — Izin: `super_admin`

---

## 3. Tabel Uji Hak Akses (Minimal 16 Baris + Pengunjung + Muat Ulang + Pengalihan)

Berikut adalah tabel uji lengkap dengan mengetikkan alamat URL langsung di kolom alamat peramban (browser):

| No | Akun | Yang dilakukan | Hasil yang benar | Lolos? |
|:--:|:---|:---|:---|:--:|
| 1 | Belum masuk | Buka `/beranda` di browser | Dialihkan ke `/masuk` | [x] |
| 2 | Belum masuk | Ketik `/staf` di browser | Dialihkan ke `/masuk` | [x] |
| 3 | Belum masuk | Ketik `/tutor` di browser | Dialihkan ke `/masuk` | [x] |
| 4 | Belum masuk | Ketik `/admin` di browser | Dialihkan ke `/masuk` | [x] |
| 5 | Pelanggan | Buka `/beranda` di browser | Halaman terbuka (Dashboard Belajar Siswa) | [x] |
| 6 | Pelanggan | Ketik `/staf` di browser | Muncul Akses Ditolak | [x] |
| 7 | Pelanggan | Ketik `/tutor` di browser | Muncul Akses Ditolak | [x] |
| 8 | Pelanggan | Ketik `/admin` di browser | Muncul Akses Ditolak | [x] |
| 9 | Staf Depan | Ketik `/beranda` di browser | Muncul Akses Ditolak | [x] |
| 10 | Staf Depan | Buka `/staf` di browser | Halaman terbuka (Portal Operasional Staf) | [x] |
| 11 | Staf Depan | Ketik `/tutor` di browser | Muncul Akses Ditolak | [x] |
| 12 | Staf Depan | Ketik `/admin` di browser | Muncul Akses Ditolak | [x] |
| 13 | Tenaga Ahli | Ketik `/beranda` di browser | Muncul Akses Ditolak | [x] |
| 14 | Tenaga Ahli | Ketik `/staf` di browser | Muncul Akses Ditolak | [x] |
| 15 | Tenaga Ahli | Buka `/tutor` di browser | Halaman terbuka (Portal Tutor & Pengajar) | [x] |
| 16 | Tenaga Ahli | Ketik `/admin` di browser | Muncul Akses Ditolak | [x] |
| 17 | Super Admin | Buka `/beranda` (kelompok pelanggan) | Halaman terbuka | [x] |
| 18 | Super Admin | Buka `/staf` (kelompok staf depan) | Halaman terbuka | [x] |
| 19 | Super Admin | Buka `/tutor` (halaman tenaga ahli) | Halaman terbuka | [x] |
| 20 | Super Admin | Buka `/admin` (kelompok admin) | Halaman terbuka (Dashboard Admin & Kelola Pengguna) | [x] |

---

## 4. Uji Muat Ulang Halaman (Page Refresh / Reload) untuk Setiap Peran

Uji ketahanan state autentikasi dan pembacaan profil Firestore `users/{uid}` saat pengguna menekan tombol Segarkan (F5 / Ctrl+R) pada peramban:

| No | Akun | Yang dilakukan | Hasil yang benar | Lolos? |
|:--:|:---|:---|:---|:--:|
| 21 | Pelanggan | Buka `/beranda`, lalu tekan Muat Ulang (F5) | Tampil layar "Memuat Hak Akses..." sebentar, lalu halaman `/beranda` tetap terbuka tanpa terlempar ke `/masuk` atau Akses Ditolak | [x] |
| 22 | Staf Depan | Buka `/staf`, lalu tekan Muat Ulang (F5) | Tampil layar "Memuat Hak Akses..." sebentar, lalu halaman `/staf` tetap terbuka tanpa terlempar ke `/masuk` atau Akses Ditolak | [x] |
| 23 | Tenaga Ahli | Buka `/tutor`, lalu tekan Muat Ulang (F5) | Tampil layar "Memuat Hak Akses..." sebentar, lalu halaman `/tutor` tetap terbuka tanpa terlempar ke `/masuk` atau Akses Ditolak | [x] |
| 24 | Super Admin | Buka `/admin/pengguna`, lalu tekan Muat Ulang (F5) | Tampil layar "Memuat Hak Akses..." sebentar, lalu halaman Kelola Pengguna tetap terbuka tanpa terlempar ke `/masuk` atau Akses Ditolak | [x] |

---

## 5. Uji Pengalihan Otomatis Setelah Masuk (PRD Bab 4.1)

Pengujian alur pengalihan rute otomatis segera setelah pengguna menekan tombol "Masuk":

| No | Akun | Yang dilakukan | Hasil yang benar | Lolos? |
|:--:|:---|:---|:---|:--:|
| 25 | Pelanggan | Masuk via `/masuk` dengan `raka@langkahjuara.id` | Otomatis dialihkan ke `/beranda` | [x] |
| 26 | Staf Depan | Masuk via `/masuk` dengan `fira@langkahjuara.id` | Otomatis dialihkan ke `/staf` | [x] |
| 27 | Tenaga Ahli | Masuk via `/masuk` dengan `dimas@langkahjuara.id` | Otomatis dialihkan ke `/tutor` | [x] |
| 28 | Super Admin | Masuk via `/masuk` dengan `arif@langkahjuara.id` | Otomatis dialihkan ke `/admin` | [x] |

---

## 6. Catatan Teknis & Mekanisme Implementasi

1. **Komponen Proteksi (`RouteGuard.js`)**:
   - Selama proses pembacaan role dari Firestore belum selesai (`loading || (user && !userProfile)`), sistem menampilkan indikator putar animasi dengan teks *"Memuat Hak Akses... Sedang membaca profil dan peran pengguna dari Cloud Firestore..."* tanpa mengambil keputusan prematur.
   - Pengunjung yang belum memiliki sesi login terdeteksi (`!loading && !user`), kemudian dialihkan menggunakan `router.replace("/masuk")`.
   - Super Admin (`role === "super_admin"`) memiliki hak bypass universal sesuai aturan PRD sehingga dapat mengakses seluruh rute `/beranda`, `/staf`, `/tutor`, dan `/admin`.
   - Jika peran tidak sesuai dengan `allowedRoles`, layar *"Akses Ditolak"* disajikan dengan informasi peran akun saat ini serta tombol navigasi *"Kembali"* dan *"Ke Halaman Saya"*.
2. **Penyaringan Menu Navigasi (`AppShell.js`)**:
   - Menu samping (Sidebar) hanya menampilkan tautan navigasi yang relevan dengan peran aktif pengguna, sehingga antarmuka tetap bersih dan rapi.
