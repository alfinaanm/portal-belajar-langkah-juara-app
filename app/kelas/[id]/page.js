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
} from "firebase/firestore";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
  FileText,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

function RincianKelasContent() {
  const params = useParams();
  const kelasId = params?.id;
  const { user, userProfile } = useAuth();

  const [kelas, setKelas] = useState(null);
  const [program, setProgram] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [pertemuanList, setPertemuanList] = useState([]);
  const [tugasList, setTugasList] = useState([]);
  const [pengumpulanMap, setPengumpulanMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!kelasId) return;

    try {
      setLoading(true);

      // 1. Ambil dokumen kelas
      const kelasSnap = await getDoc(doc(db, "kelas", kelasId));
      if (!kelasSnap.exists()) {
        setKelas(null);
        return;
      }
      const kData = { id: kelasSnap.id, ...kelasSnap.data() };
      setKelas(kData);

      // 2. Ambil dokumen program
      if (kData.programId) {
        const progSnap = await getDoc(doc(db, "program", kData.programId));
        if (progSnap.exists()) {
          setProgram({ id: progSnap.id, ...progSnap.data() });
        }
      }

      // 3. Ambil data tutor
      if (kData.tutorId) {
        const tutorSnap = await getDoc(doc(db, "users", kData.tutorId));
        if (tutorSnap.exists()) {
          setTutor({ uid: tutorSnap.id, ...tutorSnap.data() });
        }
      }

      // 4. Ambil pertemuan
      const meetQ = query(
        collection(db, "pertemuan"),
        where("kelasId", "==", kelasId)
      );
      const meetSnap = await getDocs(meetQ);
      setPertemuanList(meetSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 5. Ambil tugas
      const tugasQ = query(
        collection(db, "tugas"),
        where("kelasId", "==", kelasId)
      );
      const tugasSnap = await getDocs(tugasQ);
      setTugasList(tugasSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 6. Ambil pengumpulan milik siswa ini untuk tugas-tugas di kelas ini
      if (user?.uid) {
        const kumpulQ = query(
          collection(db, "pengumpulan"),
          where("kelasId", "==", kelasId),
          where("siswaId", "==", user.uid)
        );
        const kumpulSnap = await getDocs(kumpulQ);
        const pMap = {};
        kumpulSnap.forEach((docItem) => {
          const d = docItem.data();
          pMap[d.tugasId] = { id: docItem.id, ...d };
        });
        setPengumpulanMap(pMap);
      }
    } catch (err) {
      console.error("Gagal mengambil rincian kelas siswa dari Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kelasId, user]);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
        <p className="text-xs text-[#5A6B78]">Membaca rincian kelas & materi dari Cloud Firestore...</p>
      </div>
    );
  }

  // PRD 4.4: Bila ID di alamat diganti dengan ID kelas lain, siswa melihat "Kelas tidak ditemukan"
  const isMember =
    userProfile?.role === "super_admin" ||
    userProfile?.role === "staf" ||
    kelas?.tutorId === user?.uid ||
    (kelas?.siswaIds && kelas.siswaIds.includes(user?.uid));

  if (!kelas || !isMember) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1F2937]">Kelas Tidak Ditemukan</h2>
        <p className="text-sm text-[#5A6B78] mt-1">
          ID kelas yang Anda tuju tidak terdaftar atau Anda bukan anggota dari kelas ini.
        </p>
        <Link
          href="/kelas"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#EA580C] font-semibold hover:underline"
        >
          &larr; Kembali ke Daftar Kelas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tombol Kembali & Info Singkat */}
      <div className="flex items-center justify-between">
        <Link
          href="/kelas"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Kelas
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
            Rincian Kelas Siswa
          </span>
        </div>
      </div>

      {/* Panel Informasi Utama Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#EA580C] mb-1">
              {program?.nama || "Program Bimbel"} ({program?.jenjang || "-"})
            </div>
            <h1 className="text-2xl font-extrabold text-[#1F2937]">{kelas.nama}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#5A6B78]">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#EA580C]" />
                <span>Tutor: <strong className="text-[#1F2937]">{tutor?.nama || "Tutor"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#EA580C]" />
                <span>Hari: <strong className="text-[#1F2937]">{kelas.hari}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 tabular-nums">
                <Clock className="w-4 h-4 text-[#EA580C]" />
                <span>Waktu: <strong className="text-[#1F2937]">{kelas.jam} WITA</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EA580C]" />
                <span>Tempat: <strong className="text-[#1F2937]">{kelas.tempat}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 1: Daftar Pertemuan & Tautan Materi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#EA580C]" />
              Daftar Pertemuan & Tautan Materi ({pertemuanList.length} Sesi)
            </h2>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Buka tautan materi untuk mempelajari modul dan pembahasan yang disiapkan tutor.
            </p>
          </div>
        </div>

        {pertemuanList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5A6B78] bg-[#F7F5F2] rounded-xl">
            Belum ada materi atau pertemuan yang dijadwalkan oleh tutor untuk kelas ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pertemuanList.map((meet, idx) => (
              <div
                key={meet.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#EA580C] bg-orange-50 px-2.5 py-0.5 rounded-md">
                      Pertemuan {idx + 1}
                    </span>
                    <span className="text-xs text-[#5A6B78] tabular-nums font-medium">
                      {meet.tanggal}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1F2937]">{meet.topik}</h3>
                </div>

                <div>
                  {meet.materiUrl ? (
                    <a
                      href={meet.materiUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EA580C]/10 text-[#EA580C] hover:bg-[#EA580C] hover:text-white rounded-xl text-xs font-semibold transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Tautan Materi
                    </a>
                  ) : (
                    <span className="text-xs text-[#5A6B78] italic">Materi dibagikan di kelas</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bagian 2: Daftar Tugas Kelas & Status Pengerjaan Siswa */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#EA580C]" />
              Daftar Tugas Kelas ({tugasList.length} Tugas)
            </h2>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Kumpulkan tautan jawaban sebelum batas waktu yang ditentukan tutor.
            </p>
          </div>
        </div>

        {tugasList.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5A6B78] bg-[#F7F5F2] rounded-xl">
            Belum ada tugas aktif untuk kelas ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tugasList.map((tugas) => {
              const kumpul = pengumpulanMap[tugas.id];
              const isSudahDinilai = kumpul && kumpul.nilai != null;
              const isSudahKumpul = !!kumpul;
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
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }

              return (
                <div
                  key={tugas.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#1F2937]">{tugas.judul}</h3>
                      <StatusBadge status={statusTugas} />
                    </div>
                    <p className="text-xs text-[#5A6B78] line-clamp-1">{tugas.deskripsi}</p>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A6B78] tabular-nums">
                      <Clock className="w-3 h-3 text-red-500" />
                      <span>Batas Waktu: {deadlineStr} WITA</span>
                    </div>
                  </div>

                  <Link
                    href={`/tugas/${tugas.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0"
                  >
                    {isSudahDinilai
                      ? "Lihat Nilai & Evaluasi"
                      : isSudahKumpul
                      ? "Lihat / Ubah Pengumpulan"
                      : "Kumpulkan Tugas"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RincianKelasPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs">Memuat rincian kelas...</div>}>
        <RincianKelasContent />
      </Suspense>
    </AppShell>
  );
}
