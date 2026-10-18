"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  School,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  User,
  Users,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function DasborTutorPage() {
  const { user, userProfile } = useAuth();
  const [kelasList, setKelasList] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Ambil programs untuk lookup nama program
        const progSnap = await getDocs(collection(db, "program"));
        const prMap = {};
        progSnap.forEach((p) => {
          prMap[p.id] = p.data();
        });
        setProgramsMap(prMap);

        // 2. Ambil seluruh kelas dari Firestore
        const kelasSnap = await getDocs(collection(db, "kelas"));
        const allKelas = kelasSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // PRD Bab 4.11: Hanya kelas dengan tutorId sama dengan uid tutor yang masuk yang tampil
        const myKelas = allKelas.filter((k) => {
          if (userProfile?.role === "super_admin") return true;
          return k.tutorId === user?.uid;
        });

        setKelasList(myKelas);
      } catch (err) {
        console.error("Gagal mengambil data kelas tutor dari Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, userProfile]);

  const namaTutor = userProfile?.nama || user?.displayName || "Tutor";

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Dasbor Tutor */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <School className="w-3.5 h-3.5" />
              Dasbor Pengajar
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">
              Dasbor Tutor: {namaTutor}
            </h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Kelola pertemuan tatap muka, bagikan materi belajar, isi presensi kehadiran, dan periksa tugas siswa.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
            <p className="text-xs text-[#5A6B78]">Membaca kelas yang Anda ajar dari Cloud Firestore...</p>
          </div>
        ) : kelasList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <School className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-[#1F2937]">Belum Ada Kelas yang Ditugaskan</h2>
            <p className="text-xs text-[#5A6B78] max-w-sm mx-auto">
              Staf administrasi akan menugaskan Anda sebagai pengampu rombongan belajar kelas di menu Kelola Kelas.
            </p>
          </div>
        ) : (
          /* Daftar Kelas yang Diajar Tutor (PRD 4.11) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1F2937]">
                Semua Kelas yang Anda Ajar ({kelasList.length} Kelas)
              </h2>
              <span className="text-xs text-[#5A6B78]">Data langsung dari Cloud Firestore</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kelasList.map((k) => {
                const program = programsMap[k.programId] || {};

                return (
                  <div
                    key={k.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-orange-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-orange-50 text-[#EA580C] rounded-lg">
                          {program.nama || "Program Bimbel"}
                        </span>
                        <span className="text-xs text-[#5A6B78] font-semibold tabular-nums">
                          {k.siswaIds?.length || 0} Siswa Terdaftar
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#1F2937] mb-4">{k.nama}</h3>

                      <div className="space-y-2.5 text-xs text-[#5A6B78] border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#EA580C]" />
                          <span>Hari: <strong className="text-[#1F2937]">{k.hari}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 tabular-nums">
                          <Clock className="w-4 h-4 text-[#EA580C]" />
                          <span>Waktu: <strong className="text-[#1F2937]">{k.jam} WITA</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#EA580C]" />
                          <span>Lokasi: <strong className="text-[#1F2937]">{k.tempat}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Link
                        href={`/tutor/kelas/${k.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-xs"
                      >
                        <BookOpen className="w-4 h-4" />
                        Kelola Pertemuan, Tugas & Nilai
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
