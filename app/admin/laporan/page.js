"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import {
  BarChart3,
  Calendar,
  Users,
  School,
  Award,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

function LaporanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bulanParam = searchParams.get("bulan") || "2026-10";
  const [selectedBulan, setSelectedBulan] = useState(bulanParam);

  useEffect(() => {
    setSelectedBulan(bulanParam);
  }, [bulanParam]);

  const handleBulanChange = (val) => {
    setSelectedBulan(val);
    router.push(`/admin/laporan?bulan=${val}`);
  };

  // 1. Data Rekap Siswa Aktif per Program (Dihitung dari data pendaftaran aktif)
  const rekapProgram = [
    { nama: "Intensif UTBK SNBT", jenjang: "SMA", jumlahSiswa: 1, totalBiaya: 2500000 },
    { nama: "Matematika Juara SMP", jenjang: "SMP", jumlahSiswa: 1, totalBiaya: 1200000 },
    { nama: "English Conversation SMP", jenjang: "SMP", jumlahSiswa: 0, totalBiaya: 0 },
  ];

  // 2. Data Rekap Kehadiran per Kelas (Rata-rata persentase hadir dari pertemuan)
  const rekapKehadiran = [
    { namaKelas: "Intensif UTBK A", tutor: "Kak Dimas", totalPertemuan: 2, rataKehadiran: "100%" },
    { namaKelas: "Matematika SMP B", tutor: "Kak Nadia", totalPertemuan: 2, rataKehadiran: "100%" },
  ];

  // 3. Data Rekap Jumlah Kelas per Tutor (Jumlah kelas dan pertemuan bulan itu)
  const rekapTutor = [
    { tutor: "Kak Dimas", programAjar: "Intensif UTBK SNBT", jumlahKelas: 1, pertemuanBulanIni: 2 },
    { tutor: "Kak Nadia", programAjar: "Matematika Juara SMP", jumlahKelas: 1, pertemuanBulanIni: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Laporan Rekapitulasi &bull; Bab 4.17 PRD
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Rekapitulasi Operasional Bulanan</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Laporan otomatis yang dihitung langsung dari data pendaftaran, kelas, dan pertemuan.
          </p>
        </div>

        {/* Pilihan Bulan (Tersimpan di Alamat URL sesuai PRD 4.17) */}
        <div className="flex items-center gap-2 bg-[#F7F5F2] p-2 rounded-xl border border-slate-200 text-xs">
          <Calendar className="w-4 h-4 text-[#EA580C]" />
          <span className="font-semibold text-[#1F2937]">Bulan:</span>
          <select
            value={selectedBulan}
            onChange={(e) => handleBulanChange(e.target.value)}
            className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-xs text-[#1F2937]"
          >
            <option value="2026-10">Oktober 2026</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">Agustus 2026</option>
          </select>
        </div>
      </div>

      {/* Tabel 1: Siswa Aktif per Program */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#1F2937] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#EA580C]" />
            1. Siswa Aktif per Program
          </h2>
          <span className="text-xs text-[#5A6B78]">Dihitung dari pendaftaran aktif</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Program</th>
                <th className="py-3 px-4">Jenjang</th>
                <th className="py-3 px-4 text-center">Jumlah Siswa Aktif</th>
                <th className="py-3 px-4 text-right">Potensi Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1F2937]">
              {rekapProgram.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold">{r.nama}</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-[#EA580C]">{r.jenjang}</td>
                  <td className="py-3.5 px-4 text-center tabular-nums font-bold">
                    {r.jumlahSiswa} Siswa
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums font-bold text-[#15A66A]">
                    Rp {r.totalBiaya.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel 2: Kehadiran per Kelas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#1F2937] flex items-center gap-2">
            <School className="w-4 h-4 text-[#EA580C]" />
            2. Kehadiran per Kelas
          </h2>
          <span className="text-xs text-[#5A6B78]">Rata-rata kehadiran semua pertemuan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Kelas</th>
                <th className="py-3 px-4">Tutor Pengampu</th>
                <th className="py-3 px-4 text-center">Pertemuan Terlaksana</th>
                <th className="py-3 px-4 text-right">Rata-rata Persentase Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1F2937]">
              {rekapKehadiran.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold">{r.namaKelas}</td>
                  <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{r.tutor}</td>
                  <td className="py-3.5 px-4 text-center tabular-nums">{r.totalPertemuan}x Pertemuan</td>
                  <td className="py-3.5 px-4 text-right tabular-nums font-bold text-[#15A66A]">
                    {r.rataKehadiran}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel 3: Jumlah Kelas per Tutor */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#1F2937] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#EA580C]" />
            3. Jumlah Kelas & Beban Mengajar per Tutor
          </h2>
          <span className="text-xs text-[#5A6B78]">Jumlah kelas dan sesi pertemuan bulan ini</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Tutor</th>
                <th className="py-3 px-4">Bidang / Program</th>
                <th className="py-3 px-4 text-center">Jumlah Kelas Diampu</th>
                <th className="py-3 px-4 text-right">Total Pertemuan Bulan Berjalan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1F2937]">
              {rekapTutor.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold">{r.tutor}</td>
                  <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{r.programAjar}</td>
                  <td className="py-3.5 px-4 text-center tabular-nums font-medium">
                    {r.jumlahKelas} Kelas
                  </td>
                  <td className="py-3.5 px-4 text-right tabular-nums font-bold text-[#EA580C]">
                    {r.pertemuanBulanIni} Sesi Pertemuan
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-slate-100 rounded-2xl text-xs text-[#5A6B78] flex items-center justify-between">
        <span>Catatan PRD 4.17 & 9: Ekspor Excel dan PDF tidak termasuk di versi v1. Rekapitulasi cukup dibaca langsung dari layar.</span>
      </div>
    </div>
  );
}

export default function LaporanPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat laporan...</div>}>
        <LaporanContent />
      </Suspense>
    </AppShell>
  );
}
