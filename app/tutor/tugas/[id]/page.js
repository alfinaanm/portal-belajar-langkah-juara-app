"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  FileText,
  Clock,
  ExternalLink,
  Award,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  RefreshCw,
} from "lucide-react";

function TugasDanNilaiContent() {
  const params = useParams();
  const tugasId = params?.id;
  const { user, userProfile } = useAuth();

  const [tugas, setTugas] = useState(null);
  const [kelas, setKelas] = useState(null);
  const [pengumpulanList, setPengumpulanList] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal Penilaian
  const [selectedKumpul, setSelectedKumpul] = useState(null);
  const [inputNilai, setInputNilai] = useState("");
  const [inputKomentar, setInputKomentar] = useState("");
  const [errorNilai, setErrorNilai] = useState("");
  const [isSavingNilai, setIsSavingNilai] = useState(false);
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    if (!tugasId) return;

    try {
      setLoading(true);

      // 1. Ambil dokumen tugas
      const tugasSnap = await getDoc(doc(db, "tugas", tugasId));
      if (!tugasSnap.exists()) {
        setTugas(null);
        return;
      }
      const tData = { id: tugasSnap.id, ...tugasSnap.data() };
      setTugas(tData);

      // 2. Ambil dokumen kelas
      if (tData.kelasId) {
        const kSnap = await getDoc(doc(db, "kelas", tData.kelasId));
        if (kSnap.exists()) {
          setKelas({ id: kSnap.id, ...kSnap.data() });
        }
      }

      // 3. Ambil seluruh pengumpulan untuk tugas ini
      const kumpulQ = query(
        collection(db, "pengumpulan"),
        where("tugasId", "==", tugasId)
      );
      const kumpulSnap = await getDocs(kumpulQ);
      const kumpulData = kumpulSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPengumpulanList(kumpulData);

      // 4. Ambil users untuk lookup nama siswa
      const usersSnap = await getDocs(collection(db, "users"));
      const uMap = {};
      usersSnap.forEach((u) => {
        uMap[u.id] = { uid: u.id, ...u.data() };
      });
      setUsersMap(uMap);
    } catch (err) {
      console.error("Gagal memuat tugas & pengumpulan dari Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tugasId]);

  const handleOpenNilai = (kumpul) => {
    setSelectedKumpul(kumpul);
    setInputNilai(kumpul.nilai != null ? String(kumpul.nilai) : "");
    setInputKomentar(kumpul.komentar || "");
    setErrorNilai("");
  };

  // Langkah Tutor Memberi Nilai (PRD Bab 4.13)
  const handleSimpanNilai = async (e) => {
    e.preventDefault();
    const val = Number(inputNilai);

    // Validasi Bab 4.13 PRD: nilai bilangan bulat 0 sampai 100
    if (isNaN(val) || val < 0 || val > 100 || !Number.isInteger(val)) {
      setErrorNilai("Nilai harus berupa bilangan bulat antara 0 sampai 100.");
      return;
    }

    try {
      setIsSavingNilai(true);

      // Tulis pembaruan nilai & komentar ke dokumen pengumpulan di Firestore
      await updateDoc(doc(db, "pengumpulan", selectedKumpul.id), {
        nilai: val,
        komentar: inputKomentar.trim(),
      });

      const siswaNama = usersMap[selectedKumpul.siswaId]?.nama || "Siswa";
      setToast(
        `Nilai untuk ${siswaNama} berhasil disimpan ke Firestore (Nilai: ${val}). Status pengumpulan menjadi Dinilai.`
      );
      setTimeout(() => setToast(""), 6000);
      setSelectedKumpul(null);

      await fetchData();
    } catch (err) {
      console.error("Gagal menyimpan nilai ke Firestore:", err);
      alert("Gagal menyimpan nilai ke Firestore.");
    } finally {
      setIsSavingNilai(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
        <p className="text-xs text-[#5A6B78]">Membaca data pengumpulan tugas dari Cloud Firestore...</p>
      </div>
    );
  }

  const isAuthorized =
    userProfile?.role === "super_admin" ||
    (kelas?.tutorId && kelas.tutorId === user?.uid);

  if (!tugas || (!loading && kelas && !isAuthorized)) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1F2937]">
          {!tugas ? "Tugas Tidak Ditemukan" : "Akses Ditolak"}
        </h2>
        <p className="text-sm text-[#5A6B78] mt-1">
          {!tugas
            ? "ID tugas ini tidak terdaftar di Cloud Firestore."
            : "Anda bukan tutor pengampu kelas untuk tugas ini."}
        </p>
        <Link
          href="/tutor"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#EA580C] font-semibold hover:underline"
        >
          &larr; Kembali ke Dasbor Tutor
        </Link>
      </div>
    );
  }

  let deadlineStr = "-";
  if (tugas.batasWaktu?.toDate) {
    deadlineStr = tugas.batasWaktu.toDate().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#1F2937] text-xs font-semibold rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Segarkan
          </button>
          <span className="text-xs bg-orange-50 text-[#EA580C] px-3 py-1 rounded-full font-semibold">
            Penilaian Tutor
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Informasi Tugas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {kelas?.nama || "Kelas Bimbel"}
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{tugas.judul}</h1>
            <p className="text-xs text-[#5A6B78] mt-2 max-w-2xl leading-relaxed">
              {tugas.deskripsi}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-xs text-[#5A6B78]">Batas Waktu Pengumpulan</div>
            <div className="text-xs font-bold text-red-600 tabular-nums flex items-center sm:justify-end gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {deadlineStr} WITA
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Pengumpulan Siswa (PRD Bab 4.13) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#EA580C]" />
            Daftar Jawaban yang Dikumpulkan Siswa ({pengumpulanList.length} Pengumpulan)
          </h2>
          <span className="text-xs text-[#5A6B78]">Buka tautan jawaban lalu isi nilai</span>
        </div>

        {pengumpulanList.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#5A6B78]">
            Belum ada siswa yang mengumpulkan tugas ini di Firestore.
          </div>
        ) : (
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
              <tbody className="divide-y divide-slate-100">
                {pengumpulanList.map((item) => {
                  const siswa = usersMap[item.siswaId] || {};
                  const siswaNama = siswa.nama || item.siswaNama || item.siswaId;
                  const status = item.nilai != null ? "dinilai" : "dikumpulkan";

                  let waktuStr = "-";
                  if (item.dikumpulkanPada?.toDate) {
                    waktuStr = item.dikumpulkanPada.toDate().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-4 font-semibold text-[#1F2937]">
                        {siswaNama}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="py-4 px-4 text-xs text-[#5A6B78] tabular-nums">
                        {waktuStr} WITA
                      </td>
                      <td className="py-4 px-4">
                        {item.tautan ? (
                          <a
                            href={item.tautan}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#EA580C] hover:underline font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Buka Jawaban
                          </a>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {item.nilai != null ? (
                          <span className="font-extrabold text-[#15A66A] text-base tabular-nums">
                            {item.nilai}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belum</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#5A6B78] max-w-xs truncate">
                        {item.komentar || "-"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenNilai(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#EA580C] hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                          <Award className="w-3.5 h-3.5" />
                          {item.nilai != null ? "Ubah Nilai" : "Beri Nilai"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Input Nilai & Komentar (PRD Bab 4.13) */}
      {selectedKumpul && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">
              Beri Nilai & Evaluasi Jawaban
            </h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Menilai jawaban atas nama{" "}
              <strong>
                {usersMap[selectedKumpul.siswaId]?.nama || "Siswa"}
              </strong>
            </p>

            {selectedKumpul.tautan && (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <span className="text-[#5A6B78]">Tautan Jawaban Siswa:</span>
                <a
                  href={selectedKumpul.tautan}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Periksa Dokumen
                </a>
              </div>
            )}

            {errorNilai && (
              <div className="p-3 mb-3 bg-red-50 text-[#E53935] border border-red-200 rounded-xl text-xs font-semibold">
                {errorNilai}
              </div>
            )}

            <form onSubmit={handleSimpanNilai} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Nilai * (0 sampai 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  required
                  placeholder="Contoh: 85"
                  value={inputNilai}
                  onChange={(e) => {
                    setInputNilai(e.target.value);
                    if (errorNilai) setErrorNilai("");
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Komentar / Masukan Tutor
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Pengerjaan sangat baik dan runut, perhatikan pembulatan di nomor 5."
                  value={inputKomentar}
                  onChange={(e) => setInputKomentar(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedKumpul(null)}
                  className="px-4 py-2 border border-slate-200 text-[#5A6B78] rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingNilai}
                  className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  {isSavingNilai ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Nilai ke Firestore"
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

export default function TugasDanNilaiPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs">Memuat tugas...</div>}>
        <TugasDanNilaiContent />
      </Suspense>
    </AppShell>
  );
}
