"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { School, User, Calendar, Clock, MapPin, ArrowRight, BookOpen, Loader2 } from "lucide-react";

export default function KelasSayaPage() {
  const { user, userProfile } = useAuth();
  const [kelasList, setKelasList] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
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

        // 2. Ambil users untuk lookup nama tutor
        const userSnap = await getDocs(collection(db, "users"));
        const uMap = {};
        userSnap.forEach((u) => {
          uMap[u.id] = u.data();
        });
        setUsersMap(uMap);

        // 3. Ambil kelas dari Firestore
        const kelasSnap = await getDocs(collection(db, "kelas"));
        const allKelas = kelasSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // PRD 4.4: Hanya kelas yang memuat uid siswa di siswaIds (atau semua untuk Super Admin)
        const myKelas = allKelas.filter((k) => {
          if (userProfile?.role === "super_admin") return true;
          return k.siswaIds && k.siswaIds.includes(user?.uid);
        });

        setKelasList(myKelas);
      } catch (err) {
        console.error("Gagal mengambil data kelas siswa dari Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, userProfile]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <School className="w-3.5 h-3.5" />
            Kelas Saya &bull; Bab 4.4 PRD (Firestore Langsung)
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Kelas yang Anda Ikuti</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Daftar kelompok belajar Anda di Bimbel Langkah Juara Makassar.
          </p>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
            <p className="text-xs text-[#5A6B78]">Membaca kelas Anda dari Cloud Firestore...</p>
          </div>
        ) : kelasList.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <School className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-lg font-bold text-[#1F2937]">Anda Belum Terdaftar di Kelas Mana Pun</h2>
            <p className="text-xs text-[#5A6B78] max-w-sm mx-auto">
              Setelah pendaftaran program Anda disetujui, staf administrasi akan memasukkan Anda ke rombongan belajar kelas.
            </p>
            <Link
              href="/program"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#EA580C] hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              Lihat Program Belajar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kelasList.map((kelas) => {
              const program = programsMap[kelas.programId] || {};
              const tutor = usersMap[kelas.tutorId] || {};

              return (
                <div
                  key={kelas.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-orange-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-orange-50 text-[#EA580C] rounded-lg">
                        {program.nama || "Program Bimbel"}
                      </span>
                      <span className="text-xs text-[#15A66A] font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        Aktif
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1F2937] mb-4">{kelas.nama}</h3>

                    <div className="space-y-2.5 text-sm text-[#1F2937] border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2.5 text-xs text-[#5A6B78]">
                        <User className="w-4 h-4 text-[#EA580C]" />
                        <span>Tutor Pengajar: <strong className="text-[#1F2937]">{tutor.nama || "Tutor"}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#5A6B78]">
                        <Calendar className="w-4 h-4 text-[#EA580C]" />
                        <span>Hari: <strong className="text-[#1F2937]">{kelas.hari}</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#5A6B78] tabular-nums">
                        <Clock className="w-4 h-4 text-[#EA580C]" />
                        <span>Waktu: <strong className="text-[#1F2937]">{kelas.jam} WITA</strong></span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-[#5A6B78]">
                        <MapPin className="w-4 h-4 text-[#EA580C]" />
                        <span>Lokasi: <strong className="text-[#1F2937]">{kelas.tempat}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/kelas/${kelas.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-xs"
                    >
                      <BookOpen className="w-4 h-4" />
                      Buka Rincian & Materi Kelas
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
