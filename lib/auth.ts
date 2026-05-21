import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/supabase/database.types";

export const roleLabels: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  care_lead: "Care lead",
  vet: "Vet",
  volunteer: "Volunteer",
  fundraising: "Fundraising",
  viewer: "Viewer"
};

export const roleRank: Record<Role, number> = {
  owner: 100,
  admin: 90,
  care_lead: 70,
  vet: 60,
  fundraising: 55,
  volunteer: 40,
  viewer: 10
};

export type SessionContext = {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  user: { id: string; email?: string };
  membership: {
    id: string;
    sanctuary_id: string;
    user_id: string;
    role: Role;
    display_name: string | null;
    active: boolean;
    sanctuaries: {
      id: string;
      name: string;
      slug: string;
      region: string;
      timezone: string;
    } | null;
  };
};

export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: membership, error } = await supabase
    .from("sanctuary_members")
    .select("id,sanctuary_id,user_id,role,display_name,active,sanctuaries(id,name,slug,region,timezone)")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !membership) return null;

  const rawMembership = membership as unknown as Omit<SessionContext["membership"], "sanctuaries"> & {
    sanctuaries: SessionContext["membership"]["sanctuaries"] | SessionContext["membership"]["sanctuaries"][];
  };
  const sanctuary = Array.isArray(rawMembership.sanctuaries)
    ? rawMembership.sanctuaries[0] ?? null
    : rawMembership.sanctuaries;

  return {
    supabase,
    user: { id: user.id, email: user.email ?? undefined },
    membership: {
      ...rawMembership,
      sanctuaries: sanctuary
    }
  };
}

export async function requireSessionContext() {
  const context = await getSessionContext();
  if (!context) redirect("/login");
  return context;
}

export function canManage(role: Role, minimum: Role = "admin") {
  return roleRank[role] >= roleRank[minimum];
}

export function canEditClinical(role: Role) {
  return ["owner", "admin", "care_lead", "vet"].includes(role);
}

export function canEditFundraising(role: Role) {
  return ["owner", "admin", "fundraising"].includes(role);
}
