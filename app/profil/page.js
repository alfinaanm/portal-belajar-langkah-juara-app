"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { mockUsers } from "@/lib/mockData";
import { User, Mail, Phone, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ProfilPage() {
  const { user, userProfile, loading } = useAuth();

  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [noHpOrangTua, setNoHpOrangTua] = useState("");
  const [pesan, setPesan] = useState({ tipe: "", teks: "" });
  const [saving, setSaving] = useState(false);

  // Sinkronisasi data form dengan data profil aktif
  useEffect(() => {
    if (userProfile) {
      setNama(userProfile.nama || "");
      setNoHp(userProfile.noHp || "");
      setNoHpOrangTua(userProfile.noHpOrangTua || "");
    } else if (!loading) {
      // Fallback demo mock user jika belum login
      const fallback = mockUsers[0];
      setNama(fallback.nama);
      setNoHp(fallback.noHp);
      setNoHpOrangTua(fallback.noHpOrangTua || "");
    }
  }, [userProfile, loading]);

  const activeRole = userProfile?.role || "siswa";
  const activeEmail = userProfile?.email || user?.email || mockUsers[0].email;

  const handleSimpan = async (e) => {
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

    if (activeRole === "siswa" && noHpOrangTua && !hpRegex.test(noHpOrangTua)) {
      setPesan({
        tipe: "error",
        teks: "Nomor HP Orang Tua harus berupa angka 10 s.d 13 digit dan wajib diawali '08'.",
      });
      return;
    }

    setSaving(true);
    setPesan({ tipe: "", teks: "" });

    try {
      if (user?.uid) {
        // Simpan langsung ke dokumen users/{uid} di Firestore
        const userDocRef = doc(db, "users", user.uid);
        const updates = {
          nama: nama.trim(),
          noHp: noHp.trim(),
        };
        if (activeRole === "siswa") {
          updates.noHpOrangTua = noHpOrangTua.trim();
        }

        await updateDoc(userDocRef, updates);
      }

      setPesan({
        tipe: "success",
        teks: "Profil berhasil diperbarui di Firestore sesuai aturan Bab 4.6 PRD!",
      });
    } catch (err) {
      setPesan({
        tipe: "error",
        teks: err.message || "Gagal memperbarui profil di Firestore.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setPesan({ tipe: "", teks: "" }), 5000);
    }
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
                  value={activeEmail}
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
                  value={activeRole}
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
                  disabled={saving}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* Nomor HP (Bisa diubah) */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                Nomor HP (10-13 Digit, diawali 08, boleh kosong)
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
                  disabled={saving}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition disabled:opacity-60"
                />
              </div>
            </div>

            {/* Nomor HP Orang Tua (Khusus Siswa) */}
            {activeRole === "siswa" && (
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                  Nomor HP Orang Tua (10-13 Digit, diawali 08, boleh kosong)
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
                    disabled={saving}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition disabled:opacity-60"
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
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold rounded-xl text-sm shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan Perubahan Profil</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
