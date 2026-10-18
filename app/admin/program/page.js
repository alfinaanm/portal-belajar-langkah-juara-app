"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { mockPrograms } from "@/lib/mockData";
import {
  Layers,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function AdminProgramPage() {
  const [programList, setProgramList] = useState(mockPrograms);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nama, setNama] = useState("");
  const [jenjang, setJenjang] = useState("SMA");
  const [jumlahPertemuan, setJumlahPertemuan] = useState(20);
  const [harga, setHarga] = useState(1500000);
  const [aktif, setAktif] = useState(true);
  const [deskripsi, setDeskripsi] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const handleToggleAktif = (id) => {
    const updated = programList.map((p) =>
      p.id === id ? { ...p, aktif: !p.aktif } : p
    );
    setProgramList(updated);
    setToast("Status aktif program berhasil diperbarui!");
    setTimeout(() => setToast(""), 4000);
  };

  const handleTambahProgram = (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama program wajib diisi.");
      return;
    }
    if (jumlahPertemuan <= 0 || harga <= 0) {
      setError("Jumlah pertemuan dan harga harus berupa angka lebih dari 0.");
      return;
    }

    const newProg = {
      id: `prog-${Date.now()}`,
      nama: nama.trim(),
      jenjang,
      jumlahPertemuan: Number(jumlahPertemuan),
      harga: Number(harga),
      aktif,
      deskripsi: deskripsi.trim() || `Program belajar ${jenjang} di Bimbel Langkah Juara.`,
    };

    setProgramList([newProg, ...programList]);
    setIsModalOpen(false);
    setNama("");
    setDeskripsi("");
    setError("");
    setToast(`Program "${newProg.nama}" berhasil ditambahkan! Langsung aktif di katalog siswa.`);
    setTimeout(() => setToast(""), 6000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <Layers className="w-3.5 h-3.5" />
              Master Data Program
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Kelola Program Bimbel</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Atur paket belajar, harga, jumlah pertemuan, dan visibilitas program ke siswa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Program
          </button>
        </div>

        {toast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Tabel Program (Bab 4.16 PRD) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Program</th>
                  <th className="py-3 px-4">Jenjang</th>
                  <th className="py-3 px-4 text-center">Jumlah Pertemuan</th>
                  <th className="py-3 px-4">Harga Program</th>
                  <th className="py-3 px-4 text-center">Status Aktif</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1F2937]">
                {programList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1F2937]">{p.nama}</div>
                      <div className="text-xs text-[#5A6B78] line-clamp-1">{p.deskripsi}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-50 text-[#EA580C]">
                        {p.jenjang}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-semibold">
                      {p.jumlahPertemuan}x
                    </td>
                    <td className="py-3.5 px-4 tabular-nums font-bold text-[#EA580C]">
                      Rp {p.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.aktif
                            ? "bg-emerald-50 text-[#15A66A] border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {p.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleAktif(p.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                          p.aktif
                            ? "text-[#E53935] border-red-200 hover:bg-red-50"
                            : "text-[#15A66A] border-emerald-200 hover:bg-emerald-50"
                        }`}
                      >
                        {p.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Program (Bab 4.16 PRD) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold text-[#1F2937] mb-1">Tambah Program Belajar</h3>
              <p className="text-xs text-[#5A6B78] mb-4">
                Program yang sudah dipakai kelas tidak dihapus, cukup dimatikan status aktifnya.
              </p>

              {error && (
                <div className="p-3 mb-3 bg-red-50 text-[#E53935] border border-red-200 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleTambahProgram} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Nama Program *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Intensif UTBK SNBT Gelombang 2"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Jenjang *
                    </label>
                    <select
                      value={jenjang}
                      onChange={(e) => setJenjang(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Jumlah Pertemuan *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={jumlahPertemuan}
                      onChange={(e) => setJumlahPertemuan(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Harga Program (Rupiah) *
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="50000"
                    required
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Deskripsi Ringkas
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Keterangan materi program untuk siswa..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-semibold text-[#1F2937]">Status Program Aktif</span>
                  <input
                    type="checkbox"
                    checked={aktif}
                    onChange={(e) => setAktif(e.target.checked)}
                    className="w-4 h-4 text-[#EA580C] rounded"
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
                    Simpan Program
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
