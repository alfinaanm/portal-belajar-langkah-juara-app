import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Beranda Siswa - Langkah Juara",
};

export default function BerandaLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa"]} groupTitle="Siswa (/beranda)">
      {children}
    </RouteGuard>
  );
}
