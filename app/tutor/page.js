"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { mockKelas, mockUsers } from "@/lib/mockData";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  User,
  Users,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function DasborTutorPage() {
  const [selectedTutorId, setSelectedTutorId] = useState("tutor-dimas"); // default Kak Dimas

  const tutorInfo = mockUsers.find((u) => u.uid === selectedTutorId);
  const kelasTutor = mockKelas.filter((k) => k.tutorId === selectedTutorId);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Dasbor Tutor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <School className="w-3.5 h-3.5" />
              Dasbor Pengajar &bull; Bab 4.11 PRD
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Dasbor Tutor: {tutorInfo?.nama}
            </h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Kelola pertemuan tatap muka, bagikan materi belajar, isi presensi kehadiran, dan periksa tugas siswa.
            </p>
          </div>

          {/* Quick Tutor Switcher Demo */}
          <div className="flex items-center gap-2 bg-[#F7F5F2] p-1.5 rounded-xl text-xs font-semibold">
            <span className="text-[#5A6B78] pl-2">Ganti Tutor Demo:</span>
            <button
              type="button"
              onClick={() => setSelectedTutorId("tutor-dimas")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedTutorId === "tutor-dimas"
                  ? "bg-[#EA580C] text-white shadow-xs"
                  : "text-[#1F2937] hover:bg-slate-200"
              }`}
            >
              Kak Dimas (UTBK)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTutorId("tutor-nadia")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedTutorId === "tutor-nadia"
                  ? "bg-[#EA580C] text-white shadow-xs"
                  : "text-[#1F2937] hover:bg-slate-200"
              }`}
            >
              Kak Nadia (SMP)
            </button>
          </div>
        </div>

        {/* 2 Bagian Utama Bab 4.11: Kelas Hari Ini & Semua Kelas Saya */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kartu 1: Kelas Hari Ini */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-lg">
                  Jadwal Mengajar Hari Ini
                </span>
                <span className="text-xs text-[#5A6B78] tabular-nums">
                  Selasa, 18 Oktober 2026
                </span>
              </div>

              {kelasTutor.length > 0 ? (
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-[#1F2937]">{kelasTutor[0].nama}</h2>
                  <p className="text-xs text-[#5A6B78]">
                    Program: {kelasTutor[0].programNama} &bull; {kelasTutor[0].siswaIds.length} Siswa Terdaftar
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-sm text-[#1F2937]">
                    <div className="flex items-center gap-2.5 text-xs">
                      <Calendar className="w-4 h-4 text-[#EA580C]" />
                      <span>{kelasTutor[0].hari}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs tabular-nums">
                      <Clock className="w-4 h-4 text-[#EA580C]" />
                      <span>{kelasTutor[0].jam} WITA</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs">
                      <MapPin className="w-4 h-4 text-[#EA580C]" />
                      <span>{kelasTutor[0].tempat}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#5A6B78] py-8 text-center">
                  Tidak ada jadwal kelas untuk tutor ini hari ini.
                </p>
              )}
            </div>

            {kelasTutor.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/tutor/kelas/${kelasTutor[0].id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Buka Presensi & Pertemuan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Kartu 2: Semua Kelas Saya */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  Semua Kelas yang Saya Ajar
                </span>
                <span className="text-xs text-[#5A6B78]">
                  Total: <strong>{kelasTutor.length}</strong> Kelas
                </span>
              </div>

              <div className="space-y-3">
                {kelasTutor.map((k) => (
                  <div
                    key={k.id}
                    className="p-3.5 bg-[#F7F5F2] rounded-xl flex items-center justify-between hover:bg-orange-50 transition"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#1F2937]">{k.nama}</div>
                      <div className="text-xs text-[#5A6B78] mt-0.5">
                        {k.hari}, {k.jam} WITA &bull; {k.tempat}
                      </div>
                    </div>
                    <Link
                      href={`/tutor/kelas/${k.id}`}
                      className="px-3 py-1.5 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold rounded-lg text-xs transition"
                    >
                      Kelola
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-[#5A6B78]">
              <strong>Ketentuan PRD 4.11 & 2.4:</strong> Tutor hanya melihat kelas yang ia ajar. Bila mencoba membuka ID kelas milik tutor lain di alamat peramban, sistem menampilkan <em>Akses Ditolak</em>.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
