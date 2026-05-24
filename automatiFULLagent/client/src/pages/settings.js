import AppShell from "@/components/AppShell";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AppShell title="Settings">
        <div className="rounded-lg border border-line bg-white p-8 text-center text-sm text-slate-500">
          Profile and security settings are ready for expansion.
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
