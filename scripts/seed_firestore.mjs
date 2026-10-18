import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcbQGNJHZxbr8j3edymcqNKgt1pVpWDvI",
  authDomain: "portal-belajar-langkah-j-a82ab.firebaseapp.com",
  projectId: "portal-belajar-langkah-j-a82ab",
  storageBucket: "portal-belajar-langkah-j-a82ab.firebasestorage.app",
  messagingSenderId: "128476094902",
  appId: "1:128476094902:web:3d59d12f421fcacbe12117",
  measurementId: "G-JH3D0V46L7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data seed sesuai Bab 7.1 & Bab 2.1 PRD Tugas Portal Belajar Langkah Juara
const seedData = {
  users: [
    {
      _id: "YpC7uUD9KbOgRZY5M0TKla1VXaY2",
      nama: "Pak Arif",
      email: "arif@langkahjuara.id",
      noHp: "081134567895",
      noHpOrangTua: "",
      role: "super_admin",
      aktif: true,
      dibuatPada: Timestamp.fromDate(new Date("2026-08-01T08:00:00Z")),
    },
    {
      _id: "TCmIrpZrPqggkkzHsSvTmkGyNND3",
      nama: "Kak Fira",
      email: "fira@langkahjuara.id",
      noHp: "085234567892",
      noHpOrangTua: "",
      role: "staf",
      aktif: true,
      dibuatPada: Timestamp.fromDate(new Date("2026-08-15T08:00:00Z")),
    },
    {
      _id: "z0YJao5F4oO2OHxO3GYMgI6tyPo2",
      nama: "Kak Dimas",
      email: "dimas@langkahjuara.id",
      noHp: "087734567893",
      noHpOrangTua: "",
      role: "tutor",
      aktif: true,
      dibuatPada: Timestamp.fromDate(new Date("2026-08-10T08:00:00Z")),
    },
    {
      _id: "tutor-nadia",
      nama: "Kak Nadia",
      email: "nadia@langkahjuara.id",
      noHp: "088834567894",
      noHpOrangTua: "",
      role: "tutor",
      aktif: true,
      dibuatPada: Timestamp.fromDate(new Date("2026-08-12T08:00:00Z")),
    },
    {
      _id: "pquOnyOCs3QbyGweCkHuaWqbp273",
      nama: "Raka Pratama",
      email: "raka@langkahjuara.id",
      noHp: "081234567890",
      noHpOrangTua: "081298765432",
      role: "siswa",
      aktif: true,
      dibuatPada: Timestamp.fromDate(new Date("2026-09-01T08:00:00Z")),
    },
    {
      _id: "siswa-salsa",
      nama: "Salsa Kirana",
      email: "salsa@langkahjuara.id",
      noHp: "082134567891",
      noHpOrangTua: "082198765433",
      role: "siswa",
      aktif: true,
      dibuatPada: Timestamp.fromDate(new Date("2026-09-05T09:30:00Z")),
    },
    {
      _id: "siswa-budi",
      nama: "Budi Santoso",
      email: "budi@langkahjuara.id",
      noHp: "081345678910",
      noHpOrangTua: "081398765434",
      role: "siswa",
      aktif: true,
      dibuatPada: Timestamp.fromDate(new Date("2026-09-10T10:00:00Z")),
    },
  ],

  program: [
    {
      _id: "prog-utbk",
      nama: "Intensif UTBK",
      jenjang: "SMA",
      jumlahPertemuan: 24,
      harga: 2500000,
      aktif: true,
    },
    {
      _id: "prog-mat-smp",
      nama: "Matematika SMP",
      jenjang: "SMP",
      jumlahPertemuan: 16,
      harga: 1200000,
      aktif: true,
    },
    {
      _id: "prog-eng-smp",
      nama: "Bahasa Inggris SMP",
      jenjang: "SMP",
      jumlahPertemuan: 16,
      harga: 1100000,
      aktif: true,
    },
    {
      _id: "prog-fis-sma",
      nama: "Fisika SMA",
      jenjang: "SMA",
      jumlahPertemuan: 20,
      harga: 1800000,
      aktif: false,
    },
  ],

  pendaftaran: [
    {
      _id: "daftar-001",
      siswaId: "siswa-raka",
      programId: "prog-utbk",
      status: "aktif",
      catatanStaf: "",
      dibuatPada: Timestamp.fromDate(new Date("2026-10-02T10:00:00Z")),
    },
    {
      _id: "daftar-002",
      siswaId: "siswa-salsa",
      programId: "prog-mat-smp",
      status: "aktif",
      catatanStaf: "",
      dibuatPada: Timestamp.fromDate(new Date("2026-10-04T11:20:00Z")),
    },
    {
      _id: "daftar-003",
      siswaId: "siswa-budi",
      programId: "prog-utbk",
      status: "menunggu",
      catatanStaf: "",
      dibuatPada: Timestamp.fromDate(new Date("2026-10-17T14:10:00Z")),
    },
    {
      _id: "daftar-004",
      siswaId: "siswa-budi",
      programId: "prog-mat-smp",
      status: "ditolak",
      catatanStaf: "Pembayaran belum terkonfirmasi di kantor.",
      dibuatPada: Timestamp.fromDate(new Date("2026-10-15T09:15:00Z")),
    },
  ],

  kelas: [
    {
      _id: "kelas-utbk-a",
      nama: "Intensif UTBK A",
      programId: "prog-utbk",
      tutorId: "z0YJao5F4oO2OHxO3GYMgI6tyPo2",
      siswaIds: ["pquOnyOCs3QbyGweCkHuaWqbp273"],
      hari: "Selasa",
      jam: "16.00",
      tempat: "Ruang 2",
    },
    {
      _id: "kelas-mat-smp-a",
      nama: "Matematika SMP 8A",
      programId: "prog-mat-smp",
      tutorId: "tutor-nadia",
      siswaIds: ["siswa-salsa"],
      hari: "Kamis",
      jam: "15.30",
      tempat: "Ruang 1",
    },
  ],

  pertemuan: [
    {
      _id: "pertemuan-utbk-01",
      kelasId: "kelas-utbk-a",
      tanggal: "2026-10-06",
      topik: "Pengantar Penalaran Matematika UTBK",
      materiUrl: "https://drive.google.com/file/d/materi-utbk-01",
      hadirIds: ["siswa-raka"],
    },
    {
      _id: "pertemuan-utbk-02",
      kelasId: "kelas-utbk-a",
      tanggal: "2026-10-13",
      topik: "Logika dan Analisis Data",
      materiUrl: "https://drive.google.com/file/d/materi-utbk-02",
      hadirIds: ["siswa-raka"],
    },
    {
      _id: "pertemuan-mat-01",
      kelasId: "kelas-mat-smp-a",
      tanggal: "2026-10-08",
      topik: "Persamaan Linear Satu Variabel",
      materiUrl: "https://drive.google.com/file/d/materi-mat-01",
      hadirIds: ["siswa-salsa"],
    },
    {
      _id: "pertemuan-mat-02",
      kelasId: "kelas-mat-smp-a",
      tanggal: "2026-10-15",
      topik: "Sistem Persamaan Linear Dua Variabel",
      materiUrl: "",
      hadirIds: ["siswa-salsa"],
    },
  ],

  tugas: [
    {
      _id: "tugas-utbk-01",
      kelasId: "kelas-utbk-a",
      judul: "Latihan Soal Penalaran Matematika Bab 1",
      deskripsi: "Kerjakan 15 soal TPS penalaran kuantitatif pada modul latihan.",
      batasWaktu: Timestamp.fromDate(new Date("2026-10-25T23:59:00Z")),
    },
    {
      _id: "tugas-utbk-02",
      kelasId: "kelas-utbk-a",
      judul: "Tryout Mandiri TPS Subtes Logika",
      deskripsi: "Selesaikan latihan soal silogisme dan lampirkan lembar kerja jawaban.",
      batasWaktu: Timestamp.fromDate(new Date("2026-11-01T23:59:00Z")),
    },
    {
      _id: "tugas-mat-01",
      kelasId: "kelas-mat-smp-a",
      judul: "Latihan SPLDV Metode Substitusi & Eliminasi",
      deskripsi: "Kerjakan soal 1-10 di buku latihan dan kumpulkan link scan pengerjaan.",
      batasWaktu: Timestamp.fromDate(new Date("2026-10-28T23:59:00Z")),
    },
  ],

  pengumpulan: [
    {
      _id: "kumpul-utbk-001",
      tugasId: "tugas-utbk-01",
      siswaId: "siswa-raka",
      kelasId: "kelas-utbk-a",
      tautan: "https://docs.google.com/document/d/jawaban-raka-utbk-01",
      dikumpulkanPada: Timestamp.fromDate(new Date("2026-10-16T19:30:00Z")),
      nilai: 88,
      komentar: "Pengerjaan sangat baik, perhatikan ketelitian pada nomor 7.",
    },
    {
      _id: "kumpul-utbk-002",
      tugasId: "tugas-utbk-02",
      siswaId: "siswa-raka",
      kelasId: "kelas-utbk-a",
      tautan: "https://docs.google.com/document/d/jawaban-raka-utbk-02",
      dikumpulkanPada: Timestamp.fromDate(new Date("2026-10-18T10:00:00Z")),
      komentar: "",
    },
    {
      _id: "kumpul-mat-001",
      tugasId: "tugas-mat-01",
      siswaId: "siswa-salsa",
      kelasId: "kelas-mat-smp-a",
      tautan: "https://docs.google.com/document/d/jawaban-salsa-mat-01",
      dikumpulkanPada: Timestamp.fromDate(new Date("2026-10-18T08:15:00Z")),
      nilai: 95,
      komentar: "Langkah penyelesaian sangat rapi dan tepat!",
    },
  ],
};

async function seed() {
  console.log("=== Memulai Seeding Cloud Firestore (PRD 7.1) ===\n");

  for (const [collectionName, documents] of Object.entries(seedData)) {
    console.log(`Mengisi koleksi: '${collectionName}' (${documents.length} dokumen)...`);
    for (const docData of documents) {
      const { _id, ...fields } = docData;
      const docRef = doc(db, collectionName, _id);
      await setDoc(docRef, fields);
      console.log(`  ✓ Dokumen '${_id}' berhasil disimpan.`);
    }
    console.log("");
  }

  console.log("=== Verifikasi Data Koleksi ===");
  for (const collectionName of Object.keys(seedData)) {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    console.log(`Koleksi '${collectionName}': ${snapshot.size} dokumen terverifikasi.`);
  }

  console.log("\n=== Seeding Berhasil Selesai! ===");
}

seed().catch((err) => {
  console.error("Gagal melakukan seed:", err);
  process.exit(1);
});
