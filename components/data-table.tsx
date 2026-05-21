import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ModuleConfig } from "@/lib/modules";
import { formatDate, formatDateTime, titleCase } from "@/lib/utils";

export function DataTable({
  module,
  records
}: {
  module: ModuleConfig;
  records: Array<Record<string, unknown>>;
}) {
  if (records.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-stone-300 bg-white/70 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-stone-900">No {module.title.toLowerCase()} yet</p>
        <p className="mt-2 text-sm text-stone-500">Create the first record to start building the sanctuary picture.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-stone-200 bg-white/85 shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-meadow-mist text-left text-xs font-bold uppercase tracking-wide text-stone-500">
            <tr>
              {module.columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3">
                  {titleCase(column)}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {records.map((record) => (
              <tr key={String(record.id)} className="hover:bg-meadow-mist/60">
                {module.columns.map((column) => (
                  <td key={column} className="max-w-[18rem] truncate px-4 py-3 text-stone-800">
                    {formatCell(record[column], column)}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <Link className="inline-flex text-meadow-bark hover:text-meadow-soil" href={`/app/${module.key}/${record.id}`}>
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Open</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatCell(value: unknown, column: string) {
  if (value === null || value === undefined || value === "") return "Not set";
  if (column.endsWith("_at")) return formatDateTime(String(value));
  if (column.endsWith("_on") || column.endsWith("_date")) return formatDate(String(value));
  if (typeof value === "number") return new Intl.NumberFormat("en-GB").format(value);
  return String(value).replace(/_/g, " ");
}
