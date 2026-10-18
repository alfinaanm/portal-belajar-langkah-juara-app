import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Kelas Saya - Langkah Juara",
};

export default function KelasLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa"]} groupTitle="Siswa (/kelas)">
      {children}
    </RouteGuard>
  );
}
