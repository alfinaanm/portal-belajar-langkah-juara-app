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
  Award,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  ShieldCheck,
} from "lucide-react";

function TugasDanNilaiContent() {
  const params = useParams();
  const tugasId = params?.id || "tugas-pu-3";

  const tugas = mockTugas.find((t) => t.id === tugasId) || mockTugas[0];
  const [pengumpulanList, setPengumpulanList] = useState(mockPengumpulan);

  // Modal Penilaian
  const [selectedKumpul, setSelectedKumpul] = useState(null);
  const [inputNilai, setInputNilai] = useState("");
  const [inputKomentar, setInputKomentar] = useState("");
  const [errorNilai, setErrorNilai] = useState("");
  const [toast, setToast] = useState("");

  const handleOpenNilai = (kumpul) => {
    setSelectedKumpul(kumpul);
    setInputNilai(kumpul.nilai != null ? String(kumpul.nilai) : "");
    setInputKomentar(kumpul.komentar || "");
    setErrorNilai("");
  };

  const handleSimpanNilai = (e) => {
    e.preventDefault();
    const val = Number(inputNilai);

    // Validasi Bab 4.13: nilai bilangan bulat 0 sampai 100
    if (isNaN(val) || val < 0 || val > 100 || !Number.isInteger(val)) {
      setErrorNilai("Nilai harus berupa bilangan bulat antara 0 sampai 100.");
      return;
    }

    const updated = pengumpulanList.map((p) =>
      p.id === selectedKumpul.id
        ? {
            ...p,
            nilai: val,
            komentar: inputKomentar.trim(),
          }
        : p
    );

    setPengumpulanList(updated);
    setSelectedKumpul(null);
    setToast(`Nilai untuk ${selectedKumpul.siswaNama} berhasil disimpan (Nilai: ${val}). Status tugas menjadi Dinilai.`);
    setTimeout(() => setToast(""), 6000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/tutor/kelas/${tugas.kelasId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kelas yang Diajar
        </Link>
        <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold">
          PRD Bab 4.13 &bull; Tugas & Nilai Tutor
        </span>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Informasi Tugas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {tugas.kelasNama}
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{tugas.judul}</h1>
            <p className="text-xs text-[#5A6B78] mt-2 max-w-2xl leading-relaxed">
              {tugas.deskripsi}
            </p>
            <div className="flex items-center gap-2 text-xs text-red-600 font-medium tabular-nums mt-3">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Batas Pengumpulan: 25 Oktober 2026, 23:59 WITA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Pengumpulan & Penilaian (Bab 4.13 PRD) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#1F2937] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#EA580C]" />
            Pengumpulan Jawaban Siswa
          </h2>
          <span className="text-xs text-[#5A6B78]">
            Skala Penilaian: 0 - 100
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu Kumpul</th>
                <th className="py-3 px-4">Tautan Jawaban</th>
                <th className="py-3 px-4 text-center">Nilai</th>
                <th className="py-3 px-4">Komentar Tutor</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1F2937]">
              {pengumpulanList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold">{item.siswaNama}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.nilai != null ? "dinilai" : "dikumpulkan"} />
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-xs text-[#5A6B78]">
                    {new Date(item.dikumpulkanPada).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={item.tautan}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Jawaban Siswa
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-base tabular-nums text-[#15A66A]">
                    {item.nilai != null ? item.nilai : <span className="text-slate-300 font-normal">-</span>}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#5A6B78] max-w-xs truncate">
                    {item.komentar || <span className="italic text-slate-400">Belum ada komentar</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenNilai(item)}
                      className="px-3 py-1.5 bg-[#EA580C] hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                    >
                      {item.nilai != null ? "Ubah Nilai" : "Beri Nilai"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Beri Nilai & Komentar (Bab 4.13 PRD) */}
      {selectedKumpul && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">
              Beri Nilai: {selectedKumpul.siswaNama}
            </h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Sesuai Bab 4.13 PRD: Nilai berupa bilangan bulat 0 sampai 100.
            </p>

            {errorNilai && (
              <div className="p-3 mb-3 bg-red-50 text-[#E53935] border border-red-200 rounded-xl text-xs font-semibold">
                {errorNilai}
              </div>
            )}

            <form onSubmit={handleSimpanNilai} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Nilai Tugas * (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  placeholder="85"
                  value={inputNilai}
                  onChange={(e) => setInputNilai(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-[#1F2937] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Komentar Evaluasi untuk Siswa
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan catatan perbaikan atau apresiasi terhadap hasil jawaban siswa..."
                  value={inputKomentar}
                  onChange={(e) => setInputKomentar(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedKumpul(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Simpan Nilai & Komentar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TugasDanNilaiPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat data tugas...</div>}>
        <TugasDanNilaiContent />
      </Suspense>
    </AppShell>
  );
}
