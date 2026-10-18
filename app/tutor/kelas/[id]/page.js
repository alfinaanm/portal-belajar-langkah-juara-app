"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
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
  Timestamp,
} from "firebase/firestore";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  BookOpen,
  FileText,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  CheckSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

function KelasDiajarContent() {
  const params = useParams();
  const kelasId = params?.id;
  const { user, userProfile } = useAuth();

  const [kelas, setKelas] = useState(null);
  const [program, setProgram] = useState(null);
  const [pertemuanList, setPertemuanList] = useState([]);
  const [tugasList, setTugasList] = useState([]);
  const [siswaDiKelas, setSiswaDiKelas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Buat Pertemuan
  const [isPertemuanModalOpen, setIsPertemuanModalOpen] = useState(false);
  const [tanggal, setTanggal] = useState("2026-10-18");
  const [topik, setTopik] = useState("");
  const [materiUrl, setMateriUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  // Modal Buat Tugas (PRD Bab 4.13)
  const [isTugasModalOpen, setIsTugasModalOpen] = useState(false);
  const [judulTugas, setJudulTugas] = useState("");
  const [deskripsiTugas, setDeskripsiTugas] = useState("");
  const [batasWaktuTugas, setBatasWaktuTugas] = useState("2026-10-25T23:59");
  const [isSubmittingTugas, setIsSubmittingTugas] = useState(false);

  // Presensi State
  const [selectedPertemuan, setSelectedPertemuan] = useState(null);
  const [hadirSiswaIds, setHadirSiswaIds] = useState([]);
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    if (!kelasId) return;

    try {
      setLoading(true);

      // 1. Ambil dokumen kelas
      const kSnap = await getDoc(doc(db, "kelas", kelasId));
      if (!kSnap.exists()) {
        setKelas(null);
        return;
      }
      const kData = { id: kSnap.id, ...kSnap.data() };
      setKelas(kData);

      // 2. Ambil dokumen program
      if (kData.programId) {
        const progSnap = await getDoc(doc(db, "program", kData.programId));
        if (progSnap.exists()) {
          setProgram({ id: progSnap.id, ...progSnap.data() });
        }
      }

      // 3. Ambil pertemuan untuk kelas ini
      const meetQ = query(
        collection(db, "pertemuan"),
        where("kelasId", "==", kelasId)
      );
      const meetSnap = await getDocs(meetQ);
      setPertemuanList(meetSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 4. Ambil tugas untuk kelas ini
      const tugasQ = query(
        collection(db, "tugas"),
        where("kelasId", "==", kelasId)
      );
      const tugasSnap = await getDocs(tugasQ);
      setTugasList(tugasSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // 5. Ambil data siswa yang terdaftar di kelas ini
      if (kData.siswaIds && kData.siswaIds.length > 0) {
        const usersSnap = await getDocs(collection(db, "users"));
        const siswaList = [];
        usersSnap.forEach((u) => {
          if (kData.siswaIds.includes(u.id)) {
            siswaList.push({ uid: u.id, ...u.data() });
          }
        });
        setSiswaDiKelas(siswaList);
      } else {
        setSiswaDiKelas([]);
      }
    } catch (err) {
      console.error("Gagal memuat rincian kelas tutor dari Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kelasId]);

  // Langkah Tutor Membuat Pertemuan (PRD Bab 4.12)
  const handleBuatPertemuan = async (e) => {
    e.preventDefault();
    if (materiUrl && !materiUrl.startsWith("https://")) {
      setUrlError("Tautan materi bila diisi wajib diawali https://");
      return;
    }

    try {
      await addDoc(collection(db, "pertemuan"), {
        kelasId: kelas.id,
        tanggal,
        topik: topik.trim(),
        materiUrl: materiUrl.trim(),
        hadirIds: [],
      });

      setIsPertemuanModalOpen(false);
      setTopik("");
      setMateriUrl("");
      setUrlError("");
      setToast("Pertemuan baru berhasil disimpan ke Firestore! Siswa dapat langsung melihatnya di Kelas Saya.");
      setTimeout(() => setToast(""), 6000);

      await fetchData();
    } catch (err) {
      console.error("Gagal membuat pertemuan:", err);
      alert("Gagal menyimpan pertemuan ke Firestore.");
    }
  };

  // Langkah Tutor Membuat Tugas (PRD Bab 4.13)
  const handleBuatTugas = async (e) => {
    e.preventDefault();
    if (!judulTugas.trim() || !deskripsiTugas.trim()) return;

    try {
      setIsSubmittingTugas(true);

      const deadline = new Date(batasWaktuTugas);

      // Tulis dokumen tugas ke Firestore
      await addDoc(collection(db, "tugas"), {
        kelasId: kelas.id,
        judul: judulTugas.trim(),
        deskripsi: deskripsiTugas.trim(),
        batasWaktu: Timestamp.fromDate(deadline),
      });

      setIsTugasModalOpen(false);
      setJudulTugas("");
      setDeskripsiTugas("");
      setToast("Tugas baru berhasil dibuat di Firestore! Tugas langsung muncul di Beranda setiap siswa di kelas ini.");
      setTimeout(() => setToast(""), 6000);

      await fetchData();
    } catch (err) {
      console.error("Gagal membuat tugas di Firestore:", err);
      alert("Gagal menyimpan tugas baru ke Firestore.");
    } finally {
      setIsSubmittingTugas(false);
    }
  };

  const handleOpenPresensi = (meet) => {
    setSelectedPertemuan(meet);
    setHadirSiswaIds(meet.hadirIds || []);
  };

  const togglePresensi = (uid) => {
    if (hadirSiswaIds.includes(uid)) {
      setHadirSiswaIds(hadirSiswaIds.filter((id) => id !== uid));
    } else {
      setHadirSiswaIds([...hadirSiswaIds, uid]);
    }
  };

  const handleSimpanPresensi = async () => {
    try {
      await updateDoc(doc(db, "pertemuan", selectedPertemuan.id), {
        hadirIds: hadirSiswaIds,
      });

      setSelectedPertemuan(null);
      setToast(`Presensi untuk "${selectedPertemuan.topik}" berhasil diperbarui di Firestore!`);
      setTimeout(() => setToast(""), 5000);

      await fetchData();
    } catch (err) {
      console.error("Gagal menyimpan presensi:", err);
      alert("Gagal menyimpan presensi.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
        <p className="text-xs text-[#5A6B78]">Membaca kelas tutor dari Cloud Firestore...</p>
      </div>
    );
  }

  const isAuthorized =
    userProfile?.role === "super_admin" ||
    (kelas?.tutorId && kelas.tutorId === user?.uid);

  if (!kelas || (!loading && !isAuthorized)) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1F2937]">
          {!kelas ? "Kelas Tidak Ditemukan" : "Akses Ditolak"}
        </h2>
        <p className="text-sm text-[#5A6B78] mt-1">
          {!kelas
            ? "ID kelas ini tidak terdaftar di Firestore."
            : "Anda bukan tutor pengampu untuk rombongan belajar kelas ini."}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/tutor"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dasbor Tutor
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
            Kelas yang Diajar
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Informasi Utama Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {program?.nama || "Program Bimbel"} ({program?.jenjang || "-"})
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{kelas.nama}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#5A6B78]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#EA580C]" />
                <span>Jadwal: <strong className="text-[#1F2937]">{kelas.hari}, {kelas.jam} WITA</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EA580C]" />
                <span>Lokasi: <strong className="text-[#1F2937]">{kelas.tempat}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#EA580C]" />
                <span>Jumlah Siswa: <strong className="text-[#1F2937]">{siswaDiKelas.length} Siswa</strong></span>
              </div>
            </div>
          </div>

          {/* Tombol Buat Pertemuan & Buat Tugas sesuai PRD 4.12 & 4.13 */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPertemuanModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-[#1F2937] font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Buat Pertemuan
            </button>
            <button
              type="button"
              onClick={() => setIsTugasModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Buat Tugas Baru
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Tugas Kelas & Penilaian (PRD Bab 4.13) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EA580C]" />
            Daftar Tugas Kelas ({tugasList.length} Tugas)
          </h2>
          <span className="text-xs text-[#5A6B78]">Klik &quot;Periksa & Beri Nilai&quot; untuk memeriksa jawaban siswa</span>
        </div>

        {tugasList.length === 0 ? (
          <div className="p-8 bg-[#F7F5F2] rounded-xl text-center text-xs text-[#5A6B78]">
            Belum ada tugas untuk kelas ini. Klik tombol &quot;Buat Tugas Baru&quot; di atas.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tugasList.map((tugas) => {
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
                <div
                  key={tugas.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#1F2937]">{tugas.judul}</h3>
                    <p className="text-xs text-[#5A6B78] line-clamp-1">{tugas.deskripsi}</p>
                    <div className="text-xs text-red-600 font-medium tabular-nums flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Batas Waktu: {deadlineStr} WITA</span>
                    </div>
                  </div>

                  <Link
                    href={`/tutor/tugas/${tugas.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Periksa & Beri Nilai
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bagian Pertemuan & Presensi Kehadiran */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#EA580C]" />
            Pertemuan & Presensi Kehadiran ({pertemuanList.length} Pertemuan)
          </h2>
          <span className="text-xs text-[#5A6B78]">Klik presensi untuk mencentang kehadiran</span>
        </div>

        {pertemuanList.length === 0 ? (
          <div className="p-8 bg-[#F7F5F2] rounded-xl text-center text-xs text-[#5A6B78]">
            Belum ada pertemuan yang dibuat. Klik &quot;Buat Pertemuan&quot; untuk menambahkan materi sesi belajar.
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
                    <span className="text-xs font-bold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-md">
                      Pertemuan {idx + 1}
                    </span>
                    <span className="text-xs text-[#5A6B78] tabular-nums">{meet.tanggal}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1F2937]">{meet.topik}</h3>
                  <div className="text-xs text-[#5A6B78] flex items-center gap-2">
                    <span>Hadir: <strong>{meet.hadirIds?.length || 0}</strong> dari {siswaDiKelas.length} siswa</span>
                    {meet.materiUrl && (
                      <a
                        href={meet.materiUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#EA580C] hover:underline ml-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Tautan Materi
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPresensi(meet)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EA580C]/10 text-[#EA580C] hover:bg-[#EA580C] hover:text-white rounded-lg text-xs font-semibold transition"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Isi Presensi Kehadiran
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daftar Siswa di Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-[#1F2937] mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#EA580C]" />
          Daftar Siswa Kelas Ini ({siswaDiKelas.length} Siswa)
        </h2>
        {siswaDiKelas.length === 0 ? (
          <div className="p-6 bg-[#F7F5F2] rounded-xl text-xs text-[#5A6B78]">
            Belum ada siswa yang dimasukkan oleh staf.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {siswaDiKelas.map((s) => (
              <div key={s.uid} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#1F2937]">{s.nama}</div>
                  <div className="text-[#5A6B78]">{s.email}</div>
                </div>
                <div className="text-[#5A6B78] tabular-nums">HP: {s.noHp || "-"}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Buat Tugas Baru (PRD Bab 4.13) */}
      {isTugasModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">Buat Tugas Baru</h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Tugas akan otomatis muncul di Beranda setiap siswa di kelas &quot;{kelas.nama}&quot;.
            </p>

            <form onSubmit={handleBuatTugas} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Judul Tugas *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Latihan Penalaran Umum UTBK Bab 3"
                  value={judulTugas}
                  onChange={(e) => setJudulTugas(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Deskripsi / Petunjuk Pengerjaan *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Selesaikan 15 soal latihan di buku dan kumpulkan tautan Google Drive jawaban Anda."
                  value={deskripsiTugas}
                  onChange={(e) => setDeskripsiTugas(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Batas Waktu Pengumpulan *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={batasWaktuTugas}
                  onChange={(e) => setBatasWaktuTugas(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTugasModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-[#5A6B78] rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTugas}
                  className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  {isSubmittingTugas ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Tugas ke Firestore"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Buat Pertemuan */}
      {isPertemuanModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">Buat Pertemuan Baru</h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Pertemuan dan materi akan langsung muncul di halaman Kelas Saya milik siswa.
            </p>

            {urlError && (
              <div className="p-3 mb-3 bg-red-50 text-[#E53935] border border-red-200 rounded-xl text-xs font-semibold">
                {urlError}
              </div>
            )}

            <form onSubmit={handleBuatPertemuan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Tanggal Pertemuan *
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Topik Bahasan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Persamaan Linear Satu Variabel"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Tautan Materi (Wajib diawali https:// bila diisi)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={materiUrl}
                  onChange={(e) => setMateriUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPertemuanModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-[#5A6B78] rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Simpan Pertemuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Presensi Kehadiran */}
      {selectedPertemuan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">Presensi Kehadiran Siswa</h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Centang siswa yang hadir pada pertemuan &quot;{selectedPertemuan.topik}&quot; ({selectedPertemuan.tanggal}).
            </p>

            {siswaDiKelas.length === 0 ? (
              <div className="p-4 bg-slate-50 text-xs text-[#5A6B78] rounded-xl mb-4 text-center">
                Belum ada siswa di kelas ini.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 mb-4 border border-slate-100 rounded-xl">
                {siswaDiKelas.map((s) => {
                  const isHadir = hadirSiswaIds.includes(s.uid);
                  return (
                    <div
                      key={s.uid}
                      onClick={() => togglePresensi(s.uid)}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition text-xs"
                    >
                      <div className="font-semibold text-[#1F2937]">{s.nama}</div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${isHadir
                            ? "bg-[#15A66A] border-[#15A66A] text-white"
                            : "border-slate-300 bg-white"
                          }`}
                      >
                        {isHadir && <CheckCircle className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPertemuan(null)}
                className="px-4 py-2 border border-slate-200 text-[#5A6B78] rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSimpanPresensi}
                className="px-5 py-2 bg-[#15A66A] hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                Simpan Presensi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KelasDiajarPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs">Memuat kelas...</div>}>
        <KelasDiajarContent />
      </Suspense>
    </AppShell>
  );
}
