"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  Users,
  Search,
  Filter,
  Shield,
  ArrowRight,
  UserCheck,
  UserX,
  AlertTriangle,
  Loader2,
  Lock,
} from "lucide-react";

function getRoleBadge(role) {
  switch (role) {
    case "super_admin":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "staf":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "tutor":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "siswa":
    default:
      return "bg-blue-100 text-blue-800 border-blue-300";
  }
}

function getRoleLabel(role) {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "staf":
      return "Staf";
    case "tutor":
      return "Tutor";
    case "siswa":
    default:
      return "Siswa";
  }
}

export default function KelolaPenggunaPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();

  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");

  // Ambil data real-time dari koleksi Firestore 'users'
  useEffect(() => {
    if (authLoading) return;
    if (!user || userProfile?.role !== "super_admin") {
      setLoadingData(false);
      return;
    }

    const usersColRef = collection(db, "users");
    const unsubscribe = onSnapshot(
      usersColRef,
      (snapshot) => {
        const users = snapshot.docs.map((docSnap) => ({
          uid: docSnap.id,
          ...docSnap.data(),
        }));
        setUsersList(users);
        setLoadingData(false);
      },
      (err) => {
        console.error("Gagal membaca daftar pengguna Firestore:", err);
        setLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, [user, userProfile, authLoading]);

  // Route Guard: Pengecekan Hak Akses Super Admin
  if (authLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin" />
          <p className="text-sm text-[#5A6B78]">Memeriksa hak akses Super Admin...</p>
        </div>
      </AppShell>
    );
  }

  // Jika belum login, tolak dan arahkan ke /masuk
  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-red-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Perlu Masuk Terlebih Dahulu</h2>
          <p className="text-xs text-[#5A6B78]">
            Halaman Kelola Pengguna hanya dapat diakses oleh pemilik (Super Admin).
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

  // Jika login tapi bukan super_admin -> Akses Ditolak sesuai PRD & rancangan.md
  if (userProfile?.role !== "super_admin") {
    return (
      <AppShell>
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-red-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-red-700">Akses Ditolak</h2>
          <p className="text-xs text-[#5A6B78] leading-relaxed">
            Halaman ini khusus untuk peran <strong>Super Admin</strong>. Akun Anda saat ini berperan sebagai{" "}
            <span className="font-bold uppercase text-[#1F2937]">{userProfile?.role || "Pengguna"}</span>.
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

  // Filter dan pencarian data
  const filteredUsers = usersList.filter((u) => {
    const nama = u.nama || "";
    const email = u.email || "";
    const matchName =
      nama.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "semua" || u.role === roleFilter;
    return matchName && matchRole;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <Users className="w-3.5 h-3.5" />
              Kelola Pengguna
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Daftar Pengguna Firestore</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Super Admin dapat menetapkan hak akses peran (Siswa, Staf, Tutor, Super Admin) dan status keaktifan akun.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-orange-100 text-[#EA580C] font-bold px-3 py-1.5 rounded-xl border border-orange-200">
              Total {usersList.length} Akun Terdaftar
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="search-user-input"
              placeholder="Cari pengguna berdasarkan nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F5F2] border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#5A6B78] mr-1 hidden sm:inline">Peran:</span>
            {["semua", "siswa", "staf", "tutor", "super_admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition shrink-0 ${roleFilter === r
                    ? "bg-[#EA580C] text-white shadow-xs"
                    : "bg-[#F7F5F2] text-[#5A6B78] hover:bg-slate-200"
                  }`}
              >
                {r.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Pengguna dari Cloud Firestore */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loadingData ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#EA580C] animate-spin" />
              <p className="text-xs text-[#5A6B78]">Memuat data pengguna dari Cloud Firestore...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Peran (Role)</th>
                    <th className="py-3 px-4 text-center">Status Aktif</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#1F2937]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => {
                      const isOwner = u.uid === user?.uid;
                      return (
                        <tr key={u.uid} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1F2937] flex items-center gap-2">
                              <span>{u.nama || "Tanpa Nama"}</span>
                              {isOwner && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                              UID: {u.uid}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{u.email || "-"}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getRoleBadge(
                                u.role
                              )}`}
                            >
                              {getRoleLabel(u.role)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {u.aktif ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#15A66A] border border-emerald-200">
                                <UserCheck className="w-3.5 h-3.5" />
                                Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#E53935] border border-red-200">
                                <UserX className="w-3.5 h-3.5" />
                                Nonaktif
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/admin/pengguna/${u.uid}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F5F2] hover:bg-orange-50 text-xs font-semibold text-[#EA580C] rounded-xl border border-slate-200/80 transition"
                            >
                              <span>Ubah Peran</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-[#5A6B78]">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
