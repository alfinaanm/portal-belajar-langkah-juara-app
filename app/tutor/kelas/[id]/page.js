"use client";

import { useParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  mockKelas,
  mockPertemuan,
  mockTugas,
  mockUsers,
} from "@/lib/mockData";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  BookOpen,
  FileText,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";

function KelasDiajarContent() {
  const params = useParams();
  const kelasId = params?.id || "kelas-utbk-a";

  const kelas = mockKelas.find((k) => k.id === kelasId) || mockKelas[0];
  const [pertemuanList, setPertemuanList] = useState(
    mockPertemuan.filter((p) => p.kelasId === kelas.id)
  );
  const [tugasList, setTugasList] = useState(
    mockTugas.filter((t) => t.kelasId === kelas.id)
  );
  const siswaDiKelas = mockUsers.filter((u) => kelas.siswaIds.includes(u.uid));

  // Modal Buat Pertemuan
  const [isPertemuanModalOpen, setIsPertemuanModalOpen] = useState(false);
  const [tanggal, setTanggal] = useState("2026-10-18");
  const [topik, setTopik] = useState("");
  const [materiUrl, setMateriUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // Presensi State (per pertemuan terpilih)
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);
  const [hadirSiswaIds, setHadirSiswaIds] = useState([]);
  const [toast, setToast] = useState("");

  const handleBuatPertemuan = (e) => {
    e.preventDefault();
    if (materiUrl && !materiUrl.startsWith("https://")) {
      setUrlError("Tautan materi bila diisi wajib diawali https://");
      return;
    }

    const newPertemuan = {
      id: `meet-${Date.now()}`,
      kelasId: kelas.id,
      tanggal,
      topik,
      materiUrl,
      hadirIds: [],
    };

    setPertemuanList([...pertemuanList, newPertemuan]);
    setIsPertemuanModalOpen(false);
    setTopik("");
    setMateriUrl("");
    setUrlError("");
    setToast("Pertemuan baru berhasil disimpan! Siswa dapat langsung melihatnya di Kelas Saya.");
    setTimeout(() => setToast(""), 6000);
  };

  const handleOpenPresensi = (meet) => {
    setSelectedPertemuan(meet);
    setHadirSiswaIds(meet.hadirIds || []);
  };

  const togglePresensi = (uid) => {
    if (hadirSiswaIds.includes(uid)) {
      setHadirSiswaIds(hadirSiswaIds.filter((id) => id !== uid));
    } else {
      setHadirSiswaIds([...hadirSiswaIds, uid]);
    }
  };

  const handleSimpanPresensi = () => {
    const updated = pertemuanList.map((p) =>
      p.id === selectedPertemuan.id ? { ...p, hadirIds: hadirSiswaIds } : p
    );
    setPertemuanList(updated);
    setSelectedPertemuan(null);
    setToast(`Presensi untuk "${selectedPertemuan.topik}" berhasil diperbarui!`);
    setTimeout(() => setToast(""), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/tutor"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dasbor Tutor
        </Link>
        <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold">
          PRD Bab 4.12 &bull; Kelas yang Diajar
        </span>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Informasi Utama Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {kelas.programNama}
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{kelas.nama}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#5A6B78]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#EA580C]" />
                <span>Jadwal: <strong className="text-[#1F2937]">{kelas.hari}, {kelas.jam} WITA</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EA580C]" />
                <span>Lokasi: <strong className="text-[#1F2937]">{kelas.tempat}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#EA580C]" />
                <span>Jumlah Siswa: <strong className="text-[#1F2937]">{siswaDiKelas.length} Siswa</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPertemuanModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Buat Pertemuan
            </button>
            <Link
              href={`/tutor/tugas/${tugasList[0]?.id || "tugas-pu-3"}`}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <FileText className="w-4 h-4" />
              Kelola Tugas & Nilai
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Daftar Pertemuan & Presensi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#EA580C]" />
            Pertemuan & Presensi Kehadiran ({pertemuanList.length} Pertemuan)
          </h2>
          <span className="text-xs text-[#5A6B78]">Klik presensi untuk mencentang siswa</span>
        </div>

        <div className="divide-y divide-slate-100">
          {pertemuanList.map((meet, idx) => (
            <div
              key={meet.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-md">
                    Pertemuan {idx + 1}
                  </span>
                  <span className="text-xs text-[#5A6B78] tabular-nums">{meet.tanggal}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1F2937]">{meet.topik}</h3>
                <div className="text-xs text-[#5A6B78] flex items-center gap-2">
                  <span>Hadir: <strong>{meet.hadirIds?.length || 0}</strong> dari {siswaDiKelas.length} siswa</span>
                  {meet.materiUrl && (
                    <a
                      href={meet.materiUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#EA580C] hover:underline ml-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Tautan Materi
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenPresensi(meet)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EA580C]/10 text-[#EA580C] hover:bg-[#EA580C] hover:text-white rounded-lg text-xs font-semibold transition"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Isi Presensi Kehadiran
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Daftar Siswa di Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-[#1F2937] mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#EA580C]" />
          Daftar Siswa Kelas Ini
        </h2>
        <div className="divide-y divide-slate-100 text-xs">
          {siswaDiKelas.map((s) => (
            <div key={s.uid} className="py-2.5 flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#1F2937]">{s.nama}</div>
                <div className="text-[#5A6B78]">{s.email}</div>
              </div>
              <div className="text-[#5A6B78] tabular-nums">HP: {s.noHp || "-"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Buat Pertemuan (Bab 4.12 PRD) */}
      {isPertemuanModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">Buat Pertemuan Baru</h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Pertemuan dan materi akan langsung muncul di halaman Kelas Saya milik siswa.
            </p>

            {urlError && (
              <div className="p-3 mb-3 bg-red-50 text-[#E53935] border border-red-200 rounded-xl text-xs font-semibold">
                {urlError}
              </div>
            )}

            <form onSubmit={handleBuatPertemuan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Tanggal Pertemuan *
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Topik Bahasan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Persamaan Linear Satu Variabel"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Tautan Materi (Wajib diawali https:// bila diisi)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={materiUrl}
                  onChange={(e) => setMateriUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPertemuanModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Simpan Pertemuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Presensi Siswa (Bab 4.12 PRD) */}
      {selectedPertemuan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">
              Presensi Kehadiran Siswa
            </h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Pertemuan: <strong>{selectedPertemuan.topik}</strong> ({selectedPertemuan.tanggal}). Centang siswa yang hadir di ruang kelas:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-slate-100 py-1">
              {siswaDiKelas.map((s) => {
                const isHadir = hadirSiswaIds.includes(s.uid);
                return (
                  <div
                    key={s.uid}
                    onClick={() => togglePresensi(s.uid)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 cursor-pointer transition select-none"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#1F2937]">{s.nama}</div>
                      <div className="text-[11px] text-[#5A6B78]">{s.email}</div>
                    </div>
                    <div className="text-[#EA580C]">
                      {isHadir ? (
                        <CheckSquare className="w-5 h-5 text-[#15A66A]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
              <span className="text-xs text-[#5A6B78]">
                {hadirSiswaIds.length} dari {siswaDiKelas.length} siswa hadir
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPertemuan(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSimpanPresensi}
                  className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Simpan Presensi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KelasDiajarPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat kelas yang diajar...</div>}>
        <KelasDiajarContent />
      </Suspense>
    </AppShell>
  );
}
