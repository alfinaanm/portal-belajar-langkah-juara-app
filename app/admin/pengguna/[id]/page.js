"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Users,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Loader2,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function UbahPenggunaPage() {
  const params = useParams();
  const router = useRouter();
  const uid = params?.id;

  const { user: currentUser, userProfile, loading: authLoading } = useAuth();

  const [targetUser, setTargetUser] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [role, setRole] = useState("siswa");
  const [aktif, setAktif] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // Ambil data dokumen target dari Firestore
  useEffect(() => {
    if (!uid || authLoading) return;
    if (!currentUser || userProfile?.role !== "super_admin") {
      setLoadingDoc(false);
      return;
    }

    async function fetchUserDoc() {
      try {
        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTargetUser({ uid: docSnap.id, ...data });
          setRole(data.role || "siswa");
          setAktif(data.aktif !== false);
        } else {
          setError("Dokumen pengguna tidak ditemukan di Firestore.");
        }
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
        setError("Gagal membaca dokumen pengguna dari Firestore.");
      } finally {
        setLoadingDoc(false);
      }
    }

    fetchUserDoc();
  }, [uid, currentUser, userProfile, authLoading]);

  // Route Guard: Pengecekan Hak Akses Super Admin
  if (authLoading || loadingDoc) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin" />
          <p className="text-sm text-[#5A6B78]">Memuat data akun pengguna...</p>
        </div>
      </AppShell>
    );
  }

  // Jika belum login
  if (!currentUser) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-red-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Perlu Masuk Terlebih Dahulu</h2>
          <p className="text-xs text-[#5A6B78]">
            Halaman ini hanya dapat dibuka oleh Super Admin.
          </p>
          <button
            onClick={() => router.push("/masuk")}
            className="w-full py-2.5 px-4 bg-[#EA580C] text-white font-semibold rounded-xl text-sm hover:bg-orange-700 transition"
          >
            Menuju Halaman Masuk
          </button>
        </div>
      </AppShell>
    );
  }

  // Jika login tapi bukan super_admin
  if (userProfile?.role !== "super_admin") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-red-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-red-700">Akses Ditolak</h2>
          <p className="text-xs text-[#5A6B78] leading-relaxed">
            Halaman ini khusus untuk peran <strong>Super Admin</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push(userProfile?.role === "staf" ? "/staf" : userProfile?.role === "tutor" ? "/tutor" : "/beranda")}
              className="py-2.5 px-6 bg-[#EA580C] text-white font-semibold rounded-xl text-sm hover:bg-orange-700 transition"
            >
              Kembali ke Halaman Saya
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!targetUser) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <h2 className="text-lg font-bold text-[#1F2937]">Pengguna Tidak Ditemukan</h2>
          <p className="text-xs text-[#5A6B78]">Dokumen dengan ID tersebut tidak ada di Firestore.</p>
          <Link
            href="/admin/pengguna"
            className="inline-block py-2.5 px-4 bg-[#EA580C] text-white font-semibold rounded-xl text-xs hover:bg-orange-700 transition"
          >
            Kembali ke Kelola Pengguna
          </Link>
        </div>
      </AppShell>
    );
  }

  const isSuperAdminSelf = targetUser.uid === currentUser.uid;

  const handleSimpan = async (e) => {
    e.preventDefault();
    setError("");
    setToast("");

    // Validasi Bab 4.15: Super Admin tidak bisa menurunkan peran atau menonaktifkan akunnya sendiri
    if (isSuperAdminSelf && (role !== "super_admin" || !aktif)) {
      setError("Super Admin tidak bisa menurunkan peran atau menonaktifkan akunnya sendiri.");
      return;
    }

    setSaving(true);
    try {
      const userDocRef = doc(db, "users", targetUser.uid);
      await updateDoc(userDocRef, {
        role,
        aktif,
      });

      setTargetUser((prev) => ({
        ...prev,
        role,
        aktif,
      }));

      setToast(
        `Perubahan peran untuk "${targetUser.nama}" berhasil disimpan ke Firestore! Peran: ${role.toUpperCase()}, Status: ${
          aktif ? "Aktif" : "Nonaktif"
        }.`
      );
    } catch (err) {
      console.error("Gagal memperbarui pengguna:", err);
      setError(err.message || "Gagal menyimpan perubahan ke Firestore.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/pengguna"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Kelola Pengguna
          </Link>
          <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold border border-orange-200">
            PRD Bab 4.15 &bull; Ubah Peran Pengguna
          </span>
        </div>

        {toast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-[#E53935] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              Detail Dokumen Akun Firestore
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{targetUser.nama || "Tanpa Nama"}</h1>
            <p className="text-xs text-[#5A6B78] mt-1">
              Email: <strong>{targetUser.email || "-"}</strong> &bull; UID: <code className="bg-slate-100 px-1 py-0.5 rounded">{targetUser.uid}</code>
            </p>
          </div>

          <form onSubmit={handleSimpan} className="space-y-5 border-t border-slate-100 pt-5">
            {/* Pilihan Peran */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-2">
                Pilih Peran Akun (Role) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: "siswa", label: "Siswa (Pelanggan)", desc: "Mendaftar, kelas, tugas miliknya" },
                  { key: "staf", label: "Staf (Staf Depan)", desc: "Pendaftaran & susun kelas" },
                  { key: "tutor", label: "Tutor (Tenaga Ahli)", desc: "Pertemuan, presensi, tugas & nilai" },
                  { key: "super_admin", label: "Super Admin (Pemilik)", desc: "Kelola pengguna, program, laporan" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      role === item.key
                        ? "border-[#EA580C] bg-orange-50/60 ring-2 ring-[#EA580C]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#1F2937]">{item.label}</span>
                      <input
                        type="radio"
                        name="role"
                        value={item.key}
                        checked={role === item.key}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isSuperAdminSelf && item.key !== "super_admin"}
                        className="text-[#EA580C] focus:ring-[#EA580C]"
                      />
                    </div>
                    <span className="text-[11px] text-[#5A6B78]">{item.desc}</span>
                  </label>
                ))}
              </div>
              {isSuperAdminSelf && (
                <p className="text-[11px] text-amber-700 mt-2">
                  * Catatan: Anda tidak dapat menurunkan peran akun Super Admin Anda sendiri.
                </p>
              )}
            </div>

            {/* Status Aktif Akun */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-2">
                Status Keaktifan Akun *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => !isSuperAdminSelf && setAktif(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    aktif
                      ? "bg-emerald-50 text-[#15A66A] border-2 border-emerald-500 shadow-xs"
                      : "bg-[#F7F5F2] text-[#5A6B78] border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Akun Aktif</span>
                </button>

                <button
                  type="button"
                  onClick={() => !isSuperAdminSelf && setAktif(false)}
                  disabled={isSuperAdminSelf}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    !aktif
                      ? "bg-red-50 text-[#E53935] border-2 border-red-500 shadow-xs"
                      : "bg-[#F7F5F2] text-[#5A6B78] border border-slate-200 hover:bg-slate-200"
                  } ${isSuperAdminSelf ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <UserX className="w-4 h-4" />
                  <span>Nonaktifkan Akun</span>
                </button>
              </div>
              <p className="text-[11px] text-[#5A6B78] mt-1.5">
                Bila dinonaktifkan, akun ditolak saat masuk dengan pesan: <em>&quot;Akun Anda dinonaktifkan. Hubungi staf Langkah Juara.&quot;</em> Data akun tetap tersimpan.
              </p>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/admin/pengguna"
                className="px-4 py-2 text-xs font-medium text-[#5A6B78] hover:text-[#1F2937]"
              >
                Batal
              </Link>
              <button
                type="submit"
                id="save-user-role-button"
                disabled={saving}
                className="px-6 py-2.5 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold rounded-xl text-xs shadow-xs transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan ke Firestore...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
