"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { mockKelas } from "@/lib/mockData";
import { School, User, Calendar, Clock, MapPin, ArrowRight, BookOpen } from "lucide-react";

export default function KelasSayaPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <School className="w-3.5 h-3.5" />
            Kelas Saya &bull; Bab 4.4 PRD
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Kelas yang Anda Ikuti</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Daftar kelompok belajar Anda di Bimbel Langkah Juara Makassar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockKelas.map((kelas) => (
            <div
              key={kelas.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-orange-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-orange-50 text-[#EA580C] rounded-lg">
                    {kelas.programNama}
                  </span>
                  <span className="text-xs text-[#5A6B78] font-medium">Aktif</span>
                </div>

                <h3 className="text-xl font-bold text-[#1F2937] mb-4">{kelas.nama}</h3>

                <div className="space-y-2.5 text-sm text-[#1F2937] border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2.5 text-xs text-[#5A6B78]">
                    <User className="w-4 h-4 text-[#EA580C]" />
                    <span>Tutor Pengajar: <strong className="text-[#1F2937]">{kelas.tutorNama}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#5A6B78]">
                    <Calendar className="w-4 h-4 text-[#EA580C]" />
                    <span>Hari: <strong className="text-[#1F2937]">{kelas.hari}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#5A6B78] tabular-nums">
                    <Clock className="w-4 h-4 text-[#EA580C]" />
                    <span>Waktu: <strong className="text-[#1F2937]">{kelas.jam} WITA</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#5A6B78]">
                    <MapPin className="w-4 h-4 text-[#EA580C]" />
                    <span>Lokasi: <strong className="text-[#1F2937]">{kelas.tempat}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/kelas/${kelas.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Buka Rincian & Materi Kelas
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
