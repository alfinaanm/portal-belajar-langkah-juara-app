"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Loader2, ShieldAlert, Lock, ArrowLeft } from "lucide-react";

/**
 * RouteGuard universal sesuai Bab 6.2 PRD & Bab 3 Peta Route rancangan.md:
 * - Menampilkan layar "Memuat..." selama role belum selesai dibaca dari users/{uid}
 * - Pengguna yang belum masuk diarahkan ke /masuk
 * - Super Admin (role: super_admin) selalu diizinkan membuka semua halaman
 * - Peran lain yang tidak memiliki izin melihat halaman "Akses Ditolak"
 */
export default function RouteGuard({ children, allowedRoles = [], groupTitle = "" }) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Pengguna yang belum masuk diarahkan ke /masuk
    if (!loading && !user) {
      router.replace("/masuk");
    }
  }, [user, loading, router]);

  // 1. Layar Memuat: Selama role belum selesai dibaca dari users/{uid}, jangan memutuskan apa pun
  if (loading || (user && !userProfile)) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center mb-4 shadow-xs animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-[#1F2937]">Memuat Hak Akses...</h2>
          <p className="text-xs text-[#5A6B78] mt-1 max-w-sm">
            Sedang membaca profil dan peran pengguna dari Cloud Firestore...
          </p>
        </div>
      </AppShell>
    );
  }

  // 2. Belum masuk -> tampilkan placeholder sebelum redirect selesai
  if (!user) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Perlu Masuk Terlebih Dahulu</h2>
          <p className="text-xs text-[#5A6B78] mt-1 mb-4 max-w-sm">
            Halaman {groupTitle ? `kelompok ${groupTitle}` : "ini"} hanya dapat diakses oleh pengguna yang sudah masuk. Mengalihkan ke halaman masuk...
          </p>
          <button
            onClick={() => router.replace("/masuk")}
            className="px-5 py-2.5 bg-[#EA580C] text-white font-semibold rounded-xl text-xs hover:bg-orange-700 transition"
          >
            Menuju Halaman Masuk
          </button>
        </div>
      </AppShell>
    );
  }

  // 3. Super Admin selalu diizinkan membuka semua halaman (PRD 2.1, 2.3, 6.2 & rancangan.md 4.4)
  const isSuperAdmin = userProfile?.role === "super_admin";
  const isAllowed = isSuperAdmin || allowedRoles.includes(userProfile?.role);

  // 4. Peran lain melihat halaman Akses Ditolak
  if (!isAllowed) {
    const roleLabels = {
      siswa: "Siswa (Pelanggan)",
      staf: "Staf (Staf Depan)",
      tutor: "Tutor (Tenaga Ahli)",
      super_admin: "Super Admin (Pemilik)",
    };

    return (
      <AppShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#E53935] flex items-center justify-center mb-4 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E53935] bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-2">
            Akses Ditolak
          </span>
          <h1 className="text-2xl font-bold text-[#1F2937]">Anda Tidak Memiliki Izin</h1>
          <p className="text-xs text-[#5A6B78] mt-2 max-w-md leading-relaxed">
            Halaman {groupTitle ? `kelompok ${groupTitle}` : "ini"} hanya diperuntukkan bagi peran{" "}
            <strong>{allowedRoles.map((r) => roleLabels[r] || r).join(" atau ")}</strong> serta{" "}
            <strong>Super Admin</strong>.
          </p>
          <div className="mt-3 p-3 bg-slate-100 rounded-xl text-xs text-[#1F2937] max-w-md">
            Peran akun Anda saat ini:{" "}
            <strong className="uppercase">{roleLabels[userProfile?.role] || userProfile?.role}</strong>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-[#1F2937] rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <button
              onClick={() => {
                const target =
                  userProfile?.role === "staf"
                    ? "/staf"
                    : userProfile?.role === "tutor"
                    ? "/tutor"
                    : userProfile?.role === "super_admin"
                    ? "/admin"
                    : "/beranda";
                router.push(target);
              }}
              className="px-5 py-2.5 bg-[#EA580C] text-white rounded-xl text-xs font-semibold hover:bg-orange-700 transition"
            >
              Ke Halaman Saya
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // 5. Izin valid -> Tampilkan halaman anak
  return <>{children}</>;
}
