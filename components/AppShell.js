"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Home,
  Layers,
  Menu,
  School,
  Shield,
  User,
  Users,
  X,
  ChevronRight,
  LogOut,
  Sparkles,
  BarChart3,
  ClipboardList,
} from "lucide-react";

// Navigasi dikelompokkan sesuai Bab 3.1 PRD
const navSections = [
  {
    roleTitle: "Siswa (Raka / Salsa)",
    roleKey: "siswa",
    badgeColor: "bg-blue-100 text-blue-800",
    items: [
      { label: "Beranda", href: "/beranda", icon: Home },
      { label: "Program", href: "/program", icon: Layers },
      { label: "Kelas Saya", href: "/kelas", icon: School },
      { label: "Rincian Kelas (Contoh)", href: "/kelas/kelas-utbk-a", icon: BookOpen },
      { label: "Tugas Siswa (Contoh)", href: "/tugas/tugas-pu-3", icon: FileText },
    ],
  },
  {
    roleTitle: "Staf Administrasi (Kak Fira)",
    roleKey: "staf",
    badgeColor: "bg-emerald-100 text-emerald-800",
    items: [
      { label: "Dasbor Staf", href: "/staf", icon: Home },
      { label: "Pendaftaran Siswa", href: "/staf/pendaftaran", icon: CheckCircle },
      { label: "Kelola Kelas (Daftar)", href: "/staf/kelas", icon: School },
      { label: "Kelola Kelas (Rincian)", href: "/staf/kelas/kelas-utbk-a", icon: Users },
      { label: "Data Siswa", href: "/staf/siswa", icon: ClipboardList },
    ],
  },
  {
    roleTitle: "Tutor Pengajar (Kak Dimas / Kak Nadia)",
    roleKey: "tutor",
    badgeColor: "bg-purple-100 text-purple-800",
    items: [
      { label: "Dasbor Tutor", href: "/tutor", icon: Home },
      { label: "Kelas yang Diajar (Rincian)", href: "/tutor/kelas/kelas-utbk-a", icon: School },
      { label: "Tugas dan Nilai", href: "/tutor/tugas/tugas-pu-3", icon: FileText },
    ],
  },
  {
    roleTitle: "Super Admin (Pak Arif)",
    roleKey: "super_admin",
    badgeColor: "bg-amber-100 text-amber-800",
    items: [
      { label: "Dasbor Admin", href: "/admin", icon: BarChart3 },
      { label: "Kelola Pengguna", href: "/admin/pengguna", icon: Users },
      { label: "Program (Admin)", href: "/admin/program", icon: Layers },
      { label: "Laporan Bulanan", href: "/admin/laporan", icon: BarChart3 },
    ],
  },
  {
    roleTitle: "Publik & Akun",
    roleKey: "public",
    badgeColor: "bg-slate-100 text-slate-800",
    items: [
      { label: "Profil Akun", href: "/profil", icon: User },
      { label: "Halaman Masuk", href: "/masuk", icon: LogOut },
      { label: "Halaman Daftar", href: "/daftar", icon: Sparkles },
    ],
  },
];

function SidebarLinks({ onNavClick }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 pt-2">
      {navSections.map((sec, idx) => (
        <div key={idx} className="space-y-1">
          <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#5A6B78] flex items-center justify-between">
            <span>{sec.roleTitle}</span>
          </div>
          <div className="space-y-0.5">
            {sec.items.map((item, itemIdx) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  onClick={onNavClick}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#EA580C] text-white shadow-sm shadow-orange-500/20"
                      : "text-[#1F2937] hover:bg-orange-50 hover:text-[#EA580C]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#5A6B78]"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AppShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F2]">
      {/* 5.1 Bilah Atas (Top Bar): Oranye Juara (#EA580C) */}
      <header className="bg-[#EA580C] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Bimbel Langkah Juara */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-orange-700 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-white text-[#EA580C] flex items-center justify-center font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold tracking-tight text-lg leading-tight flex items-center gap-2">
                    Langkah Juara
                    <span className="text-xs bg-orange-700/80 px-2 py-0.5 rounded-full font-medium text-orange-100">
                      Makassar
                    </span>
                  </div>
                  <div className="text-xs text-orange-100 opacity-90">Portal Belajar Terpadu</div>
                </div>
              </Link>
            </div>

            {/* Banner Mode Preview */}
            <div className="hidden md:flex items-center gap-3 bg-orange-700/60 px-3 py-1.5 rounded-lg text-xs text-orange-100 border border-orange-500/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                <strong>Mode Tahap 2:</strong> Semua halaman Bab 4 dapat dibuka bebas tanpa proteksi login
              </span>
            </div>

            {/* Quick Links Header */}
            <div className="flex items-center gap-2">
              <Link
                href="/profil"
                className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-medium transition"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profil Pengguna</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar Navigasi Bab 3 & Bab 5 (Desktop) */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-xl transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none lg:border lg:border-slate-200/80 rounded-2xl flex flex-col p-4 overflow-y-auto max-h-[calc(100vh-6rem)] ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 lg:hidden">
            <span className="font-bold text-[#1F2937]">Navigasi Halaman</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Suspense fallback={<div className="p-4 text-xs text-slate-400">Memuat navigasi...</div>}>
            <SidebarLinks onNavClick={() => setMobileMenuOpen(false)} />
          </Suspense>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="p-3 bg-[#F7F5F2] rounded-xl text-xs text-[#5A6B78]">
              <div className="font-semibold text-[#1F2937] mb-1">Palet Bab 5 PRD</div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[#EA580C]" title="Oranye Juara" />
                <div className="w-4 h-4 rounded bg-[#F7F5F2] border" title="Latar" />
                <div className="w-4 h-4 rounded bg-[#15A66A]" title="Aktif / Dinilai" />
                <div className="w-4 h-4 rounded bg-[#F59E0B]" title="Menunggu" />
                <div className="w-4 h-4 rounded bg-[#E53935]" title="Ditolak / Terlambat" />
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for Mobile */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white py-4 text-center text-xs text-[#5A6B78]">
        <div className="max-w-7xl mx-auto px-4">
          Bimbel Langkah Juara Makassar &bull; Portal Belajar v1.0 &bull; Dibuat sesuai PRD Resmi
        </div>
      </footer>
    </div>
  );
}
