"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { mockKelas, mockTugas } from "@/lib/mockData";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  BookOpen,
  FileText,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function BerandaPage() {
  const kelasBerikutnya = mockKelas[0]; // Intensif UTBK A
  const tugasAktif = mockTugas[0]; // Latihan Penalaran Umum 3

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Sambutan */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Portal Siswa &bull; Beranda (PRD 4.2)
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Halo, Raka Pratama! 👋</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Selamat datang kembali. Cek jadwal tatap muka dan tugas kelas aktifmu hari ini.
            </p>
          </div>
          <Link
            href="/program"
            className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] hover:bg-orange-100 font-semibold px-4 py-2 rounded-xl text-sm transition"
          >
            Lihat Program Lainnya
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid Kartu Utama Bab 4.2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kartu 1: Kelas Berikutnya */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-lg">
                  Kelas Berikutnya
                </span>
                <span className="text-xs text-[#5A6B78]">Tatap Muka Terdekat</span>
              </div>

              {kelasBerikutnya ? (
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-[#1F2937]">
                    {kelasBerikutnya.nama}
                  </h2>
                  <p className="text-xs text-[#5A6B78]">
                    Program: {kelasBerikutnya.programNama} &bull; Tutor: <strong>{kelasBerikutnya.tutorNama}</strong>
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-sm text-[#1F2937]">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#EA580C]" />
                      <span>{kelasBerikutnya.hari}</span>
                    </div>
                    <div className="flex items-center gap-2.5 tabular-nums">
                      <Clock className="w-4 h-4 text-[#EA580C]" />
                      <span>{kelasBerikutnya.jam} WITA</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#EA580C]" />
                      <span>{kelasBerikutnya.tempat}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-[#5A6B78] mb-3">Anda belum terdaftar di kelas mana pun.</p>
                  <Link
                    href="/program"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] hover:underline"
                  >
                    Buka Katalog Program &rarr;
                  </Link>
                </div>
              )}
            </div>

            {kelasBerikutnya && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/kelas/${kelasBerikutnya.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"
                >
                  Buka Rincian Kelas
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Kartu 2: Tugas Belum Dikumpulkan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Tugas Belum Dikumpulkan
                </span>
                <span className="text-xs text-[#5A6B78]">Batas Waktu Terdekat</span>
              </div>

              {tugasAktif ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xl font-bold text-[#1F2937]">
                      {tugasAktif.judul}
                    </h2>
                    <StatusBadge status="Belum dikumpulkan" />
                  </div>
                  <p className="text-xs text-[#5A6B78]">
                    Kelas: <strong>{tugasAktif.kelasNama}</strong>
                  </p>
                  <p className="text-xs text-[#5A6B78] line-clamp-2">
                    {tugasAktif.deskripsi}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-sm flex items-center gap-2 text-red-600 font-medium tabular-nums">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Batas Waktu: 25 Oktober 2026, 23:59 WITA</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-[#5A6B78]">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Semua tugas sudah kamu kumpulkan! Kerja bagus!
                </div>
              )}
            </div>

            {tugasAktif && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/tugas/${tugasAktif.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"
                >
                  Kumpulkan Tugas Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Ringkasan Belajar Siswa */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h2 className="text-base font-bold text-[#1F2937] mb-3">Panduan Singkat Siswa Langkah Juara</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5A6B78]">
            <div className="p-3.5 bg-[#F7F5F2] rounded-xl">
              <div className="font-semibold text-[#1F2937] mb-1">1. Ikuti Pertemuan</div>
              Pastikan hadir tepat waktu di ruang kelas atau buka tautan materi yang disediakan tutor di menu Kelas Saya.
            </div>
            <div className="p-3.5 bg-[#F7F5F2] rounded-xl">
              <div className="font-semibold text-[#1F2937] mb-1">2. Kerjakan Tugas</div>
              Simpan berkas pengerjaan di Google Drive, atur akses publik, lalu kirimkan tautannya sebelum batas waktu.
            </div>
            <div className="p-3.5 bg-[#F7F5F2] rounded-xl">
              <div className="font-semibold text-[#1F2937] mb-1">3. Cek Nilai & Komentar</div>
              Setelah dinilai tutor, kamu dapat membaca masukan personal untuk meningkatkan pemahamanmu.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
