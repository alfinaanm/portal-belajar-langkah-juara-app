import RouteGuard from "@/components/RouteGuard";

export const metadata = {
  title: "Modul Tutor Pengajar - Langkah Juara",
};

export default function TutorLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["tutor"]} groupTitle="Tenaga Ahli (/tutor)">
      {children}
    </RouteGuard>
  );
}
