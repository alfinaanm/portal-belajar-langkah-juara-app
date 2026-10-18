import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Katalog Program - Langkah Juara",
};

export default function ProgramLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa"]} groupTitle="Siswa (/program)">
      {children}
    </RouteGuard>
  );
}
