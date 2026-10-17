"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  GraduationCap,
  Users,
  CheckCircle,
  School,
  FileText,
  BarChart3,
  Layers,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const sections = [
    {
      title: "Siswa (4.2 - 4.6)",
      desc: "Antarmuka untuk siswa melihat jadwal, materi, tugas, dan nilai pribadi.",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-600",
      links: [
        { name: "Beranda Siswa (/beranda)", href: "/beranda" },
        { name: "Katalog Program (/program)", href: "/program" },
        { name: "Kelas Saya (/kelas)", href: "/kelas" },
        { name: "Rincian Kelas (/kelas/kelas-utbk-a)", href: "/kelas/kelas-utbk-a" },
        { name: "Halaman Tugas (/tugas/tugas-pu-3)", href: "/tugas/tugas-pu-3" },
      ],
    },
    {
      title: "Staf Administrasi (4.7 - 4.10)",
      desc: "Antarmuka staf untuk memeriksa pembayaran pendaftaran, menyusun kelas, dan data siswa.",
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      links: [
        { name: "Dasbor Staf (/staf)", href: "/staf" },
        { name: "Pendaftaran Siswa (/staf/pendaftaran)", href: "/staf/pendaftaran" },
        { name: "Kelola Kelas (/staf/kelas)", href: "/staf/kelas" },
        { name: "Rincian Kelas Staf (/staf/kelas/kelas-utbk-a)", href: "/staf/kelas/kelas-utbk-a" },
        { name: "Data Siswa & Kontak Ortu (/staf/siswa)", href: "/staf/siswa" },
      ],
    },
    {
      title: "Tutor Pengajar (4.11 - 4.13)",
      desc: "Antarmuka pengajar untuk membuat pertemuan, presensi, tugas, dan memberi nilai.",
      icon: School,
      color: "from-purple-500 to-violet-600",
      links: [
        { name: "Dasbor Tutor (/tutor)", href: "/tutor" },
        { name: "Kelas yang Diajar (/tutor/kelas/kelas-utbk-a)", href: "/tutor/kelas/kelas-utbk-a" },
        { name: "Tugas dan Nilai (/tutor/tugas/tugas-pu-3)", href: "/tutor/tugas/tugas-pu-3" },
      ],
    },
    {
      title: "Super Admin (4.14 - 4.17)",
      desc: "Antarmuka pemilik bimbel untuk memantau metrik, kelola akun, program, dan laporan bulanan.",
      icon: BarChart3,
      color: "from-amber-500 to-orange-600",
      links: [
        { name: "Dasbor Admin (/admin)", href: "/admin" },
        { name: "Kelola Pengguna (/admin/pengguna)", href: "/admin/pengguna" },
        { name: "Ubah Pengguna (/admin/pengguna/tutor-nadia)", href: "/admin/pengguna/tutor-nadia" },
        { name: "Master Program (/admin/program)", href: "/admin/program" },
        { name: "Laporan Rekapitulasi (/admin/laporan)", href: "/admin/laporan" },
      ],
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-[#EA580C] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Sesuai PRD Bimbel Langkah Juara Makassar
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Portal Belajar <span className="text-[#EA580C]">Langkah Juara</span>
            </h1>
            <p className="mt-3 text-base text-[#5A6B78] leading-relaxed">
              Satu portal terpadu untuk siswa, staf administrasi, tutor, dan pemilik bimbel.
              Semua rute halaman Bab 4 telah terpasang dengan palet warna resmi Bab 5.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/beranda"
                className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition"
              >
                Mulai dari Beranda Siswa
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/masuk"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#1F2937] px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Halaman Masuk (4.1)
              </Link>
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#1F2937] px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Halaman Daftar (4.1)
              </Link>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">Peta Seluruh Halaman (Bab 4 PRD)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1F2937]">{sec.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-[#5A6B78] mb-4">{sec.desc}</p>
                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      {sec.links.map((link, lIdx) => (
                        <Link
                          key={lIdx}
                          href={link.href}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#1F2937] hover:bg-orange-50 hover:text-[#EA580C] font-medium transition"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
