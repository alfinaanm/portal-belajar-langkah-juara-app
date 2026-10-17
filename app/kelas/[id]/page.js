"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { mockKelas, mockPertemuan, mockTugas } from "@/lib/mockData";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
  FileText,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

function RincianKelasContent() {
  const params = useParams();
  const kelasId = params?.id || "kelas-utbk-a";

  const kelas = mockKelas.find((k) => k.id === kelasId) || mockKelas[0];
  const pertemuanList = mockPertemuan.filter((p) => p.kelasId === kelas.id);
  const tugasList = mockTugas.filter((t) => t.kelasId === kelas.id);

  if (!kelas) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1F2937]">Kelas Tidak Ditemukan</h2>
        <p className="text-sm text-[#5A6B78] mt-1">ID kelas yang Anda tuju tidak terdaftar di sistem.</p>
        <Link
          href="/kelas"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#EA580C] font-semibold hover:underline"
        >
          &larr; Kembali ke Daftar Kelas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tombol Kembali & Info Singkat */}
      <div className="flex items-center justify-between">
        <Link
          href="/kelas"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Kelas
        </Link>
        <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold">
          PRD Bab 4.4 &bull; Rincian Kelas
        </span>
      </div>

      {/* Panel Informasi Utama Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#EA580C] mb-1">
              {kelas.programNama}
            </div>
            <h1 className="text-2xl font-extrabold text-[#1F2937]">{kelas.nama}</h1>
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
        </div>
      </div>

      {/* Bagian 1: Daftar Pertemuan & Tautan Materi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#EA580C]" />
              Daftar Pertemuan & Tautan Materi
            </h2>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Buka materi pendukung yang dibagikan oleh tutor kelas Anda.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {pertemuanList.length > 0 ? (
            pertemuanList.map((meet, idx) => (
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
                </div>

                <div>
                  {meet.materiUrl ? (
                    <a
                      href={meet.materiUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-orange-700 px-3.5 py-1.5 rounded-lg transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Materi
                    </a>
                  ) : (
                    <span className="text-xs text-[#5A6B78] italic">Materi belum diunggah</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#5A6B78] py-4">Belum ada pertemuan terjadwal.</p>
          )}
        </div>
      </div>

      {/* Bagian 2: Daftar Tugas Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#EA580C]" />
              Daftar Tugas Kelas
            </h2>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Kumpulkan jawaban sebelum batas waktu berakhir.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {tugasList.length > 0 ? (
            tugasList.map((tugas) => (
              <div
                key={tugas.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition"
              >
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-sm font-semibold text-[#1F2937]">{tugas.judul}</h3>
                  <p className="text-xs text-[#5A6B78] line-clamp-1">{tugas.deskripsi}</p>
                  <div className="text-xs text-red-600 font-medium tabular-nums">
                    Batas Pengumpulan: 25 Oktober 2026, 23:59 WITA
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status="Belum dikumpulkan" />
                  <Link
                    href={`/tugas/${tugas.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:underline"
                  >
                    Buka Tugas &rarr;
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#5A6B78] py-4">Belum ada tugas untuk kelas ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RincianKelasPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat rincian kelas...</div>}>
        <RincianKelasContent />
      </Suspense>
    </AppShell>
  );
}
