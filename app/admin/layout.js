import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Modul Super Admin - Langkah Juara",
};

export default function AdminLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["super_admin"]} groupTitle="Super Admin (/admin)">
      {children}
    </RouteGuard>
  );
}
