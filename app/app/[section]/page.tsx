import { notFound } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { RecordForm } from "@/components/record-form";
import { canWriteModule, getModule } from "@/lib/modules";
import { requireSessionContext } from "@/lib/auth";

export default async function ModulePage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const moduleConfig = getModule(section);
  if (!moduleConfig) notFound();

  const { supabase, membership } = await requireSessionContext();
  const { data, error } = await supabase
    .from(moduleConfig.table)
    .select("*")
    .eq("sanctuary_id", membership.sanctuary_id)
    .order(moduleConfig.orderBy, { ascending: true, nullsFirst: false })
    .limit(100);

  if (error) throw new Error(error.message);
  const canWrite = canWriteModule(membership.role, moduleConfig);

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Sanctuary module" title={moduleConfig.title} description={moduleConfig.description} />
      {canWrite ? <RecordForm module={moduleConfig} /> : null}
      <DataTable module={moduleConfig} records={(data ?? []) as Array<Record<string, unknown>>} />
    </div>
  );
}
