// Status badge helper according to Bab 5.2 PRD
export default function StatusBadge({ status }) {
  const norm = String(status || "").toLowerCase();

  let bg = "bg-slate-100 text-[#6B7280] border-slate-200";
  let label = status || "Belum";

  if (norm === "menunggu" || norm === "dikumpulkan") {
    bg = "bg-amber-50 text-[#F59E0B] border-amber-200 font-semibold";
  } else if (norm === "aktif" || norm === "dinilai") {
    bg = "bg-emerald-50 text-[#15A66A] border-emerald-200 font-semibold";
  } else if (norm === "ditolak" || norm === "terlambat") {
    bg = "bg-red-50 text-[#E53935] border-red-200 font-semibold";
  } else if (norm === "belum dikumpulkan" || norm === "belum") {
    bg = "bg-gray-100 text-[#6B7280] border-gray-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border capitalize ${bg}`}
    >
      {label}
    </span>
  );
}
