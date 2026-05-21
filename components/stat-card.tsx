import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "moss"
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "moss" | "clay" | "soil";
}) {
  const tones = {
    moss: "bg-meadow-moss",
    clay: "bg-meadow-clay",
    soil: "bg-meadow-soil"
  };

  return (
    <div className="rounded-md border border-stone-200 bg-white/85 p-4 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-meadow-bark">{value}</p>
        </div>
        <div className={`${tones[tone]} flex h-11 w-11 items-center justify-center rounded-md text-white`}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}
