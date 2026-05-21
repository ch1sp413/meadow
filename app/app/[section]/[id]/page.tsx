import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { RecordForm } from "@/components/record-form";
import { canWriteModule, getModule } from "@/lib/modules";
import { requireSessionContext } from "@/lib/auth";

export default async function DetailPage({
  params
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section, id } = await params;
  const moduleConfig = getModule(section);
  if (!moduleConfig) notFound();

  const { supabase, membership } = await requireSessionContext();
  const { data, error } = await supabase
    .from(moduleConfig.table)
    .select("*")
    .eq("id", id)
    .eq("sanctuary_id", membership.sanctuary_id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();

  const record = data as Record<string, unknown>;
  const canWrite = canWriteModule(membership.role, moduleConfig);

  return (
    <div className="grid gap-6">
      <Link href={`/app/${moduleConfig.key}`} className="button-secondary w-fit">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to {moduleConfig.title.toLowerCase()}
      </Link>
      <PageHeader
        eyebrow={moduleConfig.singular}
        title={String(record[moduleConfig.primary] ?? moduleConfig.singular)}
        description={canWrite ? "Review and update this record." : "You have read-only access to this record."}
      />
      <RecordForm module={moduleConfig} values={record} recordId={id} disabled={!canWrite} />
    </div>
  );
}
