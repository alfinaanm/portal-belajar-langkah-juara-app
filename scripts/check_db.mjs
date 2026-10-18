import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function check() {
  for (const col of ["users", "program", "pendaftaran", "kelas", "tugas", "pengumpulan", "pertemuan"]) {
    const snap = await getDocs(collection(db, col));
    console.log(`=== Koleksi: ${col} (${snap.size} docs) ===`);
    snap.forEach((doc) => {
      console.log(`ID: ${doc.id} =>`, JSON.stringify(doc.data()));
    });
  }
}

check().catch(console.error);
