import { Save } from "lucide-react";
import { createRecord, updateRecord } from "@/app/app/actions/records";
import type { ModuleConfig } from "@/lib/modules";

export function RecordForm({
  module,
  values,
  recordId,
  disabled = false
}: {
  module: ModuleConfig;
  values?: Record<string, unknown>;
  recordId?: string;
  disabled?: boolean;
}) {
  const action = recordId
    ? updateRecord.bind(null, module.key, recordId)
    : createRecord.bind(null, module.key);

  return (
    <form action={action} className="grid gap-4 rounded-md border border-stone-200 bg-white/85 p-4 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        {module.fields.map((field) => (
          <label key={field.name} className={field.type === "textarea" ? "grid gap-1 md:col-span-2" : "grid gap-1"}>
            <span className="label">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                className="field min-h-28 resize-y"
                name={field.name}
                required={field.required}
                defaultValue={String(values?.[field.name] ?? "")}
                disabled={disabled}
              />
            ) : field.type === "select" ? (
              <select
                className="field"
                name={field.name}
                required={field.required}
                defaultValue={String(values?.[field.name] ?? "")}
                disabled={disabled}
              >
                <option value="">Select</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="field"
                name={field.name}
                type={field.type}
                required={field.required}
                defaultValue={normaliseInputValue(values?.[field.name], field.type)}
                disabled={disabled}
              />
            )}
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <button className="button-primary" type="submit" disabled={disabled}>
          <Save className="h-4 w-4" aria-hidden />
          {recordId ? "Save changes" : `Create ${module.singular.toLowerCase()}`}
        </button>
      </div>
    </form>
  );
}

function normaliseInputValue(value: unknown, type: string) {
  if (!value) return "";
  const text = String(value);
  if (type === "date") return text.slice(0, 10);
  if (type === "datetime-local") return text.slice(0, 16);
  return text;
}
