import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Modul Staf Administrasi - Langkah Juara",
};

export default function StafLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["staf"]} groupTitle="Staf Depan (/staf)">
      {children}
    </RouteGuard>
  );
}
