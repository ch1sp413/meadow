import { ClipboardCheck, HeartPulse, PackageOpen, PawPrint } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { requireSessionContext } from "@/lib/auth";
import { compactNumber, formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const { supabase, membership } = await requireSessionContext();
  const sanctuaryId = membership.sanctuary_id;

  const [animals, care, medical, inventory, activity] = await Promise.all([
    supabase.from("animals").select("id", { count: "exact", head: true }).eq("sanctuary_id", sanctuaryId),
    supabase
      .from("care_tasks")
      .select("id,title,due_at,status")
      .eq("sanctuary_id", sanctuaryId)
      .neq("status", "done")
      .order("due_at", { ascending: true })
      .limit(6),
    supabase
      .from("medical_records")
      .select("id", { count: "exact", head: true })
      .eq("sanctuary_id", sanctuaryId),
    supabase
      .from("inventory_items")
      .select("id,name,quantity,reorder_level,unit")
      .eq("sanctuary_id", sanctuaryId)
      .not("reorder_level", "is", null)
      .limit(8),
    supabase
      .from("activity_logs")
      .select("id,action,entity_type,created_at")
      .eq("sanctuary_id", sanctuaryId)
      .order("created_at", { ascending: false })
      .limit(6)
  ]);

  const lowStock =
    inventory.data?.filter((item) => Number(item.quantity ?? 0) <= Number(item.reorder_level ?? 0)).length ?? 0;

  return (
    <div>
      <PageHeader
        eyebrow="Today"
        title={`${membership.sanctuaries?.name ?? "Sanctuary"} operations`}
        description="A working view of care, clinical attention, supplies, and the latest changes across the sanctuary."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Animals" value={compactNumber(animals.count)} icon={PawPrint} />
        <StatCard label="Open care tasks" value={care.data?.length ?? 0} icon={ClipboardCheck} tone="clay" />
        <StatCard label="Medical records" value={compactNumber(medical.count)} icon={HeartPulse} tone="soil" />
        <StatCard label="Low stock" value={lowStock} icon={PackageOpen} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Priority care">
          <div className="grid gap-3">
            {care.data?.length ? (
              care.data.map((task) => (
                <div key={task.id} className="rounded-md border border-stone-200 bg-white/80 p-3">
                  <p className="font-semibold text-stone-900">{task.title}</p>
                  <p className="mt-1 text-sm text-stone-500">{task.status} · {formatDateTime(task.due_at as string)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500">No open care tasks.</p>
            )}
          </div>
        </Panel>

        <Panel title="Recent activity">
          <div className="grid gap-3">
            {activity.data?.length ? (
              activity.data.map((item) => (
                <div key={item.id} className="rounded-md border border-stone-200 bg-white/80 p-3">
                  <p className="font-semibold text-stone-900">{item.action} {String(item.entity_type).replace(/_/g, " ")}</p>
                  <p className="mt-1 text-sm text-stone-500">{formatDateTime(item.created_at as string)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500">Activity will appear as records change.</p>
            )}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-stone-200 bg-white/75 p-4 shadow-soft">
      <h2 className="mb-4 text-lg font-bold text-meadow-bark">{title}</h2>
      {children}
    </section>
  );
}
