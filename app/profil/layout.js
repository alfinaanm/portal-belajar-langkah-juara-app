import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Profil Pengguna - Langkah Juara",
};

export default function ProfilLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa", "staf", "tutor", "super_admin"]} groupTitle="Profil Pengguna">
      {children}
    </RouteGuard>
  );
}
