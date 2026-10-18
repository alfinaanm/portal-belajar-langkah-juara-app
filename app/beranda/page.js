"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  BookOpen,
  FileText,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function BerandaPage() {
  const { user, userProfile } = useAuth();
  const [kelasBerikutnya, setKelasBerikutnya] = useState(null);
  const [tugasBelumKumpul, setTugasBelumKumpul] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Ambil seluruh data program & users untuk lookup nama
        const progSnap = await getDocs(collection(db, "program"));
        const prMap = {};
        progSnap.forEach((p) => {
          prMap[p.id] = p.data();
        });

        const userSnap = await getDocs(collection(db, "users"));
        const uMap = {};
        userSnap.forEach((u) => {
          uMap[u.id] = u.data();
        });

        // 2. Ambil kelas milik siswa (PRD Bab 4.2)
        const kelasSnap = await getDocs(collection(db, "kelas"));
        const allKelas = kelasSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const myKelas = allKelas.filter((k) => {
          if (userProfile?.role === "super_admin") return true;
          return k.siswaIds && k.siswaIds.includes(user?.uid);
        });

        if (myKelas.length > 0) {
          const firstKelas = myKelas[0];
          setKelasBerikutnya({
            ...firstKelas,
            programNama: prMap[firstKelas.programId]?.nama || "Program Bimbel",
            tutorNama: uMap[firstKelas.tutorId]?.nama || "Tutor",
          });
        } else {
          setKelasBerikutnya(null);
        }

        // 3. Ambil tugas kelas milik siswa
        const myKelasIds = myKelas.map((k) => k.id);
        const tugasSnap = await getDocs(collection(db, "tugas"));
        const allTugas = tugasSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const myTugas = allTugas.filter((t) => myKelasIds.includes(t.kelasId));

        // 4. Ambil pengumpulan milik siswa
        const kumpulSnap = await getDocs(collection(db, "pengumpulan"));
        const myKumpul = [];
        kumpulSnap.forEach((d) => {
          const data = d.data();
          if (data.siswaId === user?.uid) {
            myKumpul.push({ id: d.id, ...data });
          }
        });
        const submittedTugasIds = myKumpul.map((k) => k.tugasId);

        // Filter tugas yang belum dikumpulkan
        const pendingTugas = myTugas.filter(
          (t) => !submittedTugasIds.includes(t.id)
        );

        // Urutkan berdasarkan batas waktu terdekat
        pendingTugas.sort((a, b) => {
          const dateA = a.batasWaktu?.toDate ? a.batasWaktu.toDate() : new Date(0);
          const dateB = b.batasWaktu?.toDate ? b.batasWaktu.toDate() : new Date(0);
          return dateA - dateB;
        });

        setTugasBelumKumpul(pendingTugas);
      } catch (err) {
        console.error("Gagal mengambil data beranda dari Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, userProfile]);

  const namaPengguna = userProfile?.nama || user?.displayName || "Siswa";

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Sambutan */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Portal Siswa
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Halo, {namaPengguna}! 👋</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Selamat datang kembali. Cek jadwal tatap muka dan tugas kelas aktifmu hari ini.
            </p>
          </div>
          <Link
            href="/program"
            className="inline-flex items-center gap-2 bg-orange-50 text-[#EA580C] hover:bg-orange-100 font-semibold px-4 py-2 rounded-xl text-sm transition"
          >
            Lihat Program Belajar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
            <p className="text-xs text-[#5A6B78]">Membaca data beranda Anda dari Cloud Firestore...</p>
          </div>
        ) : (
          /* Grid Kartu Utama Bab 4.2 PRD */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartu 1: Kelas Berikutnya */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-lg">
                    Kelas Berikutnya
                  </span>
                  <span className="text-xs text-[#5A6B78]">Tatap Muka Terdekat</span>
                </div>

                {kelasBerikutnya ? (
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-[#1F2937]">
                      {kelasBerikutnya.nama}
                    </h2>
                    <p className="text-xs text-[#5A6B78]">
                      Program: {kelasBerikutnya.programNama} &bull; Tutor: <strong>{kelasBerikutnya.tutorNama}</strong>
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-sm text-[#1F2937]">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-[#EA580C]" />
                        <span>{kelasBerikutnya.hari}</span>
                      </div>
                      <div className="flex items-center gap-2.5 tabular-nums">
                        <Clock className="w-4 h-4 text-[#EA580C]" />
                        <span>{kelasBerikutnya.jam} WITA</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#EA580C]" />
                        <span>{kelasBerikutnya.tempat}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-[#5A6B78] mb-3">Anda belum terdaftar di kelas mana pun.</p>
                    <Link
                      href="/program"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] hover:underline"
                    >
                      Buka Katalog Program &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {kelasBerikutnya && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={`/kelas/${kelasBerikutnya.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-xs"
                  >
                    <BookOpen className="w-4 h-4" />
                    Buka Rincian Kelas
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Kartu 2: Tugas Belum Dikumpulkan */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Tugas Perlu Dikerjakan
                  </span>
                  <span className="text-xs text-[#5A6B78] tabular-nums font-semibold">
                    {tugasBelumKumpul.length} Tugas Menunggu
                  </span>
                </div>

                {tugasBelumKumpul.length > 0 ? (
                  <div className="space-y-3">
                    {tugasBelumKumpul.slice(0, 1).map((tugas) => {
                      let deadlineStr = "-";
                      if (tugas.batasWaktu?.toDate) {
                        deadlineStr = tugas.batasWaktu.toDate().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }

                      return (
                        <div key={tugas.id} className="space-y-3">
                          <h2 className="text-xl font-bold text-[#1F2937]">{tugas.judul}</h2>
                          <p className="text-xs text-[#5A6B78] line-clamp-2">
                            {tugas.deskripsi}
                          </p>

                          <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-red-600 font-semibold tabular-nums">
                              <Clock className="w-4 h-4" />
                              <span>Batas Waktu: {deadlineStr} WITA</span>
                            </div>
                            <StatusBadge status="belum dikumpulkan" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-[#15A66A] mx-auto" />
                    <p className="text-sm font-semibold text-[#1F2937]">Semua tugas sudah dikumpulkan!</p>
                    <p className="text-xs text-[#5A6B78]">
                      Kerja hebat! Tidak ada tugas yang tertunda saat ini.
                    </p>
                  </div>
                )}
              </div>

              {tugasBelumKumpul.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={`/tugas/${tugasBelumKumpul[0].id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1F2937] hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    Kumpulkan Tugas Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
