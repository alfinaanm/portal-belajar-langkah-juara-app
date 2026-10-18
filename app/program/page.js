"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import {
  Layers,
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";

export default function ProgramPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [pendaftaranList, setPendaftaranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [pesanSukses, setPesanSukses] = useState("");
  const [pesanError, setPesanError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Baca daftar program dari Firestore
      const progSnap = await getDocs(collection(db, "program"));
      const progList = progSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPrograms(progList);

      // 2. Baca pendaftaran siswa dari Firestore
      if (user?.uid) {
        const pendQ = query(
          collection(db, "pendaftaran"),
          where("siswaId", "==", user.uid)
        );
        const pendSnap = await getDocs(pendQ);
        const pendData = pendSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendaftaranList(pendData);
      }
    } catch (err) {
      console.error("Gagal mengambil data program dari Firestore:", err);
      setPesanError("Gagal memuat data dari Cloud Firestore. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Langkah Siswa Mendaftar Program (Bab 4.3 PRD)
  const handleAjukan = async (program) => {
    if (!user) {
      alert("Anda harus masuk terlebih dahulu.");
      return;
    }

    // Validasi PRD: siswa tidak bisa mengajukan program yang sama bila pendaftarannya masih menunggu atau aktif
    const sudahAda = pendaftaranList.find(
      (p) => p.programId === program.id && (p.status === "aktif" || p.status === "menunggu")
    );

    if (sudahAda) {
      alert(`Anda sudah memiliki pendaftaran berstatus ${sudahAda.status.toUpperCase()} untuk program ini.`);
      return;
    }

    try {
      setSubmittingId(program.id);
      setPesanError("");

      // Tulis dokumen pendaftaran baru ke Firestore
      await addDoc(collection(db, "pendaftaran"), {
        siswaId: user.uid,
        programId: program.id,
        status: "menunggu",
        catatanStaf: "",
        dibuatPada: serverTimestamp(),
      });

      setPesanSukses(
        `Pendaftaran untuk "${program.nama}" berhasil terkirim ke Firestore! Selesaikan pembayaran di kantor Langkah Juara.`
      );
      setTimeout(() => setPesanSukses(""), 7000);

      // Segarkan data dari Firestore
      await fetchData();
    } catch (err) {
      console.error("Gagal menyimpan pendaftaran ke Firestore:", err);
      setPesanError("Terjadi kesalahan saat menyimpan pendaftaran ke Firestore.");
    } finally {
      setSubmittingId(null);
    }
  };

  // Helper untuk mendapatkan nama program dari ID
  const getProgramNama = (progId) => {
    const p = programs.find((item) => item.id === progId);
    return p ? p.nama : progId;
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <Layers className="w-3.5 h-3.5" />
            Katalog Program Belajar
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Pilihan Program Langkah Juara</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Pilih paket belajar terbaik sesuai jenjangmu. Ajukan pendaftaran dan selesaikan administrasi di kantor.
          </p>
        </div>

        {pesanSukses && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-sm animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-[#15A66A] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">{pesanSukses}</div>
              <div className="text-xs text-emerald-600 mt-0.5">
                Status awal pendaftaran adalah <strong>Menunggu</strong> sampai staf mengonfirmasi pembayaran di kantor.
              </div>
            </div>
          </div>
        )}

        {pesanError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
            <span>{pesanError}</span>
          </div>
        )}

        {/* Daftar Program Aktif dari Firestore */}
        <div>
          <h2 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center justify-between">
            <span>Program Tersedia</span>
            <span className="text-xs font-normal text-[#5A6B78]">Hanya program aktif yang tampil</span>
          </h2>

          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
              <p className="text-xs text-[#5A6B78]">Memuat program dari Cloud Firestore...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs
                .filter((p) => p.aktif)
                .map((prog) => {
                  const pendaftaran = pendaftaranList.find(
                    (p) => p.programId === prog.id && (p.status === "aktif" || p.status === "menunggu")
                  );
                  const isTerdaftar = !!pendaftaran;

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
                          {isTerdaftar && (
                            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-[#5A6B78]">
                              Sudah Diajukan
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-[#1F2937] mb-2">{prog.nama}</h3>
                        <p className="text-xs text-[#5A6B78] mb-4">
                          Bimbingan intensif tatap muka berkualitas di Langkah Juara Makassar.
                        </p>

                        <div className="space-y-2 text-xs text-[#5A6B78] border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#EA580C]" />
                            <span>Jumlah Pertemuan: <strong className="text-[#1F2937]">{prog.jumlahPertemuan} Sesi</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[#EA580C]" />
                            <span>Tutor Ahli & Modul Pembahasan</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-[#5A6B78]">Biaya Program</div>
                          <div className="text-lg font-bold text-[#1F2937] tabular-nums">
                            Rp {prog.harga?.toLocaleString("id-ID")}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isTerdaftar || submittingId === prog.id}
                          onClick={() => handleAjukan(prog)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${isTerdaftar
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : submittingId === prog.id
                              ? "bg-orange-300 text-white cursor-wait"
                              : "bg-[#EA580C] hover:bg-orange-700 text-white shadow-xs"
                            }`}
                        >
                          {submittingId === prog.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Mengirim...
                            </>
                          ) : isTerdaftar ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              {pendaftaran?.status === "aktif" ? "Terdaftar" : "Menunggu"}
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
          )}
        </div>

        {/* Daftar Pendaftaran Saya */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">Riwayat Pendaftaran Saya</h2>
              <p className="text-xs text-[#5A6B78] mt-0.5">
                Pantau proses verifikasi pembayaran oleh staf Langkah Juara secara langsung.
              </p>
            </div>
            <span className="text-xs text-[#5A6B78] tabular-nums font-semibold">
              Total: {pendaftaranList.length} Pendaftaran
            </span>
          </div>

          {pendaftaranList.length === 0 ? (
            <div className="p-8 text-center bg-[#F7F5F2] rounded-xl text-xs text-[#5A6B78]">
              Belum ada riwayat pendaftaran. Klik &quot;Ajukan Pendaftaran&quot; pada salah satu program di atas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F5F2] text-[#5A6B78] uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Program</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Catatan Staf</th>
                    <th className="py-3 px-4 rounded-r-xl">Waktu Pengajuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendaftaranList.map((p) => {
                    let waktuStr = "-";
                    if (p.dibuatPada?.toDate) {
                      waktuStr = p.dibuatPada.toDate().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    } else if (p.dibuatPada) {
                      waktuStr = String(p.dibuatPada);
                    }

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 font-semibold text-[#1F2937]">
                          {getProgramNama(p.programId)}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-3.5 px-4 text-[#5A6B78]">
                          {p.catatanStaf ? (
                            <span className="italic text-red-600">&ldquo;{p.catatanStaf}&rdquo;</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#5A6B78] tabular-nums">
                          {waktuStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
