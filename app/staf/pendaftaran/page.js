"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { mockPendaftaran } from "@/lib/mockData";
import {
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MessageSquare,
  AlertCircle,
  Clock,
  Check,
} from "lucide-react";

function PendaftaranContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const statusParam = searchParams.get("status") || "semua";
  const [activeFilter, setActiveFilter] = useState(statusParam);
  const [pendaftaranList, setPendaftaranList] = useState(mockPendaftaran);
  const [selectedPendaftaran, setSelectedPendaftaran] = useState(null);
  const [catatanStaf, setCatatanStaf] = useState("");
  const [errorCatatan, setErrorCatatan] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setActiveFilter(statusParam);
  }, [statusParam]);

  const handleFilterChange = (status) => {
    setActiveFilter(status);
    if (status === "semua") {
      router.push("/staf/pendaftaran");
    } else {
      router.push(`/staf/pendaftaran?status=${status}`);
    }
  };

  const filteredList = pendaftaranList.filter((item) => {
    if (activeFilter === "semua") return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleSetujui = (item) => {
    const updated = pendaftaranList.map((p) =>
      p.id === item.id ? { ...p, status: "aktif", catatanStaf: "Disetujui staf." } : p
    );
    setPendaftaranList(updated);
    setSelectedPendaftaran(null);
    setToast(`Pendaftaran ${item.siswaNama} berhasil Disetujui (Status: Aktif).`);
    setTimeout(() => setToast(""), 5000);
  };

  const handleTolak = (e) => {
    e.preventDefault();
    if (!catatanStaf.trim()) {
      setErrorCatatan("Catatan Staf wajib diisi saat menolak pendaftaran.");
      return;
    }

    const updated = pendaftaranList.map((p) =>
      p.id === selectedPendaftaran.id
        ? { ...p, status: "ditolak", catatanStaf: catatanStaf.trim() }
        : p
    );
    setPendaftaranList(updated);
    setSelectedPendaftaran(null);
    setCatatanStaf("");
    setErrorCatatan("");
    setToast(`Pendaftaran ${selectedPendaftaran.siswaNama} Ditolak dengan catatan.`);
    setTimeout(() => setToast(""), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Administrasi Pendaftaran &bull; Bab 4.8 PRD
        </div>
        <h1 className="text-2xl font-bold text-[#1F2937]">Kelola Pendaftaran Siswa</h1>
        <p className="text-sm text-[#5A6B78] mt-1">
          Cocokkan bukti pembayaran di luar aplikasi, lalu setujui atau tolak pengajuan program siswa.
        </p>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter Status Bar (Sesuai Bab 4.8 PRD) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5A6B78]" />
          <span className="text-xs font-semibold text-[#5A6B78] uppercase mr-2">Saringan:</span>
          {["semua", "menunggu", "aktif", "ditolak"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                activeFilter === f
                  ? "bg-[#EA580C] text-white shadow-xs"
                  : "bg-[#F7F5F2] text-[#5A6B78] hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#5A6B78]">
          Menampilkan <strong>{filteredList.length}</strong> data pendaftaran
        </div>
      </div>

      {/* Tabel Pendaftaran */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Program Pilihan</th>
                <th className="py-3 px-4">Tanggal Pengajuan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Catatan Staf</th>
                <th className="py-3 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#1F2937]">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold">{item.siswaNama}</td>
                    <td className="py-3.5 px-4 text-xs font-medium">{item.programNama}</td>
                    <td className="py-3.5 px-4 tabular-nums text-xs text-[#5A6B78]">
                      {new Date(item.dibuatPada).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#5A6B78] max-w-xs truncate">
                      {item.catatanStaf || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === "menunggu" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSetujui(item)}
                              className="px-2.5 py-1 bg-[#15A66A] hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                            >
                              Setujui
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPendaftaran(item);
                                setCatatanStaf("");
                                setErrorCatatan("");
                              }}
                              className="px-2.5 py-1 bg-[#E53935] hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        {item.status !== "menunggu" && (
                          <span className="text-xs text-[#5A6B78] italic">Selesai</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#5A6B78]">
                    Tidak ada pendaftaran dengan status {activeFilter}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Dialog Tolak Pendaftaran */}
      {selectedPendaftaran && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">
              Tolak Pendaftaran: {selectedPendaftaran.siswaNama}
            </h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Program: {selectedPendaftaran.programNama}. Menurut PRD 4.8, Catatan Staf wajib diisi saat menolak.
            </p>

            {errorCatatan && (
              <div className="p-3 mb-3 bg-red-50 text-[#E53935] border border-red-200 rounded-xl text-xs font-semibold">
                {errorCatatan}
              </div>
            )}

            <form onSubmit={handleTolak} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                  Catatan Staf * (Alasan Penolakan)
                </label>
                <textarea
                  rows={3}
                  value={catatanStaf}
                  onChange={(e) => setCatatanStaf(e.target.value)}
                  placeholder="Contoh: Bukti bayar belum masuk atau kelas telah penuh..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPendaftaran(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#5A6B78] text-xs font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  Tolak Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PendaftaranPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#5A6B78]">Memuat data pendaftaran...</div>}>
        <PendaftaranContent />
      </Suspense>
    </AppShell>
  );
}
