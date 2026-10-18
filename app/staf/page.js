"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Users,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  Sparkles,
  School,
  Loader2,
} from "lucide-react";

export default function DasborStafPage() {
  const { userProfile } = useAuth();
  const [pendaftaranList, setPendaftaranList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [programsMap, setProgramsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Ambil pendaftaran dari Firestore
        const pendSnap = await getDocs(collection(db, "pendaftaran"));
        const pends = pendSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPendaftaranList(pends);

        // 2. Ambil kelas dari Firestore
        const kelasSnap = await getDocs(collection(db, "kelas"));
        const kList = kelasSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setKelasList(kList);

        // 3. Lookup program & users
        const progSnap = await getDocs(collection(db, "program"));
        const pMap = {};
        progSnap.forEach((p) => {
          pMap[p.id] = p.data();
        });
        setProgramsMap(pMap);

        const uSnap = await getDocs(collection(db, "users"));
        const uMap = {};
        uSnap.forEach((u) => {
          uMap[u.id] = u.data();
        });
        setUsersMap(uMap);
      } catch (err) {
        console.error("Gagal mengambil data dasbor staf:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendaftaranMenunggu = pendaftaranList.filter((p) => p.status === "menunggu");
  const namaStaf = userProfile?.nama || "Kak Fira";

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Dasbor Staf */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <ClipboardList className="w-3.5 h-3.5" />
              Dasbor Administrasi &bull; Bab 4.7 PRD (Firestore Langsung)
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Dasbor Staf ({namaStaf})</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Kelola verifikasi pendaftaran program, penyusunan kelas belajar, dan data siswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/staf/kelas"
              className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
            >
              <School className="w-4 h-4" />
              Kelola Kelas
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin mb-2" />
            <p className="text-xs text-[#5A6B78]">Membaca data operasional dari Cloud Firestore...</p>
          </div>
        ) : (
          /* 2 Kartu Utama Sesuai Bab 4.7 PRD */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartu 1: Pendaftaran Menunggu */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Verifikasi Pembayaran
                  </span>
                  <span className="text-xs text-[#5A6B78]">Menunggu Konfirmasi</span>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <Link
                    href="/staf/pendaftaran?status=menunggu"
                    className="text-5xl font-extrabold text-[#F59E0B] hover:text-amber-600 transition tabular-nums"
                  >
                    {pendaftaranMenunggu.length}
                  </Link>
                  <span className="text-sm font-semibold text-[#1F2937]">Pendaftaran Menunggu</span>
                </div>

                <p className="text-xs text-[#5A6B78] leading-relaxed">
                  Calon siswa telah mengajukan program belajar dan menunggu konfirmasi bukti bayar di kantor Bimbel Langkah Juara.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/staf/pendaftaran?status=menunggu"
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-xs"
                >
                  Buka Pendaftaran Menunggu ({pendaftaranMenunggu.length})
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Kartu 2: Kelas Bimbel Terjadwal */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-lg">
                    Operasional Bimbel
                  </span>
                  <span className="text-xs text-[#5A6B78] tabular-nums font-semibold">
                    {kelasList.length} Kelas Aktif
                  </span>
                </div>

                <div className="space-y-3">
                  {kelasList.slice(0, 2).map((k) => (
                    <div
                      key={k.id}
                      className="p-3 bg-[#F7F5F2] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#1F2937]">{k.nama}</div>
                        <div className="text-[#5A6B78]">
                          Tutor: {usersMap[k.tutorId]?.nama || "Tutor"} &bull; {k.tempat}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#EA580C]">{k.hari}</div>
                        <div className="text-[11px] text-[#5A6B78] tabular-nums">{k.jam} WITA</div>
                      </div>
                    </div>
                  ))}
                  {kelasList.length === 0 && (
                    <p className="text-xs text-[#5A6B78] italic">Belum ada kelas yang terdaftar.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/staf/kelas"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-xs"
                >
                  Kelola Seluruh Kelas ({kelasList.length})
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
