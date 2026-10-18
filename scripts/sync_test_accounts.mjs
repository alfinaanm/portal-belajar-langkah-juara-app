import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
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

// UID Asli dari Firebase Authentication (docs/uji.md)
const ACCOUNTS = {
  admin: {
    uid: "YpC7uUD9KbOgRZY5M0TKla1VXaY2",
    nama: "Pak Arif",
    email: "arif@langkahjuara.id",
    noHp: "081134567895",
    noHpOrangTua: "",
    role: "super_admin",
    aktif: true,
  },
  staf: {
    uid: "TCmIrpZrPqggkkzHsSvTmkGyNND3",
    nama: "Kak Fira",
    email: "fira@langkahjuara.id",
    noHp: "085234567892",
    noHpOrangTua: "",
    role: "staf",
    aktif: true,
  },
  tutor: {
    uid: "z0YJao5F4oO2OHxO3GYMgI6tyPo2",
    nama: "Kak Dimas",
    email: "dimas@langkahjuara.id",
    noHp: "087734567893",
    noHpOrangTua: "",
    role: "tutor",
    aktif: true,
  },
  siswa: {
    uid: "pquOnyOCs3QbyGweCkHuaWqbp273",
    nama: "Raka Pratama",
    email: "raka@langkahjuara.id",
    noHp: "081234567890",
    noHpOrangTua: "081298765432",
    role: "siswa",
    aktif: true,
  },
};

async function sync() {
  console.log("=== Menyinkronkan Akun Uji Firestore dengan Firebase Auth ===");

  // 1. Simpan akun uji ke koleksi users dengan UID autentikasi nyata
  for (const acc of Object.values(ACCOUNTS)) {
    const userRef = doc(db, "users", acc.uid);
    await setDoc(userRef, {
      nama: acc.nama,
      email: acc.email,
      noHp: acc.noHp,
      noHpOrangTua: acc.noHpOrangTua,
      role: acc.role,
      aktif: acc.aktif,
      dibuatPada: Timestamp.now(),
    });
    console.log(`✓ Akun ${acc.role}: ${acc.nama} (${acc.uid}) diperbarui.`);
  }

  // 2. Hapus dummy doc users lama jika masih ada
  const dummyIds = ["admin-arif", "staf-fira", "tutor-dimas", "siswa-raka"];
  for (const dummyId of dummyIds) {
    try {
      await deleteDoc(doc(db, "users", dummyId));
      console.log(`✓ Dummy doc users/${dummyId} dibersihkan.`);
    } catch (e) {
      // Abaikan jika sudah tidak ada
    }
  }

  // 3. Pastikan kelas Intensif UTBK A diampu oleh Kak Dimas asli
  await setDoc(
    doc(db, "kelas", "kelas-utbk-a"),
    {
      nama: "Intensif UTBK A",
      programId: "prog-utbk",
      tutorId: ACCOUNTS.tutor.uid, // Kak Dimas asli
      siswaIds: [], // Dikosongkan agar bisa diisi saat pengujian alur inti
      hari: "Selasa",
      jam: "16.00",
      tempat: "Ruang 2",
    },
    { merge: true }
  );
  console.log(`✓ Kelas 'kelas-utbk-a' disetel dengan tutor Kak Dimas (${ACCOUNTS.tutor.uid}).`);

  // 4. Hapus pendaftaran lama milik siswa-raka agar alur pendaftaran Raka bersih
  const pendaftaranSnap = await getDocs(collection(db, "pendaftaran"));
  for (const d of pendaftaranSnap.docs) {
    const data = d.data();
    if (data.siswaId === "siswa-raka" || data.siswaId === ACCOUNTS.siswa.uid) {
      await deleteDoc(doc(db, "pendaftaran", d.id));
      console.log(`✓ Pendaftaran lama '${d.id}' dibersihkan untuk pengujian alur.`);
    }
  }

  // 5. Hapus pengumpulan lama milik siswa-raka
  const kumpulSnap = await getDocs(collection(db, "pengumpulan"));
  for (const d of kumpulSnap.docs) {
    const data = d.data();
    if (data.siswaId === "siswa-raka" || data.siswaId === ACCOUNTS.siswa.uid) {
      await deleteDoc(doc(db, "pengumpulan", d.id));
      console.log(`✓ Pengumpulan lama '${d.id}' dibersihkan.`);
    }
  }

  console.log("\n=== Sinkronisasi Berhasil Selesai! ===");
}

sync().catch(console.error);
