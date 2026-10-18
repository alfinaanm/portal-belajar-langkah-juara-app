"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
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
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function KelolaKelasPage() {
  const router = useRouter();
  const [kelasList, setKelasList] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states untuk Buat Kelas
  const [namaKelas, setNamaKelas] = useState("");
  const [programId, setProgramId] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [hari, setHari] = useState("Selasa");
  const [jam, setJam] = useState("16.00 - 17.30");
  const [tempat, setTempat] = useState("Ruang 2 (Lantai 1)");

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Ambil seluruh kelas dari Firestore
      const kelasSnap = await getDocs(collection(db, "kelas"));
      const kelasData = kelasSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKelasList(kelasData);

      // 2. Ambil tutor dari Firestore (users dengan role tutor)
      const userSnap = await getDocs(collection(db, "users"));
      const tutorList = [];
      userSnap.forEach((u) => {
        const data = u.data();
        if (data.role === "tutor") {
          tutorList.push({ uid: u.id, ...data });
        }
      });
      setTutors(tutorList);
      if (tutorList.length > 0 && !tutorId) {
        setTutorId(tutorList[0].uid);
      }

      // 3. Ambil program aktif dari Firestore
      const progSnap = await getDocs(collection(db, "program"));
      const progList = [];
      progSnap.forEach((p) => {
        const data = p.data();
        if (data.aktif) {
          progList.push({ id: p.id, ...data });
        }
      });
      setPrograms(progList);
      if (progList.length > 0 && !programId) {
        setProgramId(progList[0].id);
      }
    } catch (err) {
      console.error("Gagal memuat data kelas dari Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Langkah Staf membuat kelas (PRD Bab 4.9)
  const handleBuatKelas = async (e) => {
    e.preventDefault();
    if (!namaKelas.trim() || !programId || !tutorId) return;

    try {
      setIsSubmitting(true);

      // Tulis dokumen kelas baru ke Firestore
      const docRef = await addDoc(collection(db, "kelas"), {
        nama: namaKelas.trim(),
        programId: programId,
        tutorId: tutorId,
        siswaIds: [],
        hari: hari,
        jam: jam,
        tempat: tempat,
        dibuatPada: serverTimestamp(),
      });

      setIsModalOpen(false);
      // Langkah PRD 4.9: Rincian kelas terbuka di /staf/kelas/[id]
      router.push(`/staf/kelas/${docRef.id}`);
    } catch (err) {
      console.error("Gagal menyimpan kelas ke Firestore:", err);
      alert("Gagal menyimpan kelas baru ke Firestore.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgramNama = (pId) => {
    const p = programs.find((item) => item.id === pId);
    return p ? p.nama : pId;
  };

  const getTutorNama = (tId) => {
    const t = tutors.find((item) => item.uid === tId);
    return t ? t.nama : tId;
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <School className="w-3.5 h-3.5" />
              Kelola Kelas Belajar &bull; Bab 4.9 PRD (Firestore Langsung)
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Daftar Kelas Bimbel</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Susun rombongan belajar, tetapkan tutor pengampu, dan atur jadwal ruang.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#1F2937] text-xs font-semibold rounded-xl transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Segarkan
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Buat Kelas Baru
            </button>
          </div>
        </div>

        {/* Tabel Kelola Kelas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
              <p className="text-xs text-[#5A6B78]">Memuat data kelas dari Cloud Firestore...</p>
            </div>
          ) : kelasList.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#5A6B78]">
              Belum ada kelas yang dibuat di Firestore. Klik &quot;Buat Kelas Baru&quot; untuk memulai.
            </div>
          ) : (
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
                <tbody className="divide-y divide-slate-100">
                  {kelasList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-4 font-bold text-[#1F2937]">
                        {k.nama}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-orange-50 text-[#EA580C] rounded-md">
                          {getProgramNama(k.programId)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#1F2937] font-medium">
                        {getTutorNama(k.tutorId)}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#5A6B78]">
                        <div className="font-medium text-[#1F2937]">{k.hari}</div>
                        <div className="tabular-nums">{k.jam} WITA</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-[#5A6B78]">
                        {k.tempat}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full tabular-nums">
                          <Users className="w-3 h-3 text-[#EA580C]" />
                          {k.siswaIds?.length || 0} Siswa
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/staf/kelas/${k.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 py-1.5 px-3 rounded-lg transition"
                        >
                          Kelola Siswa
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Buat Kelas (Bab 4.9 PRD) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <h3 className="text-lg font-bold text-[#1F2937] mb-1">Buat Kelas Baru</h3>
              <p className="text-xs text-[#5A6B78] mb-4">
                Tentukan nama kelas, program, tutor penanggung jawab, jadwal, dan lokasi belajar.
              </p>

              <form onSubmit={handleBuatKelas} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Nama Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Intensif UTBK A"
                    value={namaKelas}
                    onChange={(e) => setNamaKelas(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Program Bimbel *
                    </label>
                    <select
                      value={programId}
                      onChange={(e) => setProgramId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
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
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    >
                      {tutors.map((t) => (
                        <option key={t.uid} value={t.uid}>
                          {t.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Hari *
                    </label>
                    <select
                      value={hari}
                      onChange={(e) => setHari(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    >
                      {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                      Jam *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="16.00 - 17.30"
                      value={jam}
                      onChange={(e) => setJam(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                    Tempat Belajar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ruang 2 (Lantai 1) atau Tautan Google Meet"
                    value={tempat}
                    onChange={(e) => setTempat(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                        Menyimpan ke Firestore...
                      </>
                    ) : (
                      "Simpan Kelas & Atur Siswa"
                    )}
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
