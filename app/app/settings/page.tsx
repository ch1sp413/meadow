import { ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { roleLabels } from "@/lib/auth";
import { requireSessionContext } from "@/lib/auth";

export default async function SettingsPage() {
  const { supabase, membership, user } = await requireSessionContext();

  const { data: members, error } = await supabase
    .from("sanctuary_members")
    .select("id,display_name,role,active,created_at,user_id")
    .eq("sanctuary_id", membership.sanctuary_id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Sanctuary settings"
        title={membership.sanctuaries?.name ?? "Settings"}
        description="Membership, role visibility, and security posture for this sanctuary."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-white/85 p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-meadow-bark">
            <ShieldCheck className="h-5 w-5" aria-hidden />
            <h2 className="font-bold">Access model</h2>
          </div>
          <p className="text-sm leading-6 text-stone-600">
            Sanctuary data is scoped by membership and enforced in Postgres Row Level Security. Owners and admins can
            invite staff through Supabase email workflows.
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white/85 p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-2 text-meadow-bark">
            <Users className="h-5 w-5" aria-hidden />
            <h2 className="font-bold">Current user</h2>
          </div>
          <p className="text-sm text-stone-700">{membership.display_name ?? user.email}</p>
          <p className="mt-1 text-sm text-stone-500">{roleLabels[membership.role]}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-stone-200 bg-white/85 shadow-soft">
        <div className="border-b border-stone-200 px-4 py-3">
          <h2 className="font-bold text-meadow-bark">Team members</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {members?.map((member) => (
            <div key={member.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-stone-900">{member.display_name ?? member.user_id}</p>
                <p className="text-sm text-stone-500">{roleLabels[member.role as keyof typeof roleLabels]}</p>
              </div>
              <span className="text-sm font-medium text-stone-500">{member.active ? "Active" : "Inactive"}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
