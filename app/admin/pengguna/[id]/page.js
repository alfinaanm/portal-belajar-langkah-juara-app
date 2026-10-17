"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { mockUsers } from "@/lib/mockData";
import {
  Users,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";

function UbahPenggunaContent() {
  const params = useParams();
  const router = useRouter();
  const uid = params?.id || "tutor-nadia";

  const initialUser = mockUsers.find((u) => u.uid === uid) || mockUsers[4];
  const [user, setUser] = useState(initialUser);
  const [role, setRole] = useState(initialUser.role);
  const [aktif, setAktif] = useState(initialUser.aktif);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const isSuperAdminSelf = user.uid === "admin-arif";

  const handleSimpan = (e) => {
    e.preventDefault();

    // Validasi Bab 4.15: Super Admin tidak bisa menurunkan peran atau menonaktifkan akunnya sendiri
    if (isSuperAdminSelf && (role !== "super_admin" || !aktif)) {
      setError("Super Admin tidak bisa menurunkan peran atau menonaktifkan akunnya sendiri.");
      return;
    }

    const updated = {
      ...user,
      role,
      aktif,
    };

    setUser(updated);
    setError("");
    setToast(`Perubahan untuk "${user.nama}" berhasil disimpan! Peran: ${role.toUpperCase()}, Status Aktif: ${aktif ? "Ya" : "Tidak"}.`);
    setTimeout(() => setToast(""), 6000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/pengguna"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kelola Pengguna
        </Link>
        <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold">
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
            Detail Dokumen Akun
          </span>
          <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{user.nama}</h1>
          <p className="text-xs text-[#5A6B78] mt-1">UID: {user.uid} &bull; Email: {user.email}</p>
        </div>

        <form onSubmit={handleSimpan} className="space-y-5 border-t border-slate-100 pt-5">
          {/* Pilihan Peran */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-2">
              Pilih Peran Akun (Role) *
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { key: "siswa", label: "Siswa", desc: "Mendaftar, kelas, tugas miliknya" },
                { key: "staf", label: "Staf", desc: "Pendaftaran & susun kelas" },
                { key: "tutor", label: "Tutor", desc: "Pertemuan, presensi, tugas & nilai" },
                { key: "super_admin", label: "Super Admin", desc: "Pemilik & akses seluruh modul" },
              ].map((r) => (
                <label
                  key={r.key}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    role === r.key
                      ? "border-[#EA580C] bg-orange-50/70 text-[#1F2937]"
                      : "border-slate-200 hover:bg-slate-50 text-[#5A6B78]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold uppercase text-[#1F2937]">{r.label}</span>
                    <input
                      type="radio"
                      name="role"
                      value={r.key}
                      checked={role === r.key}
                      onChange={(e) => setRole(e.target.value)}
                      className="text-[#EA580C] focus:ring-[#EA580C]"
                    />
                  </div>
                  <div className="text-[11px] leading-tight">{r.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Toggle Status Aktif */}
          <div className="p-4 bg-[#F7F5F2] rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#1F2937]">Status Keaktifan Akun</div>
              <div className="text-[11px] text-[#5A6B78] mt-0.5">
                Bila dinonaktifkan, pengguna tidak dapat masuk ke aplikasi namun data tetap tersimpan aman.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aktif}
                onChange={(e) => setAktif(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#15A66A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push("/admin/pengguna")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Simpan Peran & Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UbahPenggunaPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat data akun...</div>}>
        <UbahPenggunaContent />
      </Suspense>
    </AppShell>
  );
}
