"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { mockPendaftaran, mockKelas } from "@/lib/mockData";
import {
  Users,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  Sparkles,
  School,
} from "lucide-react";

export default function DasborStafPage() {
  const pendaftaranMenunggu = mockPendaftaran.filter((p) => p.status === "menunggu");
  const kelasHariIni = mockKelas; // Simulasi kelas yang berjalan

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Dasbor Staf */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <ClipboardList className="w-3.5 h-3.5" />
              Dasbor Administrasi &bull; Bab 4.7 PRD
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Dasbor Staf (Kak Fira)</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Kelola verifikasi pendaftaran program, penyusunan kelas belajar, dan data siswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/staf/kelas"
              className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <School className="w-4 h-4" />
              Kelola Kelas
            </Link>
          </div>
        </div>

        {/* 2 Kartu Utama Sesuai Bab 4.7 PRD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kartu 1: Pendaftaran Menunggu */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Verifikasi Pembayaran
                </span>
                <span className="text-xs text-[#5A6B78]">Menunggu Konfirmasi</span>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <Link
                  href="/staf/pendaftaran?status=menunggu"
                  className="text-5xl font-extrabold text-[#F59E0B] hover:text-amber-600 transition tabular-nums"
                >
                  {pendaftaranMenunggu.length}
                </Link>
                <span className="text-sm font-semibold text-[#1F2937]">Pendaftaran Menunggu</span>
              </div>

              <p className="text-xs text-[#5A6B78] leading-relaxed">
                Calon siswa telah mengajukan program belajar dan menunggu konfirmasi bukti bayar di kantor Bimbel Langkah Juara.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/staf/pendaftaran?status=menunggu"
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"
              >
                Periksa Pendaftaran Menunggu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Kartu 2: Kelas Hari Ini */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-lg">
                  Operasional Bimbel
                </span>
                <span className="text-xs text-[#5A6B78] tabular-nums">
                  Selasa, 18 Oktober 2026
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#1F2937] mb-3">Kelas Hari Ini</h2>

              <div className="space-y-3">
                {kelasHariIni.map((k) => (
                  <div
                    key={k.id}
                    className="p-3 bg-[#F7F5F2] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#1F2937]">{k.nama}</div>
                      <div className="text-[#5A6B78] mt-0.5">
                        Tutor: {k.tutorNama} &bull; {k.tempat}
                      </div>
                    </div>
                    <div className="font-semibold text-[#EA580C] tabular-nums">
                      {k.jam} WITA
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/staf/kelas"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"
              >
                Lihat Jadwal Lengkap Kelas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Akses Cepat Staf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/staf/pendaftaran"
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm text-[#1F2937] group-hover:text-[#EA580C] transition">
                Tabel Seluruh Pendaftaran Siswa &rarr;
              </div>
              <div className="text-xs text-[#5A6B78] mt-1">Filter status Menunggu, Aktif, dan Ditolak</div>
            </div>
            <CheckCircle className="w-6 h-6 text-[#15A66A]" />
          </Link>

          <Link
            href="/staf/siswa"
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-300 transition flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm text-[#1F2937] group-hover:text-[#EA580C] transition">
                Data Kontak Siswa & Orang Tua &rarr;
              </div>
              <div className="text-xs text-[#5A6B78] mt-1">Cari nomor telepon orang tua untuk penanganan presensi</div>
            </div>
            <Users className="w-6 h-6 text-[#EA580C]" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
