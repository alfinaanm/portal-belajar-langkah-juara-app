"use client";

import { useParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { mockTugas, mockPengumpulan } from "@/lib/mockData";
import {
  FileText,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Award,
  MessageSquare,
  Sparkles,
} from "lucide-react";

function TugasContent() {
  const params = useParams();
  const tugasId = params?.id || "tugas-pu-3";

  const tugas = mockTugas.find((t) => t.id === tugasId) || mockTugas[0];
  const pengumpulanAwal = mockPengumpulan.find((p) => p.tugasId === tugas?.id);

  const [pengumpulan, setPengumpulan] = useState(pengumpulanAwal || null);
  const [tautanInput, setTautanInput] = useState(pengumpulanAwal ? pengumpulanAwal.tautan : "");
  const [pesan, setPesan] = useState("");

  if (!tugas) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1F2937]">Tugas Tidak Ditemukan</h2>
        <p className="text-sm text-[#5A6B78] mt-1">ID tugas ini tidak valid atau di luar kelas Anda.</p>
        <Link
          href="/beranda"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#EA580C] font-semibold hover:underline"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const handleKirim = (e) => {
    e.preventDefault();
    if (!tautanInput.startsWith("https://")) {
      setPesan("Tautan jawaban wajib diawali https://");
      return;
    }

    const updated = {
      id: pengumpulan ? pengumpulan.id : `kumpul-${Date.now()}`,
      tugasId: tugas.id,
      siswaId: "siswa-raka",
      siswaNama: "Raka Pratama",
      kelasId: tugas.kelasId,
      tautan: tautanInput,
      dikumpulkanPada: new Date().toISOString(),
      nilai: pengumpulan ? pengumpulan.nilai : null,
      komentar: pengumpulan ? pengumpulan.komentar : null,
    };

    setPengumpulan(updated);
    setPesan("Jawaban tugas berhasil dikumpulkan! Status kini Dikumpulkan.");
    setTimeout(() => setPesan(""), 6000);
  };

  const statusTugas = pengumpulan?.nilai != null ? "dinilai" : pengumpulan ? "dikumpulkan" : "belum dikumpulkan";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/beranda"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold">
          PRD Bab 4.5 &bull; Halaman Tugas Siswa
        </span>
      </div>

      {/* Kartu Rincian Tugas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {tugas.kelasNama}
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{tugas.judul}</h1>
          </div>
          <StatusBadge status={statusTugas} />
        </div>

        <div className="p-4 bg-[#F7F5F2] rounded-xl text-sm text-[#1F2937] leading-relaxed">
          <div className="font-semibold text-xs text-[#5A6B78] uppercase mb-1">Deskripsi Tugas:</div>
          {tugas.deskripsi}
        </div>

        <div className="flex items-center gap-2 text-xs text-red-600 font-medium tabular-nums pt-1">
          <Clock className="w-4 h-4 shrink-0" />
          <span>Batas Waktu Pengumpulan: 25 Oktober 2026, 23:59 WITA</span>
        </div>
      </div>

      {/* Panel Form Pengumpulan Jawaban */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#1F2937]">Pengumpulan Jawaban Anda</h2>
        <p className="text-xs text-[#5A6B78]">
          Tempelkan tautan berkas dokumen pengerjaan Anda (Google Drive, Docs, dll). Pastikan hak akses berkas dapat dibuka oleh tutor.
        </p>

        {pesan && (
          <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-[#EA580C] font-semibold">
            {pesan}
          </div>
        )}

        <form onSubmit={handleKirim} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
              Tautan Jawaban * (Wajib diawali https://)
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={tautanInput}
                onChange={(e) => setTautanInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-xs transition"
            >
              {pengumpulan ? "Perbarui Tautan Jawaban" : "Kumpulkan Tugas"}
            </button>

            {pengumpulan && (
              <a
                href={pengumpulan.tautan}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 px-4 rounded-xl transition"
              >
                <ExternalLink className="w-4 h-4" />
                Cek Tautan Terkirim
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Hasil Penilaian & Komentar Tutor (Bab 4.5 PRD) */}
      {pengumpulan && pengumpulan.nilai != null ? (
        <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15A66A]">
            <Award className="w-4 h-4" />
            Hasil Penilaian Tutor Pengampu
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="bg-white px-6 py-4 rounded-xl border border-emerald-200 text-center shrink-0">
              <div className="text-xs text-[#5A6B78] uppercase font-semibold">Nilai Akhir</div>
              <div className="text-4xl font-extrabold text-[#15A66A] tabular-nums mt-1">
                {pengumpulan.nilai}
              </div>
              <div className="text-xs text-[#5A6B78] mt-0.5">dari skala 100</div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#15A66A]" />
                Komentar Evaluasi Tutor:
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic bg-white/70 p-3 rounded-xl border border-emerald-100">
                &ldquo;{pengumpulan.komentar}&rdquo;
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-xs text-[#5A6B78] flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            Tugas ini belum dinilai oleh tutor pengampu. Nilai dan komentar akan tampil otomatis setelah tutor memeriksa jawaban Anda.
          </span>
        </div>
      )}
    </div>
  );
}

export default function TugasPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat tugas...</div>}>
        <TugasContent />
      </Suspense>
    </AppShell>
  );
}
