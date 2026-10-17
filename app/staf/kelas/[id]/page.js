"use client";

import { useParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { mockKelas, mockUsers, mockPendaftaran } from "@/lib/mockData";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Plus,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

function RincianKelolaKelasContent() {
  const params = useParams();
  const kelasId = params?.id || "kelas-utbk-a";

  const initialKelas = mockKelas.find((k) => k.id === kelasId) || mockKelas[0];
  const [kelas, setKelas] = useState(initialKelas);
  const [siswaDiKelas, setSiswaDiKelas] = useState(
    mockUsers.filter((u) => kelas.siswaIds.includes(u.uid))
  );

  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [toast, setToast] = useState("");

  // Bab 4.9 Validasi: Hanya siswa yang memiliki pendaftaran aktif untuk program itu yang boleh dimasukkan
  const calonSiswaAktif = mockPendaftaran
    .filter((p) => p.programId === kelas.programId && p.status === "aktif")
    .map((p) => mockUsers.find((u) => u.uid === p.siswaId))
    .filter((u) => u && !kelas.siswaIds.includes(u.uid));

  const handleTambahSiswa = (e) => {
    e.preventDefault();
    if (!selectedSiswaId) return;

    const siswaObj = mockUsers.find((u) => u.uid === selectedSiswaId);
    if (!siswaObj) return;

    setSiswaDiKelas([...siswaDiKelas, siswaObj]);
    setKelas({
      ...kelas,
      siswaIds: [...kelas.siswaIds, siswaObj.uid],
    });

    setIsTambahModalOpen(false);
    setSelectedSiswaId("");
    setToast(`${siswaObj.nama} berhasil dimasukkan ke ${kelas.nama}. Siswa langsung dapat melihat kelas ini di menu Kelas Saya.`);
    setTimeout(() => setToast(""), 6000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/staf/kelas"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Kelas
        </Link>
        <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold">
          PRD Bab 4.9 &bull; Rincian Kelas Staf
        </span>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Info Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {kelas.programNama}
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{kelas.nama}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#5A6B78]">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#EA580C]" />
                <span>Tutor: <strong className="text-[#1F2937]">{kelas.tutorNama}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#EA580C]" />
                <span>Hari: <strong className="text-[#1F2937]">{kelas.hari}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 tabular-nums">
                <Clock className="w-4 h-4 text-[#EA580C]" />
                <span>Waktu: <strong className="text-[#1F2937]">{kelas.jam} WITA</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EA580C]" />
                <span>Tempat: <strong className="text-[#1F2937]">{kelas.tempat}</strong></span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTambahModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Siswa ke Kelas
          </button>
        </div>
      </div>

      {/* Catatan Hak Akses Staf Bab 4.9 */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Batasan Hak Akses Staf (Bab 4.9 PRD):</strong> Staf hanya berhak menyusun rombongan belajar dan memasukkan siswa aktif. Staf <strong>tidak bisa</strong> membuat pertemuan, mengisi presensi, atau memberi/mengubah nilai tugas.
        </div>
      </div>

      {/* Tabel Siswa yang Terdaftar di Kelas Ini */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#1F2937] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#EA580C]" />
            Siswa Terdaftar ({siswaDiKelas.length} Siswa)
          </h2>
          <span className="text-xs text-[#5A6B78]">Pendaftaran Berstatus Aktif</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Nomor HP Siswa</th>
                <th className="py-3 px-4">Nomor HP Orang Tua</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1F2937]">
              {siswaDiKelas.map((s) => (
                <tr key={s.uid} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold">{s.nama}</td>
                  <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{s.email}</td>
                  <td className="py-3.5 px-4 text-xs tabular-nums">{s.noHp || "-"}</td>
                  <td className="py-3.5 px-4 text-xs tabular-nums text-[#5A6B78]">
                    {s.noHpOrangTua || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#15A66A] border border-emerald-200">
                      Aktif di Kelas
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Siswa */}
      {isTambahModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">Tambah Siswa ke {kelas.nama}</h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Sesuai PRD 4.9: Hanya siswa dengan pendaftaran berstatus <strong>aktif</strong> untuk program ini yang dapat dimasukkan.
            </p>

            {calonSiswaAktif.length > 0 ? (
              <form onSubmit={handleTambahSiswa} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                    Pilih Siswa Aktif:
                  </label>
                  <select
                    value={selectedSiswaId}
                    onChange={(e) => setSelectedSiswaId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {calonSiswaAktif.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.nama} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsTambahModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedSiswaId}
                    className="px-4 py-2 bg-[#EA580C] hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs"
                  >
                    Simpan ke Kelas
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#5A6B78] p-3 bg-slate-50 rounded-xl">
                  Tidak ada siswa baru dengan status pendaftaran aktif untuk program ini.
                </p>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsTambahModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RincianKelolaKelasPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat rincian kelas...</div>}>
        <RincianKelolaKelasContent />
      </Suspense>
    </AppShell>
  );
}
