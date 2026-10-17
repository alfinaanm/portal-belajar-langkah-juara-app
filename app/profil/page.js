"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { mockUsers } from "@/lib/mockData";
import { User, Mail, Phone, Shield, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function ProfilPage() {
  const [currentUser, setCurrentUser] = useState(mockUsers[0]); // Raka Pratama (siswa)
  const [nama, setNama] = useState(currentUser.nama);
  const [noHp, setNoHp] = useState(currentUser.noHp);
  const [noHpOrangTua, setNoHpOrangTua] = useState(currentUser.noHpOrangTua || "");
  const [pesan, setPesan] = useState({ tipe: "", teks: "" });

  const handleSimpan = (e) => {
    e.preventDefault();

    // Validasi Bab 4.6: nomor HP hanya angka, 10-13 digit, diawali 08
    const hpRegex = /^08\d{8,11}$/;

    if (noHp && !hpRegex.test(noHp)) {
      setPesan({
        tipe: "error",
        teks: "Nomor HP harus berupa angka 10 s.d 13 digit dan wajib diawali '08'.",
      });
      return;
    }

    if (currentUser.role === "siswa" && noHpOrangTua && !hpRegex.test(noHpOrangTua)) {
      setPesan({
        tipe: "error",
        teks: "Nomor HP Orang Tua harus berupa angka 10 s.d 13 digit dan wajib diawali '08'.",
      });
      return;
    }

    setCurrentUser({
      ...currentUser,
      nama,
      noHp,
      noHpOrangTua: currentUser.role === "siswa" ? noHpOrangTua : currentUser.noHpOrangTua,
    });

    setPesan({
      tipe: "success",
      teks: "Profil berhasil diperbarui sesuai aturan Bab 4.6 PRD!",
    });

    setTimeout(() => setPesan({ tipe: "", teks: "" }), 5000);
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <User className="w-3.5 h-3.5" />
            Pengaturan Akun &bull; Bab 4.6 PRD
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Profil Pengguna</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Kelola data identitas dan kontak darurat Anda.
          </p>
        </div>

        {pesan.teks && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              pesan.tipe === "success"
                ? "bg-emerald-50 text-[#15A66A] border border-emerald-200"
                : "bg-red-50 text-[#E53935] border border-red-200"
            }`}
          >
            {pesan.tipe === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{pesan.teks}</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <form onSubmit={handleSimpan} className="space-y-4">
            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-semibold text-[#5A6B78] uppercase tracking-wider mb-1.5">
                Alamat Email (Tidak dapat diubah)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-[#5A6B78] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Peran / Role (Readonly) */}
            <div>
              <label className="block text-xs font-semibold text-[#5A6B78] uppercase tracking-wider mb-1.5">
                Peran Pengguna (Dikelola Super Admin)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={currentUser.role}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-[#5A6B78] font-bold uppercase cursor-not-allowed"
                />
              </div>
            </div>

            {/* Nama Lengkap (Bisa diubah) */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                Nama Lengkap *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Nomor HP (Bisa diubah) */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                Nomor HP * (10-13 Digit, diawali 08)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Nomor HP Orang Tua (Khusus Siswa) */}
            {currentUser.role === "siswa" && (
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                  Nomor HP Orang Tua * (10-13 Digit, diawali 08)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={noHpOrangTua}
                    onChange={(e) => setNoHpOrangTua(e.target.value)}
                    placeholder="081298765432"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                    required
                  />
                </div>
                <p className="text-xs text-[#5A6B78] mt-1">
                  Dipakai oleh staf bimbingan belajar untuk koordinasi kehadiran dan informasi penting.
                </p>
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold rounded-xl text-sm shadow-xs transition"
              >
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
