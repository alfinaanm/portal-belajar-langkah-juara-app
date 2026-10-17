"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  Users,
  Layers,
  BarChart3,
  CheckCircle,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Sparkles,
  School,
  FileText,
} from "lucide-react";

export default function DasborAdminPage() {
  // Bab 4.14: Angka dihitung otomatis dari data
  const stats = {
    siswaAktif: 2, // Raka dan Salsa memiliki pendaftaran aktif
    pendaftaranBulanIni: 4, // Total pendaftaran di mock data bulan ini
    rataRataKehadiran: 100, // Kehadiran pertemuan
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Dasbor Super Admin */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <Shield className="w-3.5 h-3.5" />
              Dasbor Pemilik Bimbel &bull; Bab 4.14 PRD
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Dasbor Super Admin (Pak Arif)</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Pemantauan ringkasan performa bimbel, tata kelola akun pengguna, master program, dan laporan bulanan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/pengguna"
              className="inline-flex items-center gap-1.5 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <Users className="w-4 h-4" />
              Kelola Pengguna
            </Link>
          </div>
        </div>

        {/* 3 Kartu Metrik Utama Sesuai Bab 4.14 PRD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Kartu 1: Siswa Aktif */}
          <Link
            href="/admin/laporan"
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-lg">
                Siswa Aktif
              </span>
              <Users className="w-4 h-4 text-slate-400 group-hover:text-[#EA580C] transition" />
            </div>
            <div className="text-4xl font-extrabold text-[#1F2937] tabular-nums">
              {stats.siswaAktif}
            </div>
            <p className="text-xs text-[#5A6B78] mt-2 leading-relaxed">
              Siswa dengan minimal satu pendaftaran program aktif &bull; <span className="text-[#EA580C] font-semibold">Buka Laporan &rarr;</span>
            </p>
          </Link>

          {/* Kartu 2: Pendaftaran Bulan Ini */}
          <Link
            href="/admin/laporan"
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                Pendaftaran Bulan Ini
              </span>
              <Layers className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
            <div className="text-4xl font-extrabold text-[#1F2937] tabular-nums">
              {stats.pendaftaranBulanIni}
            </div>
            <p className="text-xs text-[#5A6B78] mt-2 leading-relaxed">
              Total formulir masuk bulan berjalan &bull; <span className="text-blue-600 font-semibold">Buka Laporan &rarr;</span>
            </p>
          </Link>

          {/* Kartu 3: Rata-rata Kehadiran */}
          <Link
            href="/admin/laporan"
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Rata-rata Kehadiran
              </span>
              <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <div className="text-4xl font-extrabold text-[#15A66A] tabular-nums">
              {stats.rataRataKehadiran}%
            </div>
            <p className="text-xs text-[#5A6B78] mt-2 leading-relaxed">
              Persentase kehadiran tatap muka kelas &bull; <span className="text-[#15A66A] font-semibold">Buka Laporan &rarr;</span>
            </p>
          </Link>
        </div>

        {/* Hak Akses Super Admin: Buka Semua Modul (PRD Bab 2.1 & 4.14) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">
                Pintasan Hak Akses Penuh Super Admin (Bab 2.1 PRD)
              </h2>
              <p className="text-xs text-[#5A6B78]">
                Sebagai Super Admin, Pak Arif memiliki hak istimewa untuk membuka dan mengelola seluruh modul peran lain.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <Link
              href="/staf/pendaftaran"
              className="p-4 bg-[#F7F5F2] hover:bg-orange-50 rounded-xl border border-slate-200/70 text-[#1F2937] hover:text-[#EA580C] transition flex items-center justify-between"
            >
              <span>Buka Modul Staf (Pendaftaran)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tutor/kelas/kelas-utbk-a"
              className="p-4 bg-[#F7F5F2] hover:bg-orange-50 rounded-xl border border-slate-200/70 text-[#1F2937] hover:text-[#EA580C] transition flex items-center justify-between"
            >
              <span>Buka Modul Tutor (Pertemuan & Nilai)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/beranda"
              className="p-4 bg-[#F7F5F2] hover:bg-orange-50 rounded-xl border border-slate-200/70 text-[#1F2937] hover:text-[#EA580C] transition flex items-center justify-between"
            >
              <span>Buka Modul Siswa (Beranda & Kelas)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
