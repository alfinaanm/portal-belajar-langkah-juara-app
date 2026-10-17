"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { mockPrograms, mockPendaftaran } from "@/lib/mockData";
import {
  Layers,
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function ProgramPage() {
  const [pendaftaranList, setPendaftaranList] = useState(mockPendaftaran.slice(0, 2)); // Raka & Salsa
  const [pesanSukses, setPesanSukses] = useState("");

  const handleAjukan = (program) => {
    // Cek apakah sudah terdaftar
    const sudahAda = pendaftaranList.find(
      (p) => p.programId === program.id && (p.status === "aktif" || p.status === "menunggu")
    );

    if (sudahAda) {
      alert(`Anda sudah memiliki pendaftaran ${sudahAda.status} untuk program ini.`);
      return;
    }

    const pendaftaranBaru = {
      id: `daftar-${Date.now()}`,
      siswaId: "siswa-raka",
      siswaNama: "Raka Pratama",
      programId: program.id,
      programNama: program.nama,
      status: "menunggu",
      catatanStaf: "",
      dibuatPada: new Date().toISOString(),
    };

    setPendaftaranList([pendaftaranBaru, ...pendaftaranList]);
    setPesanSukses(`Pendaftaran untuk "${program.nama}" terkirim! Selesaikan pembayaran di kantor Langkah Juara.`);
    setTimeout(() => setPesanSukses(""), 7000);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <Layers className="w-3.5 h-3.5" />
            Katalog Program Belajar &bull; Bab 4.3 PRD
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Pilihan Program Langkah Juara</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Pilih paket belajar terbaik sesuai jenjangmu. Ajukan pendaftaran dan selesaikan administrasi di kantor.
          </p>
        </div>

        {pesanSukses && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-sm">
            <CheckCircle className="w-5 h-5 text-[#15A66A] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">{pesanSukses}</div>
              <div className="text-xs text-emerald-600 mt-0.5">
                Status awal pendaftaran adalah <strong>Menunggu</strong> sampai staf mengonfirmasi.
              </div>
            </div>
          </div>
        )}

        {/* Daftar Program Aktif */}
        <div>
          <h2 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center justify-between">
            <span>Program Tersedia</span>
            <span className="text-xs font-normal text-[#5A6B78]">Hanya program aktif yang tampil</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPrograms
              .filter((p) => p.aktif)
              .map((prog) => {
                const isTerdaftar = pendaftaranList.some(
                  (p) => p.programId === prog.id && (p.status === "aktif" || p.status === "menunggu")
                );

                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-orange-50 text-[#EA580C] rounded-lg">
                          Jenjang {prog.jenjang}
                        </span>
                        <span className="text-xs text-[#5A6B78] tabular-nums flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {prog.jumlahPertemuan} Pertemuan
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#1F2937] mb-2">{prog.nama}</h3>
                      <p className="text-xs text-[#5A6B78] leading-relaxed mb-4">{prog.deskripsi}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="mb-3">
                        <div className="text-xs text-[#5A6B78]">Biaya Program:</div>
                        <div className="text-xl font-bold text-[#EA580C] tabular-nums">
                          Rp {prog.harga.toLocaleString("id-ID")}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isTerdaftar}
                        onClick={() => handleAjukan(prog)}
                        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                          isTerdaftar
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-[#EA580C] hover:bg-orange-700 text-white shadow-xs"
                        }`}
                      >
                        {isTerdaftar ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            Sudah Diajukan
                          </>
                        ) : (
                          "Ajukan Pendaftaran"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Daftar Pendaftaran Saya */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">Pendaftaran Saya</h2>
              <p className="text-xs text-[#5A6B78]">
                Riwayat status pengajuan program belajar Anda (Bab 4.3 PRD)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Program</th>
                  <th className="py-3 px-4">Tanggal Pengajuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-xl">Catatan Staf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1F2937]">
                {pendaftaranList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold">{item.programNama}</td>
                    <td className="py-3.5 px-4 tabular-nums text-xs text-[#5A6B78]">
                      {new Date(item.dibuatPada).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#5A6B78]">
                      {item.catatanStaf ? (
                        <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">
                          {item.catatanStaf}
                        </span>
                      ) : (
                        item.status === "menunggu" ? (
                          <span className="italic text-amber-700">Menunggu verifikasi pembayaran kantor</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Aktif di kelas</span>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
