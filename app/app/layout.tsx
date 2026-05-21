import { AppShell } from "@/components/app-shell";
import { requireSessionContext } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const context = await requireSessionContext();

  return <AppShell context={context}>{children}</AppShell>;
}
