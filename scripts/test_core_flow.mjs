import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcbQGNJHZxbr8j3edymcqNKgt1pVpWDvI",
  authDomain: "portal-belajar-langkah-j-a82ab.firebaseapp.com",
  projectId: "portal-belajar-langkah-j-a82ab",
  storageBucket: "portal-belajar-langkah-j-a82ab.firebasestorage.app",
  messagingSenderId: "128476094902",
  appId: "1:128476094902:web:3d59d12f421fcacbe12117",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data akun uji nyata sesuai docs/uji.md
const RAKA_UID = "pquOnyOCs3QbyGweCkHuaWqbp273"; // Siswa
const FIRA_UID = "TCmIrpZrPqggkkzHsSvTmkGyNND3"; // Staf
const DIMAS_UID = "z0YJao5F4oO2OHxO3GYMgI6tyPo2"; // Tutor
const ARIF_UID = "YpC7uUD9KbOgRZY5M0TKla1VXaY2"; // Super Admin

async function runCoreFlowVerification() {
  console.log("================================================================================");
  console.log(" PENGUJIAN ALUR INTI PORTAL BELAJAR LANGKAH JUARA DENGAN DATA SUNGGUHAN FIRESTORE");
  console.log("================================================================================\n");

  const results = [];

  // ---------------------------------------------------------------------------
  // LANGKAH 1: Siswa Mendaftar Program (PRD Bab 4.3)
  // ---------------------------------------------------------------------------
  console.log("[LANGKAH 1] Siswa (Raka) Mendaftar Program Intensif UTBK (Bab 4.3)");
  console.log(" -> Membaca program aktif dari Firestore...");
  const progSnap = await getDoc(doc(db, "program", "prog-utbk"));
  if (!progSnap.exists() || !progSnap.data().aktif) {
    throw new Error("Program 'prog-utbk' tidak ditemukan atau tidak aktif di Firestore.");
  }
  console.log(`    ✓ Program terbaca: "${progSnap.data().nama}" (Rp ${progSnap.data().harga.toLocaleString("id-ID")})`);

  console.log(" -> Menulis dokumen pendaftaran baru ke Firestore koleksi 'pendaftaran'...");
  const newPendRef = await addDoc(collection(db, "pendaftaran"), {
    siswaId: RAKA_UID,
    programId: "prog-utbk",
    status: "menunggu",
    catatanStaf: "",
    dibuatPada: serverTimestamp(),
  });
  const pendId = newPendRef.id;
  console.log(`    ✓ Dokumen pendaftaran berhasil ditulis ke Firestore dengan ID: ${pendId}`);

  // Verifikasi membaca kembali dari Firestore
  const verifyPendSnap = await getDoc(doc(db, "pendaftaran", pendId));
  const pendData = verifyPendSnap.data();
  if (pendData.status !== "menunggu" || pendData.siswaId !== RAKA_UID) {
    throw new Error("Verifikasi Langkah 1 gagal: data pendaftaran tidak cocok.");
  }
  console.log(`    ✓ Verifikasi Firestore: Status pendaftaran '${pendData.status}' (Menunggu konfirmasi bayar di kantor)\n`);
  results.push({ step: "1. Siswa Mendaftar Program (4.3)", status: "PASSED", docId: pendId });

  // ---------------------------------------------------------------------------
  // LANGKAH 2: Staf Menyetujui Pendaftaran Siswa (PRD Bab 4.8)
  // ---------------------------------------------------------------------------
  console.log("[LANGKAH 2] Staf (Kak Fira) Menyetujui Pendaftaran Siswa (Bab 4.8)");
  console.log(" -> Staf membaca pendaftaran berstatus 'menunggu' dari Firestore...");
  const qMenunggu = query(
    collection(db, "pendaftaran"),
    where("siswaId", "==", RAKA_UID),
    where("status", "==", "menunggu")
  );
  const snapMenunggu = await getDocs(qMenunggu);
  console.log(`    ✓ Ditemukan ${snapMenunggu.size} pendaftaran berstatus menunggu untuk Raka.`);

  console.log(" -> Staf menulis pembaruan status menjadi 'aktif' ke Firestore...");
  await updateDoc(doc(db, "pendaftaran", pendId), {
    status: "aktif",
    catatanStaf: "Pembayaran terverifikasi di kantor Langkah Juara.",
  });
  console.log("    ✓ Dokumen pendaftaran berhasil diperbarui di Firestore.");

  // Verifikasi membaca kembali status aktif
  const verifyAktifSnap = await getDoc(doc(db, "pendaftaran", pendId));
  if (verifyAktifSnap.data().status !== "aktif") {
    throw new Error("Verifikasi Langkah 2 gagal: status bukan 'aktif'.");
  }
  console.log(`    ✓ Verifikasi Firestore: Status pendaftaran kini '${verifyAktifSnap.data().status}'\n`);
  results.push({ step: "2. Staf Menyetujui Pendaftaran (4.8)", status: "PASSED", docId: pendId });

  // ---------------------------------------------------------------------------
  // LANGKAH 3: Staf Memasukkan Siswa ke Kelas (PRD Bab 4.9)
  // ---------------------------------------------------------------------------
  console.log("[LANGKAH 3] Staf (Kak Fira) Memasukkan Siswa ke Kelas 'Intensif UTBK A' (Bab 4.9)");
  console.log(" -> Memeriksa apakah siswa memiliki pendaftaran aktif untuk program kelas ini...");
  const qCekAktif = query(
    collection(db, "pendaftaran"),
    where("siswaId", "==", RAKA_UID),
    where("programId", "==", "prog-utbk"),
    where("status", "==", "aktif")
  );
  const snapCekAktif = await getDocs(qCekAktif);
  if (snapCekAktif.empty) {
    throw new Error("Validasi PRD 4.9 gagal: siswa belum memiliki pendaftaran aktif untuk program ini.");
  }
  console.log("    ✓ Validasi berhasil: Siswa memiliki pendaftaran AKTIF untuk program UTBK.");

  console.log(" -> Menulis penambahan siswa ke dokumen 'kelas/kelas-utbk-a' (arrayUnion)...");
  await updateDoc(doc(db, "kelas", "kelas-utbk-a"), {
    siswaIds: arrayUnion(RAKA_UID),
  });
  console.log("    ✓ Field siswaIds berhasil diperbarui di Firestore.");

  // Verifikasi membaca kembali kelas
  const verifyKelasSnap = await getDoc(doc(db, "kelas", "kelas-utbk-a"));
  const kelasData = verifyKelasSnap.data();
  if (!kelasData.siswaIds.includes(RAKA_UID)) {
    throw new Error("Verifikasi Langkah 3 gagal: Raka tidak ditemukan di kelas.siswaIds.");
  }
  console.log(`    ✓ Verifikasi Firestore: Kelas '${kelasData.nama}' kini memuat ${kelasData.siswaIds.length} siswa (termasuk Raka).\n`);
  results.push({ step: "3. Staf Memasukkan Siswa ke Kelas (4.9)", status: "PASSED", kelasId: "kelas-utbk-a" });

  // ---------------------------------------------------------------------------
  // LANGKAH 4: Tutor Membuat Tugas Baru di Kelas (PRD Bab 4.13)
  // ---------------------------------------------------------------------------
  console.log("[LANGKAH 4] Tutor (Kak Dimas) Membuat Tugas Baru di Kelas (Bab 4.13)");
  console.log(" -> Memeriksa hak akses tutor pengampu kelas...");
  if (kelasData.tutorId !== DIMAS_UID) {
    throw new Error(`Kak Dimas (${DIMAS_UID}) bukan tutor kelas ini (tutorId: ${kelasData.tutorId}).`);
  }
  console.log(`    ✓ Terverifikasi: Kak Dimas (${DIMAS_UID}) adalah tutor sah pengampu '${kelasData.nama}'.`);

  console.log(" -> Menulis dokumen tugas baru ke Firestore koleksi 'tugas'...");
  const newTugasRef = await addDoc(collection(db, "tugas"), {
    kelasId: "kelas-utbk-a",
    judul: "Tugas 01: Latihan Penalaran Logika Alur Inti",
    deskripsi: "Selesaikan 10 soal TPS dan sertakan link Google Drive file pengerjaan Anda.",
    batasWaktu: Timestamp.fromDate(new Date("2026-10-30T23:59:00Z")),
  });
  const tugasId = newTugasRef.id;
  console.log(`    ✓ Dokumen tugas baru berhasil ditulis ke Firestore dengan ID: ${tugasId}`);

  // Verifikasi membaca kembali tugas dari Firestore
  const verifyTugasSnap = await getDoc(doc(db, "tugas", tugasId));
  if (!verifyTugasSnap.exists()) {
    throw new Error("Verifikasi Langkah 4 gagal: dokumen tugas tidak ditemukan di Firestore.");
  }
  console.log(`    ✓ Verifikasi Firestore: Tugas '${verifyTugasSnap.data().judul}' siap dikerjakan siswa.\n`);
  results.push({ step: "4. Tutor Membuat Tugas (4.13)", status: "PASSED", tugasId });

  // ---------------------------------------------------------------------------
  // LANGKAH 5: Siswa Mengumpulkan Tugas (PRD Bab 4.5)
  // ---------------------------------------------------------------------------
  console.log("[LANGKAH 5] Siswa (Raka) Mengumpulkan Tugas (Bab 4.5)");
  console.log(" -> Memeriksa apakah siswa adalah anggota kelas pemilik tugas...");
  if (!kelasData.siswaIds.includes(RAKA_UID)) {
    throw new Error("Akses ditolak: Siswa di luar kelas tidak dapat mengumpulkan tugas.");
  }
  console.log("    ✓ Terverifikasi: Siswa adalah anggota terdaftar di kelas tugas ini.");

  const tautanJawaban = "https://drive.google.com/file/d/jawaban-raka-penalaran-logika-final";
  console.log(` -> Menulis pengumpulan tugas ke Firestore koleksi 'pengumpulan' (${tautanJawaban})...`);
  const newKumpulRef = await addDoc(collection(db, "pengumpulan"), {
    tugasId: tugasId,
    siswaId: RAKA_UID,
    kelasId: "kelas-utbk-a",
    tautan: tautanJawaban,
    dikumpulkanPada: serverTimestamp(),
    nilai: null,
    komentar: "",
  });
  const kumpulId = newKumpulRef.id;
  console.log(`    ✓ Dokumen pengumpulan berhasil ditulis ke Firestore dengan ID: ${kumpulId}`);

  // Verifikasi membaca kembali pengumpulan dan hitung status dinamis
  const verifyKumpulSnap = await getDoc(doc(db, "pengumpulan", kumpulId));
  const kData = verifyKumpulSnap.data();
  const statusDinamis = kData.nilai != null ? "dinilai" : kData.tautan ? "dikumpulkan" : "belum dikumpulkan";
  console.log(`    ✓ Verifikasi Firestore: Tautan '${kData.tautan}', status dinamis: '${statusDinamis}'\n`);
  results.push({ step: "5. Siswa Mengumpulkan Tugas (4.5)", status: "PASSED", kumpulId });

  // ---------------------------------------------------------------------------
  // LANGKAH 6: Tutor Memberi Nilai dan Komentar (PRD Bab 4.13)
  // ---------------------------------------------------------------------------
  console.log("[LANGKAH 6] Tutor (Kak Dimas) Memberi Nilai dan Komentar (Bab 4.13)");
  console.log(" -> Tutor membaca daftar pengumpulan untuk tugas ini dari Firestore...");
  const qKumpul = query(collection(db, "pengumpulan"), where("tugasId", "==", tugasId));
  const snapKumpul = await getDocs(qKumpul);
  console.log(`    ✓ Ditemukan ${snapKumpul.size} pengumpulan jawaban tugas.`);

  const nilaiBeri = 92;
  const komentarBeri = "Pengerjaan luar biasa! Langkah logika deduksi sangat runtut dan tepat pada nomor 7.";
  console.log(` -> Tutor menulis nilai (${nilaiBeri}) dan komentar ke Firestore...`);
  await updateDoc(doc(db, "pengumpulan", kumpulId), {
    nilai: nilaiBeri,
    komentar: komentarBeri,
  });
  console.log("    ✓ Dokumen pengumpulan berhasil diperbarui di Firestore.");

  // Verifikasi membaca kembali
  const verifyNilaiSnap = await getDoc(doc(db, "pengumpulan", kumpulId));
  const dinilaiData = verifyNilaiSnap.data();
  if (dinilaiData.nilai !== nilaiBeri || dinilaiData.komentar !== komentarBeri) {
    throw new Error("Verifikasi Langkah 6 gagal: nilai atau komentar tidak cocok.");
  }
  console.log(`    ✓ Verifikasi Firestore: Nilai ${dinilaiData.nilai}/100 dan komentar berhasil tersimpan.\n`);
  results.push({ step: "6. Tutor Memberi Nilai (4.13)", status: "PASSED", nilai: nilaiBeri });

  // ---------------------------------------------------------------------------
  // LANGKAH 7: Siswa Membaca Nilai dan Umpan Balik (PRD Bab 4.5)
  // ---------------------------------------------------------------------------
  console.log("[LANGKAH 7] Siswa (Raka) Membaca Nilai dan Umpan Balik (Bab 4.5)");
  console.log(" -> Siswa membaca dokumen pengumpulan miliknya dari Firestore...");
  const qBacaNilai = query(
    collection(db, "pengumpulan"),
    where("tugasId", "==", tugasId),
    where("siswaId", "==", RAKA_UID)
  );
  const snapBacaNilai = await getDocs(qBacaNilai);
  if (snapBacaNilai.empty) {
    throw new Error("Dokumen pengumpulan siswa tidak ditemukan.");
  }
  const finalDoc = snapBacaNilai.docs[0].data();
  const statusAkhir = finalDoc.nilai != null ? "dinilai" : "dikumpulkan";

  console.log("    =======================================================");
  console.log("    TAMPILAN DI LAYAR SISWA (PRD Bab 4.5):");
  console.log(`    * Status Tugas     : [${statusAkhir.toUpperCase()}]`);
  console.log(`    * Nilai Akhir      : ${finalDoc.nilai} / 100`);
  console.log(`    * Komentar Evaluasi: "${finalDoc.komentar}"`);
  console.log("    =======================================================\n");
  results.push({ step: "7. Siswa Membaca Nilai (4.5)", status: "PASSED", statusAkhir, nilai: finalDoc.nilai });

  console.log("================================================================================");
  console.log(" RINGKASAN VERIFIKASI ALUR INTI (SEMUA LANGKAH TERBUKTI BACA & TULIS FIRESTORE)");
  console.log("================================================================================");
  results.forEach((r, idx) => {
    console.log(` [✓] Langkah ${idx + 1}: ${r.step} => STATUS: ${r.status}`);
  });
  console.log("\nSELURUH ALUR INTI BERJALAN 100% SUKSES DENGAN DATA SUNGGUHAN DI CLOUD FIRESTORE!");
}

runCoreFlowVerification().catch((err) => {
  console.error("Uji Alur Inti Gagal:", err);
  process.exit(1);
});
