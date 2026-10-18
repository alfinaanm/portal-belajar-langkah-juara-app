"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Plus,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  Loader2,
  Trash2,
  RefreshCw,
} from "lucide-react";

function RincianKelolaKelasContent() {
  const params = useParams();
  const kelasId = params?.id;

  const [kelas, setKelas] = useState(null);
  const [program, setProgram] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [siswaDiKelas, setSiswaDiKelas] = useState([]);
  const [calonSiswaAktif, setCalonSiswaAktif] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    if (!kelasId) return;

    try {
      setLoading(true);

      // 1. Ambil dokumen kelas
      const kelasRef = doc(db, "kelas", kelasId);
      const kelasSnap = await getDoc(kelasRef);

      if (!kelasSnap.exists()) {
        setKelas(null);
        return;
      }

      const kelasData = { id: kelasSnap.id, ...kelasSnap.data() };
      setKelas(kelasData);

      // 2. Ambil dokumen program
      if (kelasData.programId) {
        const progSnap = await getDoc(doc(db, "program", kelasData.programId));
        if (progSnap.exists()) {
          setProgram({ id: progSnap.id, ...progSnap.data() });
        }
      }

      // 3. Ambil data tutor
      if (kelasData.tutorId) {
        const tutorSnap = await getDoc(doc(db, "users", kelasData.tutorId));
        if (tutorSnap.exists()) {
          setTutor({ uid: tutorSnap.id, ...tutorSnap.data() });
        }
      }

      // 4. Ambil seluruh users untuk lookup
      const usersSnap = await getDocs(collection(db, "users"));
      const allUsersMap = {};
      usersSnap.forEach((u) => {
        allUsersMap[u.id] = { uid: u.id, ...u.data() };
      });

      // 5. Filter siswa yang sudah ada di kelas
      const currentSiswa = (kelasData.siswaIds || [])
        .map((uid) => allUsersMap[uid])
        .filter(Boolean);
      setSiswaDiKelas(currentSiswa);

      // 6. PRD Bab 4.9: Hanya siswa yang memiliki pendaftaran AKTIF untuk program itu yang boleh dimasukkan
      const pendQ = query(
        collection(db, "pendaftaran"),
        where("programId", "==", kelasData.programId),
        where("status", "==", "aktif")
      );
      const pendSnap = await getDocs(pendQ);

      const calonSiswa = [];
      pendSnap.forEach((docItem) => {
        const pData = docItem.data();
        const userObj = allUsersMap[pData.siswaId];
        // Hanya yang belum terdaftar di kelas ini
        if (userObj && !(kelasData.siswaIds || []).includes(userObj.uid)) {
          // Hindari duplikasi jika ada multiple pendaftaran
          if (!calonSiswa.some((c) => c.uid === userObj.uid)) {
            calonSiswa.push(userObj);
          }
        }
      });

      setCalonSiswaAktif(calonSiswa);
      if (calonSiswa.length > 0) {
        setSelectedSiswaId(calonSiswa[0].uid);
      } else {
        setSelectedSiswaId("");
      }
    } catch (err) {
      console.error("Gagal mengambil rincian kelas dari Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kelasId]);

  // Langkah Staf memasukkan siswa ke kelas (PRD Bab 4.9)
  const handleTambahSiswa = async (e) => {
    e.preventDefault();
    if (!selectedSiswaId || !kelas) return;

    try {
      setIsSubmitting(true);

      // Tulis pembaruan ke Firestore: arrayUnion ke field siswaIds di dokumen kelas
      await updateDoc(doc(db, "kelas", kelas.id), {
        siswaIds: arrayUnion(selectedSiswaId),
      });

      const siswaObj = calonSiswaAktif.find((u) => u.uid === selectedSiswaId);
      const nama = siswaObj ? siswaObj.nama : "Siswa";

      setToast(
        `${nama} berhasil dimasukkan ke kelas "${kelas.nama}" di Firestore! Siswa langsung dapat melihat kelas ini di menu Kelas Saya.`
      );
      setTimeout(() => setToast(""), 6000);
      setIsTambahModalOpen(false);

      // Segarkan data dari Firestore
      await fetchData();
    } catch (err) {
      console.error("Gagal menambahkan siswa ke kelas di Firestore:", err);
      alert("Gagal menambahkan siswa ke kelas di Firestore.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
        <p className="text-xs text-[#5A6B78]">Membaca data rincian kelas dari Cloud Firestore...</p>
      </div>
    );
  }

  if (!kelas) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#1F2937]">Kelas Tidak Ditemukan</h2>
        <p className="text-sm text-[#5A6B78] mt-1">ID kelas ini tidak terdaftar di Cloud Firestore.</p>
        <Link
          href="/staf/kelas"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#EA580C] font-semibold hover:underline"
        >
          &larr; Kembali ke Daftar Kelas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/staf/kelas"
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
            Rincian Kelas
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#15A66A] flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Informasi Kelas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              {program?.nama || "Program Bimbel"} ({program?.jenjang || "-"})
            </span>
            <h1 className="text-2xl font-bold text-[#1F2937] mt-1">{kelas.nama}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#5A6B78]">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#EA580C]" />
                <span>Tutor: <strong className="text-[#1F2937]">{tutor?.nama || "Tutor"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#EA580C]" />
                <span>Jadwal: <strong className="text-[#1F2937]">{kelas.hari}, {kelas.jam} WITA</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#EA580C]" />
                <span>Tempat: <strong className="text-[#1F2937]">{kelas.tempat}</strong></span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTambahModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Tambah Siswa ke Kelas
          </button>
        </div>
      </div>

      {/* Daftar Siswa yang Sudah Masuk Kelas Ini */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#EA580C]" />
            Daftar Siswa Terdaftar ({siswaDiKelas.length} Siswa)
          </h2>
          <span className="text-xs text-[#5A6B78]">
            Siswa dapat langsung membuka materi dan tugas kelas ini
          </span>
        </div>

        {siswaDiKelas.length === 0 ? (
          <div className="p-8 bg-[#F7F5F2] rounded-xl text-center text-xs text-[#5A6B78]">
            Belum ada siswa yang dimasukkan ke kelas ini. Klik tombol &quot;Tambah Siswa ke Kelas&quot; di atas.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {siswaDiKelas.map((s, idx) => (
              <div
                key={s.uid}
                className="py-3 flex items-center justify-between hover:bg-slate-50/50 p-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-[#EA580C] font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1F2937]">{s.nama}</div>
                    <div className="text-[11px] text-[#5A6B78]">{s.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-[#5A6B78]">
                  <div>HP: <strong className="text-[#1F2937]">{s.noHp || "-"}</strong></div>
                  <div>Ortu: <strong className="text-[#1F2937]">{s.noHpOrangTua || "-"}</strong></div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-[#15A66A] rounded-md font-semibold text-[11px]">
                    Aktif
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Siswa (Bab 4.9 PRD: Hanya siswa dengan pendaftaran aktif yang muncul) */}
      {isTambahModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-1">
              Tambah Siswa ke {kelas.nama}
            </h3>
            <p className="text-xs text-[#5A6B78] mb-4">
              Hanya siswa dengan <strong>pendaftaran aktif</strong> untuk program &quot;{program?.nama}&quot; yang tampil pada pilihan.
            </p>

            {calonSiswaAktif.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2 mb-4">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  Tidak Ada Calon Siswa Baru
                </div>
                <p>
                  Semua siswa dengan pendaftaran aktif pada program ini sudah masuk ke kelas, atau belum ada pendaftaran baru yang disetujui staf.
                </p>
                <Link
                  href="/staf/pendaftaran"
                  className="inline-block text-[#EA580C] font-semibold hover:underline mt-1"
                >
                  &rarr; Cek menu Pendaftaran Siswa
                </Link>
              </div>
            ) : (
              <form onSubmit={handleTambahSiswa} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Pilih Siswa (Pendaftaran Aktif) *
                  </label>
                  <select
                    value={selectedSiswaId}
                    onChange={(e) => setSelectedSiswaId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    required
                  >
                    {calonSiswaAktif.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.nama} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsTambahModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-[#5A6B78] rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Tambahkan ke Kelas"
                    )}
                  </button>
                </div>
              </form>
            )}

            {calonSiswaAktif.length === 0 && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsTambahModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-[#1F2937] rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RincianKelolaKelasPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs">Memuat rincian kelas...</div>}>
        <RincianKelolaKelasContent />
      </Suspense>
    </AppShell>
  );
}
