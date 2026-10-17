"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, ArrowRight, ShieldCheck, Mail, Lock, User } from "lucide-react";

export default function DaftarPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama || !email || !password) {
      setInfo("Semua kolom bertanda bintang (*) wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setInfo("Kata sandi minimal 6 karakter.");
      return;
    }
    setInfo("Pendaftaran berhasil! Dalam sistem nyata, akun otomatis dibuat dengan role 'siswa' dan diarahkan ke /beranda.");
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center font-bold text-2xl shadow-md transition-transform group-hover:scale-105">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
          Daftar Akun Siswa Baru
        </h2>
        <p className="mt-2 text-sm text-[#5A6B78]">
          Portal Belajar Langkah Juara Makassar (PRD 4.1)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-3xl border border-slate-200/80 sm:px-10">
          {info && (
            <div className="mb-5 p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-[#EA580C] font-medium leading-relaxed">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                Nama Lengkap *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Contoh: Salsa Billah"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1.5">
                Kata Sandi * (Minimal 6 karakter)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-[#EA580C] hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EA580C] transition"
            >
              Daftar Sekarang
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#5A6B78]">Atau</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setInfo("Dalam sistem nyata, Masuk dengan Google otomatis membuat profil siswa.")}
                className="w-full inline-flex justify-center items-center gap-3 py-2.5 px-4 border border-slate-200 rounded-xl shadow-xs bg-white text-sm font-semibold text-[#1F2937] hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Masuk dengan Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#5A6B78]">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-semibold text-[#EA580C] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-[#5A6B78] hover:text-[#EA580C]">
            &larr; Kembali ke Direktori Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
