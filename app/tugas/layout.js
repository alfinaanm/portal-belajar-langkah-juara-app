import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Tugas Siswa - Langkah Juara",
};

export default function TugasLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa"]} groupTitle="Siswa (/tugas)">
      {children}
    </RouteGuard>
  );
}
