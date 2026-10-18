"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  authError: null,
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  clearAuthError: () => {},
});

export function getRoleDashboardPath(role) {
  switch (role) {
    case "super_admin":
      return "/admin";
    case "staf":
      return "/staf";
    case "tutor":
      return "/tutor";
    case "siswa":
    default:
      return "/beranda";
  }
}

export function formatAuthError(error) {
  if (!error) return "";
  const code = error.code || "";
  switch (code) {
    case "auth/configuration-not-found":
      return "Firebase Authentication belum diaktifkan di konsol Firebase. Silakan buka menu Authentication di Firebase Console lalu klik 'Get Started' dan aktifkan penyedia Email/Password serta Google.";
    case "auth/operation-not-allowed":
      return "Metode masuk ini belum diaktifkan di Firebase Console. Silakan aktifkan penyedia di menu Authentication -> Sign-in method.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email atau kata sandi salah.";
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.";
    case "auth/weak-password":
      return "Kata sandi terlalu singkat. Minimal 6 karakter.";
    case "auth/invalid-email":
      return "Format alamat email tidak valid.";
    case "auth/popup-closed-by-user":
      return "Jendela masuk Google ditutup sebelum selesai.";
    case "auth/cancelled-popup-request":
      return "Permintaan masuk Google dibatalkan.";
    case "auth/popup-blocked":
      return "Pop-up login Google terblokir peramban. Izinkan pop-up pada peramban Anda.";
    case "auth/network-request-failed":
      return "Gagal terhubung ke jaringan. Periksa koneksi internet Anda.";
    default:
      return error.message || "Terjadi kesalahan autentikasi.";
  }
}

/**
 * Aturan PRD 2.2, 4.1, & 7.1:
 * Cek dokumen users/{uid}.
 * - Bila belum ada: buat dokumen dengan field PRD 7.1 dan peran awal "siswa".
 * - Bila sudah ada: jangan diubah sama sekali.
 * - Kata sandi tidak pernah disimpan di dokumen ini.
 */
async function ensureUserProfileDocument(firebaseUser, fallbackNama = "") {
  if (!firebaseUser?.uid) return null;

  const userDocRef = doc(db, "users", firebaseUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    // Bila sudah ada, jangan diubah.
    return { uid: firebaseUser.uid, ...docSnap.data() };
  }

  // Tentukan nama awal
  const candidateName =
    fallbackNama.trim() ||
    firebaseUser.displayName?.trim() ||
    (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Siswa Baru");

  // Field sama persis dengan Bab 7.1 PRD (tanpa menyimpan kata sandi)
  const initialData = {
    nama: candidateName,
    email: firebaseUser.email || "",
    noHp: "",
    noHpOrangTua: "",
    role: "siswa", // Peran awal setiap akun baru (PRD 2.2)
    aktif: true,   // true saat dibuat (PRD 7.1)
    dibuatPada: serverTimestamp(),
  };

  await setDoc(userDocRef, initialData);
  return { uid: firebaseUser.uid, ...initialData };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          // Setelah pengguna berhasil masuk (atau sesi dipulihkan), cek dokumen users/{uid}
          // Bila belum ada, buat dengan role "siswa". Bila sudah ada, jangan diubah.
          await ensureUserProfileDocument(firebaseUser);
        } catch (err) {
          console.error("Gagal memeriksa/membuat profil user:", err);
        }

        const userDocRef = doc(db, "users", firebaseUser.uid);

        // Dengarkan perubahan dokumen users/{uid} secara real-time
        unsubscribeSnapshot = onSnapshot(
          userDocRef,
          async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();

              // Cek penonaktifan akun sesuai PRD 4.1
              if (data.aktif === false) {
                await signOut(auth);
                setUser(null);
                setUserProfile(null);
                setAuthError("Akun Anda dinonaktifkan. Hubungi staf Langkah Juara.");
                setLoading(false);
                return;
              }

              setUserProfile({ uid: firebaseUser.uid, ...data });
            } else {
              // Jika baru saja dibuat dan snapshot pertama belum membaca
              setUserProfile((prev) => prev || { uid: firebaseUser.uid, role: "siswa", aktif: true });
            }
            setLoading(false);
          },
          (err) => {
            console.error("Error mendengarkan dokumen user:", err);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Cek dokumen users/{uid}: bila belum ada dibuat, bila sudah ada jangan diubah
      const profile = await ensureUserProfileDocument(cred.user);
      if (profile && profile.aktif === false) {
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
        const msg = "Akun Anda dinonaktifkan. Hubungi staf Langkah Juara.";
        setAuthError(msg);
        throw new Error(msg);
      }
      return cred.user;
    } catch (err) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const registerWithEmail = async (nama, email, password) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const registeredUser = cred.user;

      if (nama.trim()) {
        await updateProfile(registeredUser, { displayName: nama.trim() });
      }

      // Cek dokumen users/{uid}: buat dengan field PRD 7.1, role siswa, tanpa kata sandi
      const profile = await ensureUserProfileDocument(registeredUser, nama.trim());
      setUserProfile(profile);

      return registeredUser;
    } catch (err) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Cek dokumen users/{uid}: bila belum ada dibuat dengan role awal "siswa". Bila sudah ada jangan diubah.
      const profile = await ensureUserProfileDocument(googleUser);

      if (profile && profile.aktif === false) {
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
        const msg = "Akun Anda dinonaktifkan. Hubungi staf Langkah Juara.";
        setAuthError(msg);
        throw new Error(msg);
      }

      setUserProfile(profile);
      return googleUser;
    } catch (err) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
