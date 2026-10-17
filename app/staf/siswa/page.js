"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { mockUsers, mockPendaftaran } from "@/lib/mockData";
import {
  Users,
  Search,
  Phone,
  Mail,
  ShieldAlert,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function DataSiswaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const siswaUsers = mockUsers.filter((u) => u.role === "siswa");

  const siswaWithProgram = siswaUsers.map((siswa) => {
    const aktifDaftar = mockPendaftaran.find(
      (p) => p.siswaId === siswa.uid && p.status === "aktif"
    );
    return {
      ...siswa,
      programNama: aktifDaftar ? aktifDaftar.programNama : "Belum ada program aktif",
    };
  });

  const filteredSiswa = siswaWithProgram.filter((s) =>
    s.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            <Users className="w-3.5 h-3.5" />
            Database Siswa &bull; Bab 4.10 PRD
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Data Siswa & Kontak Orang Tua</h1>
          <p className="text-sm text-[#5A6B78] mt-1">
            Daftar siswa bimbingan belajar beserta kontak darurat orang tua untuk konfirmasi kehadiran atau kendala belajar.
          </p>
        </div>

        {/* Validasi Hak Akses Bab 4.10 */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-[#5A6B78]">
          <ShieldAlert className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
          <div>
            <strong>Ketentuan PRD Bab 4.10:</strong> Halaman ini berstatus <em>hanya untuk membaca</em>. Staf administrasi <strong>tidak bisa</strong> melihat atau mengubah nilai siswa di halaman mana pun.
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari siswa berdasarkan nama (misal: Salsa, Raka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F5F2] border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
            />
          </div>
          <span className="text-xs text-[#5A6B78] hidden sm:inline">
            Total: <strong>{filteredSiswa.length}</strong> siswa
          </span>
        </div>

        {/* Tabel Data Siswa */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Nomor HP Siswa</th>
                  <th className="py-3 px-4">Nomor HP Orang Tua</th>
                  <th className="py-3 px-4">Program Aktif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1F2937]">
                {filteredSiswa.length > 0 ? (
                  filteredSiswa.map((s) => (
                    <tr key={s.uid} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-[#1F2937]">{s.nama}</td>
                      <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{s.email}</td>
                      <td className="py-3.5 px-4 text-xs tabular-nums">{s.noHp || "-"}</td>
                      <td className="py-3.5 px-4 text-xs tabular-nums font-semibold text-[#EA580C]">
                        {s.noHpOrangTua ? (
                          <a
                            href={`https://wa.me/${s.noHpOrangTua.replace(/^0/, "62")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {s.noHpOrangTua}
                          </a>
                        ) : (
                          <span className="text-slate-400 font-normal">Belum diisi</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-emerald-800">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                          {s.programNama}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#5A6B78]">
                      Tidak ditemukan siswa dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
