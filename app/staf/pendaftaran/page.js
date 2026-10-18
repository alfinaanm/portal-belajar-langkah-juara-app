"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MessageSquare,
  AlertCircle,
  Clock,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react";

function PendaftaranContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const statusParam = searchParams.get("status") || "semua";
  const [activeFilter, setActiveFilter] = useState(statusParam);
  const [pendaftaranList, setPendaftaranList] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [programsMap, setProgramsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedPendaftaran, setSelectedPendaftaran] = useState(null);
  const [catatanStaf, setCatatanStaf] = useState("");
  const [errorCatatan, setErrorCatatan] = useState("");
  const [toast, setToast] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Ambil pendaftaran
      const pendSnap = await getDocs(collection(db, "pendaftaran"));
      const pends = pendSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // 2. Ambil users untuk lookup nama
      const userSnap = await getDocs(collection(db, "users"));
      const uMap = {};
      userSnap.forEach((u) => {
        uMap[u.id] = u.data();
      });
      setUsersMap(uMap);

      // 3. Ambil program untuk lookup nama
      const progSnap = await getDocs(collection(db, "program"));
      const prMap = {};
      progSnap.forEach((p) => {
        prMap[p.id] = p.data();
      });
      setProgramsMap(prMap);

      setPendaftaranList(pends);
    } catch (err) {
      console.error("Gagal memuat pendaftaran dari Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    return item.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  // PRD Bab 4.8: Kak Fira mengklik Setujui -> status menjadi aktif di Firestore
  const handleSetujui = async (item) => {
    try {
      setIsUpdating(true);
      await updateDoc(doc(db, "pendaftaran", item.id), {
        status: "aktif",
        catatanStaf: "Disetujui staf.",
      });

      const siswaNama = usersMap[item.siswaId]?.nama || item.siswaNama || "Siswa";
      setToast(`Pendaftaran ${siswaNama} berhasil Disetujui (Status di Firestore: Aktif).`);
      setTimeout(() => setToast(""), 6000);
      setSelectedPendaftaran(null);

      // Segarkan data
      await fetchData();
    } catch (err) {
      console.error("Gagal menyetujui pendaftaran di Firestore:", err);
      alert("Gagal memperbarui status di Firestore.");
    } finally {
      setIsUpdating(false);
    }
  };

  // PRD Bab 4.8: Untuk pendaftaran yang tidak dibayar, mengisi Catatan Staf lalu mengklik Tolak
  const handleTolak = async (e) => {
    e.preventDefault();
    if (!catatanStaf.trim()) {
      setErrorCatatan("Catatan Staf wajib diisi saat menolak pendaftaran.");
      return;
    }

    try {
      setIsUpdating(true);
      await updateDoc(doc(db, "pendaftaran", selectedPendaftaran.id), {
        status: "ditolak",
        catatanStaf: catatanStaf.trim(),
      });

      const siswaNama =
        usersMap[selectedPendaftaran.siswaId]?.nama ||
        selectedPendaftaran.siswaNama ||
        "Siswa";
      setToast(`Pendaftaran ${siswaNama} Ditolak dengan catatan.`);
      setTimeout(() => setToast(""), 6000);

      setSelectedPendaftaran(null);
      setCatatanStaf("");
      setErrorCatatan("");

      // Segarkan data
      await fetchData();
    } catch (err) {
      console.error("Gagal menolak pendaftaran di Firestore:", err);
      alert("Gagal memperbarui status di Firestore.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <Filter className="w-3.5 h-3.5" />
            Verifikasi Pendaftaran
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Kelola Pendaftaran Siswa</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Periksa bukti pembayaran siswa di kantor dan putuskan status pendaftaran.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#1F2937] text-xs font-semibold rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Segarkan Data
        </button>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 text-[#15A66A] shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Saringan Status (PRD 4.8: Semua, Menunggu, Aktif, Ditolak) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["semua", "menunggu", "aktif", "ditolak"].map((status) => {
            const count = pendaftaranList.filter((p) =>
              status === "semua" ? true : p.status?.toLowerCase() === status
            ).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition flex items-center gap-2 ${
                  activeFilter === status
                    ? "bg-[#EA580C] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-[#5A6B78]"
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                    activeFilter === status
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-[#1F2937]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-[#5A6B78]">
          Menampilkan: <strong>{filteredList.length}</strong> pendaftaran
        </div>
      </div>

      {/* Tabel Pendaftaran */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
            <p className="text-xs text-[#5A6B78]">Membaca data pendaftaran dari Cloud Firestore...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5A6B78]">
            Tidak ada pendaftaran dengan saringan &quot;{activeFilter}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Program Pilihan</th>
                  <th className="py-3.5 px-4">Tanggal Pengajuan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Catatan Staf</th>
                  <th className="py-3.5 px-4 text-right">Aksi Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => {
                  const siswa = usersMap[item.siswaId] || {};
                  const program = programsMap[item.programId] || {};
                  const namaSiswa = siswa.nama || item.siswaNama || item.siswaId;
                  const emailSiswa = siswa.email || "-";
                  const namaProgram = program.nama || item.programNama || item.programId;

                  let waktuStr = "-";
                  if (item.dibuatPada?.toDate) {
                    waktuStr = item.dibuatPada.toDate().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                  } else if (item.dibuatPada) {
                    waktuStr = String(item.dibuatPada);
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#1F2937]">{namaSiswa}</div>
                        <div className="text-xs text-[#5A6B78]">{emailSiswa}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-[#1F2937]">
                        {namaProgram}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#5A6B78] tabular-nums">
                        {waktuStr}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 px-4 text-xs text-[#5A6B78]">
                        {item.catatanStaf ? (
                          <span className="italic">{item.catatanStaf}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {item.status === "menunggu" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleSetujui(item)}
                              className="inline-flex items-center gap-1 bg-[#15A66A] hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-xs transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Setujui
                            </button>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => {
                                setSelectedPendaftaran(item);
                                setCatatanStaf("");
                                setErrorCatatan("");
                              }}
                              className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-[#E53935] font-semibold text-xs py-1.5 px-3 rounded-lg transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Tolak
                            </button>
                          </div>
                        ) : item.status === "aktif" ? (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Siap Masuk Kelas
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-red-500">Ditolak</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tolak Pendaftaran (PRD Bab 4.8: Catatan Staf wajib saat menolak) */}
      {selectedPendaftaran && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">
              Tolak Pendaftaran Siswa
            </h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Pendaftaran atas nama{" "}
              <strong>
                {usersMap[selectedPendaftaran.siswaId]?.nama ||
                  selectedPendaftaran.siswaNama ||
                  "Siswa"}
              </strong>{" "}
              akan ditolak. Berikan alasan penolakan untuk siswa.
            </p>

            <form onSubmit={handleTolak} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Catatan Staf * (Wajib Diisi)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Bukti pembayaran belum valid atau kuota kelas telah penuh."
                  value={catatanStaf}
                  onChange={(e) => {
                    setCatatanStaf(e.target.value);
                    if (errorCatatan) setErrorCatatan("");
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errorCatatan && (
                  <p className="text-[11px] text-[#E53935] mt-1 font-medium">
                    {errorCatatan}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPendaftaran(null)}
                  className="px-4 py-2 border border-slate-200 text-[#5A6B78] rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Konfirmasi Tolak"
                  )}
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
      <Suspense fallback={<div className="p-8 text-center text-xs">Memuat modul pendaftaran...</div>}>
        <PendaftaranContent />
      </Suspense>
    </AppShell>
  );
}
