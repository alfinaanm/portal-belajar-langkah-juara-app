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
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
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
  Loader2,
  RefreshCw,
} from "lucide-react";

function TugasContent() {
  const params = useParams();
  const tugasId = params?.id;
  const { user, userProfile } = useAuth();

  const [tugas, setTugas] = useState(null);
  const [kelas, setKelas] = useState(null);
  const [pengumpulan, setPengumpulan] = useState(null);
  const [tautanInput, setTautanInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pesan, setPesan] = useState("");
  const [pesanError, setPesanError] = useState("");

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

      // 3. Ambil pengumpulan milik siswa ini
      if (user?.uid) {
        const pQ = query(
          collection(db, "pengumpulan"),
          where("tugasId", "==", tugasId),
          where("siswaId", "==", user.uid)
        );
        const pSnap = await getDocs(pQ);

        if (!pSnap.empty) {
          const docItem = pSnap.docs[0];
          const kumpulData = { id: docItem.id, ...docItem.data() };
          setPengumpulan(kumpulData);
          setTautanInput(kumpulData.tautan || "");
        } else {
          setPengumpulan(null);
        }
      }
    } catch (err) {
      console.error("Gagal mengambil tugas dari Firestore:", err);
      setPesanError("Gagal memuat tugas dari Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tugasId, user]);

  // Langkah Siswa Mengumpulkan Tugas (PRD Bab 4.5)
  const handleKirim = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Anda harus masuk terlebih dahulu.");
      return;
    }

    if (!tautanInput.trim().startsWith("https://")) {
      setPesanError("Tautan jawaban wajib diawali https://");
      return;
    }

    try {
      setIsSubmitting(true);
      setPesanError("");

      if (pengumpulan) {
        // Pembaruan tautan jawaban sebelum dinilai
        await updateDoc(doc(db, "pengumpulan", pengumpulan.id), {
          tautan: tautanInput.trim(),
          dikumpulkanPada: serverTimestamp(),
        });
      } else {
        // Pengumpulan baru ke Firestore
        await addDoc(collection(db, "pengumpulan"), {
          tugasId: tugas.id,
          siswaId: user.uid,
          kelasId: tugas.kelasId,
          tautan: tautanInput.trim(),
          dikumpulkanPada: serverTimestamp(),
          nilai: null,
          komentar: "",
        });
      }

      setPesan("Jawaban tugas berhasil disimpan ke Firestore! Status kini Dikumpulkan.");
      setTimeout(() => setPesan(""), 6000);

      await fetchData();
    } catch (err) {
      console.error("Gagal mengumpulkan tugas ke Firestore:", err);
      setPesanError("Gagal menyimpan pengumpulan tugas ke Firestore.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
        <p className="text-xs text-[#5A6B78]">Membaca rincian tugas dari Cloud Firestore...</p>
      </div>
    );
  }

  const isAuthorized =
    userProfile?.role === "super_admin" ||
    userProfile?.role === "staf" ||
    kelas?.tutorId === user?.uid ||
    (kelas?.siswaIds && kelas.siswaIds.includes(user?.uid));

  if (!tugas || (!loading && kelas && !isAuthorized)) {
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

  // Hitung status tugas dinamis sesuai Bab 4.5 PRD:
  // - Dinilai: tutor sudah mengisi nilai
  // - Dikumpulkan: tautan terkirim, belum dinilai
  // - Terlambat: batas waktu lewat tanpa pengumpulan
  // - Belum dikumpulkan: belum ada pengumpulan dan batas waktu belum lewat
  const isSudahDinilai = pengumpulan && pengumpulan.nilai != null;
  const isSudahKumpul = !!pengumpulan;
  const isLewatBatas = tugas.batasWaktu?.toDate
    ? new Date() > tugas.batasWaktu.toDate()
    : false;

  let statusTugas = "belum dikumpulkan";
  if (isSudahDinilai) {
    statusTugas = "dinilai";
  } else if (isSudahKumpul) {
    statusTugas = "dikumpulkan";
  } else if (isLewatBatas) {
    statusTugas = "terlambat";
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
          href="/beranda"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
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
            Pengumpulan & Nilai Siswa
          </span>
        </div>
      </div>

      {/* Kartu Rincian Tugas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {kelas?.nama || "Kelas Belajar"}
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
          <span>Batas Waktu Pengumpulan: {deadlineStr} WITA</span>
        </div>
      </div>

      {/* Panel Form Pengumpulan Jawaban */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#1F2937]">Pengumpulan Jawaban Anda</h2>
        <p className="text-xs text-[#5A6B78]">
          Tempelkan tautan berkas dokumen pengerjaan Anda (Google Drive, Docs, dsb). Pastikan hak akses berkas dapat dibuka oleh tutor.
        </p>

        {pesan && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#15A66A] font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{pesan}</span>
          </div>
        )}

        {pesanError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#E53935] font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pesanError}</span>
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
                disabled={isSudahDinilai}
                placeholder="https://drive.google.com/..."
                value={tautanInput}
                onChange={(e) => setTautanInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition disabled:bg-slate-100 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSudahDinilai ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-xs transition flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan ke Firestore...
                  </>
                ) : pengumpulan ? (
                  "Perbarui Tautan Jawaban"
                ) : (
                  "Kumpulkan Tugas"
                )}
              </button>
            ) : (
              <span className="text-xs text-[#5A6B78] italic">
                Tugas telah dinilai oleh tutor dan tautan tidak dapat diubah lagi.
              </span>
            )}

            {pengumpulan?.tautan && (
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

      {/* PRD Bab 4.5: Siswa Membaca Nilai & Komentar Tutor */}
      {isSudahDinilai ? (
        <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15A66A]">
            <Award className="w-4 h-4" />
            Hasil Penilaian Tutor Pengampu
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="bg-white px-6 py-4 rounded-xl border border-emerald-200 text-center shrink-0 shadow-xs">
              <div className="text-xs text-[#5A6B78] uppercase font-semibold">Nilai Akhir</div>
              <div className="text-4xl font-extrabold text-[#15A66A] tabular-nums mt-1">
                {pengumpulan.nilai}
              </div>
              <div className="text-xs text-[#5A6B78] mt-0.5">dari skala 100</div>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#15A66A]" />
                Komentar Evaluasi Tutor:
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                &ldquo;{pengumpulan.komentar || "Kerja bagus!"}&rdquo;
              </p>
            </div>
          </div>
        </div>
      ) : isSudahKumpul ? (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-xs text-[#5A6B78] flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            Jawaban tugas telah tersimpan di Cloud Firestore dan sedang menunggu pemeriksaan oleh tutor pengampu. Nilai dan komentar akan tampil otomatis setelah tutor mengisi nilai.
          </span>
        </div>
      ) : null}
    </div>
  );
}

export default function TugasDetailPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs">Memuat tugas...</div>}>
        <TugasContent />
      </Suspense>
    </AppShell>
  );
}
