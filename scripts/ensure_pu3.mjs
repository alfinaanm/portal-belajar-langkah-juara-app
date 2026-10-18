import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

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

async function run() {
  // 1. Pastikan tugas-pu-3 ada di Firestore
  await setDoc(
    doc(db, "tugas", "tugas-pu-3"),
    {
      kelasId: "kelas-utbk-a",
      judul: "Latihan Penalaran Umum 3",
      deskripsi: "Kerjakan 10 soal TPS penalaran deduktif dan sertakan link Google Drive file pengerjaan Anda.",
      batasWaktu: Timestamp.fromDate(new Date("2026-11-20T23:59:00Z")),
    },
    { merge: true }
  );
  console.log("✓ tugas-pu-3 ready in Firestore");

  // 2. Tambahkan Alfina dan Raka ke siswaIds kelas-utbk-a
  await updateDoc(doc(db, "kelas", "kelas-utbk-a"), {
    siswaIds: arrayUnion("pquOnyOCs3QbyGweCkHuaWqbp273", "VgF2M9BLQ9cxqg49fLK00vBNL3K3"),
  });
  console.log("✓ kelas-utbk-a siswaIds updated with Raka and Alfina");
}

run().catch(console.error);
