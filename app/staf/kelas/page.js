"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { mockKelas, mockPrograms, mockUsers } from "@/lib/mockData";
import {
  School,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function KelolaKelasPage() {
  const router = useRouter();
  const [kelasList, setKelasList] = useState(mockKelas);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states untuk Buat Kelas
  const [namaKelas, setNamaKelas] = useState("");
  const [programId, setProgramId] = useState("prog-utbk");
  const [tutorId, setTutorId] = useState("tutor-dimas");
  const [hari, setHari] = useState("Selasa");
  const [jam, setJam] = useState("16.00 - 17.30");
  const [tempat, setTempat] = useState("Ruang 2 (Lantai 1)");

  const tutors = mockUsers.filter((u) => u.role === "tutor");
  const programs = mockPrograms.filter((p) => p.aktif);

  const handleBuatKelas = (e) => {
    e.preventDefault();
    const prog = programs.find((p) => p.id === programId);
    const tut = tutors.find((t) => t.uid === tutorId);

    const newId = `kelas-${Date.now()}`;
    const newKelas = {
      id: newId,
      nama: namaKelas,
      programId: programId,
      programNama: prog ? prog.nama : "Program Bimbel",
      tutorId: tutorId,
      tutorNama: tut ? tut.nama : "Tutor",
      siswaIds: [],
      hari: hari,
      jam: jam,
      tempat: tempat,
    };

    setKelasList([newKelas, ...kelasList]);
    setIsModalOpen(false);
    // Langkah PRD 4.9: Rincian kelas terbuka di /staf/kelas/[id]
    router.push(`/staf/kelas/${newId}`);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <School className="w-3.5 h-3.5" />
              Kelola Kelas Belajar &bull; Bab 4.9 PRD
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Daftar Kelas Bimbel</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Susun rombongan belajar, tetapkan tutor pengampu, dan atur jadwal ruang.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Buat Kelas Baru
          </button>
        </div>

        {/* Tabel Kelola Kelas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Kelas</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Tutor</th>
                  <th className="py-3 px-4">Hari & Jam</th>
                  <th className="py-3 px-4">Tempat</th>
                  <th className="py-3 px-4 text-center">Jumlah Siswa</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1F2937]">
                {kelasList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold">{k.nama}</td>
                    <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{k.programNama}</td>
                    <td className="py-3.5 px-4 text-xs font-medium">{k.tutorNama}</td>
                    <td className="py-3.5 px-4 tabular-nums text-xs">
                      <div>{k.hari}</div>
                      <div className="text-[#5A6B78]">{k.jam} WITA</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{k.tempat}</td>
                    <td className="py-3.5 px-4 text-center font-bold tabular-nums text-[#EA580C]">
                      {k.siswaIds.length} Siswa
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/staf/kelas/${k.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] hover:underline"
                      >
                        Buka Rincian & Tambah Siswa &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Buat Kelas (Bab 4.9 PRD) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold text-[#1F2937] mb-1">Buat Kelas Baru</h3>
              <p className="text-xs text-[#5A6B78] mb-4">
                Isi data kelas. Setelah disimpan, Anda langsung diarahkan ke halaman rincian untuk menambahkan siswa.
              </p>

              <form onSubmit={handleBuatKelas} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Nama Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaKelas}
                    onChange={(e) => setNamaKelas(e.target.value)}
                    placeholder="Contoh: Intensif UTBK A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Program *
                    </label>
                    <select
                      value={programId}
                      onChange={(e) => setProgramId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nama} ({p.jenjang})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Tutor Pengajar *
                    </label>
                    <select
                      value={tutorId}
                      onChange={(e) => setTutorId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      {tutors.map((t) => (
                        <option key={t.uid} value={t.uid}>
                          {t.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Hari Belajar *
                    </label>
                    <input
                      type="text"
                      required
                      value={hari}
                      onChange={(e) => setHari(e.target.value)}
                      placeholder="Contoh: Selasa & Kamis"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Jam *
                    </label>
                    <input
                      type="text"
                      required
                      value={jam}
                      onChange={(e) => setJam(e.target.value)}
                      placeholder="16.00 - 17.30"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Tempat / Tautan Daring *
                  </label>
                  <input
                    type="text"
                    required
                    value={tempat}
                    onChange={(e) => setTempat(e.target.value)}
                    placeholder="Contoh: Ruang 2 atau Google Meet link"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                  >
                    Simpan & Lanjut ke Rincian
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
