"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { mockUsers } from "@/lib/mockData";
import {
  Users,
  Search,
  Filter,
  Shield,
  ArrowRight,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";

export default function KelolaPenggunaPage() {
  const [usersList, setUsersList] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");

  const filteredUsers = usersList.filter((u) => {
    const matchName = u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "semua" || u.role === roleFilter;
    return matchName && matchRole;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
              <Users className="w-3.5 h-3.5" />
              Kelola Pengguna &bull; Bab 4.15 PRD
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Daftar Pengguna Aplikasi</h1>
            <p className="text-sm text-[#5A6B78] mt-1">
              Atur hak akses peran (Siswa, Staf, Tutor, Super Admin) dan status keaktifan akun.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari pengguna berdasarkan nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F5F2] border border-slate-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-[#5A6B78] mr-1 hidden sm:inline">Peran:</span>
            {["semua", "siswa", "staf", "tutor", "super_admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition shrink-0 ${
                  roleFilter === r
                    ? "bg-[#EA580C] text-white shadow-xs"
                    : "bg-[#F7F5F2] text-[#5A6B78] hover:bg-slate-200"
                }`}
              >
                {r.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Pengguna */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F5F2] text-[#5A6B78] text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4 text-center">Status Aktif</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1F2937]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-bold text-[#1F2937]">{u.nama}</td>
                      <td className="py-3.5 px-4 text-xs text-[#5A6B78]">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            u.role === "super_admin"
                              ? "bg-amber-100 text-amber-800"
                              : u.role === "tutor"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "staf"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {u.aktif ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15A66A]">
                            <UserCheck className="w-3.5 h-3.5" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E53935]">
                            <UserX className="w-3.5 h-3.5" />
                            Dinonaktifkan
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/pengguna/${u.uid}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:underline"
                        >
                          Ubah Peran / Status &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#5A6B78]">
                      Tidak ada pengguna yang cocok dengan saringan.
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
