"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { canWriteModule, getModule } from "@/lib/modules";
import { requireSessionContext } from "@/lib/auth";

const idSchema = z.string().uuid();

function parseValue(value: FormDataEntryValue | null, type: string) {
  if (value === null || value === "") return null;
  const text = String(value);
  if (type === "number") return Number(text);
  if (type === "datetime-local") return new Date(text).toISOString();
  return text;
}

export async function createRecord(section: string, formData: FormData) {
  const moduleConfig = getModule(section);
  if (!moduleConfig) throw new Error("Unknown module.");

  const { supabase, membership, user } = await requireSessionContext();
  if (!canWriteModule(membership.role, moduleConfig)) throw new Error("You do not have permission to create this record.");

  const payload: Record<string, unknown> = {
    sanctuary_id: membership.sanctuary_id
  };

  for (const field of moduleConfig.fields) {
    const value = parseValue(formData.get(field.name), field.type);
    if (field.required && !value) {
      throw new Error(`${field.label} is required.`);
    }
    payload[field.name] = value;
  }

  const { data, error } = await supabase.from(moduleConfig.table).insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  await supabase.from("activity_logs").insert({
    sanctuary_id: membership.sanctuary_id,
    actor_id: user.id,
    action: "created",
    entity_type: moduleConfig.table,
    entity_id: data.id,
    metadata: { primary: payload[moduleConfig.primary] ?? null }
  });

  revalidatePath(`/app/${section}`);
  redirect(`/app/${section}/${data.id}`);
}

export async function updateRecord(section: string, id: string, formData: FormData) {
  const moduleConfig = getModule(section);
  if (!moduleConfig) throw new Error("Unknown module.");

  const recordId = idSchema.parse(id);
  const { supabase, membership, user } = await requireSessionContext();
  if (!canWriteModule(membership.role, moduleConfig)) throw new Error("You do not have permission to update this record.");

  const payload: Record<string, unknown> = {};
  for (const field of moduleConfig.fields) {
    payload[field.name] = parseValue(formData.get(field.name), field.type);
  }

  const { error } = await supabase
    .from(moduleConfig.table)
    .update(payload)
    .eq("id", recordId)
    .eq("sanctuary_id", membership.sanctuary_id);

  if (error) throw new Error(error.message);

  await supabase.from("activity_logs").insert({
    sanctuary_id: membership.sanctuary_id,
    actor_id: user.id,
    action: "updated",
    entity_type: moduleConfig.table,
    entity_id: recordId,
    metadata: { primary: payload[moduleConfig.primary] ?? null }
  });

  revalidatePath(`/app/${section}`);
  revalidatePath(`/app/${section}/${recordId}`);
}
