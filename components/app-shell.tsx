import Link from "next/link";
import { redirect } from "next/navigation";
import { Leaf, LogOut, Search } from "lucide-react";
import { signOut } from "@/app/app/actions/auth";
import { roleLabels, type SessionContext } from "@/lib/auth";
import { modules, settingsModule } from "@/lib/modules";
import { cn } from "@/lib/utils";

export function AppShell({
  context,
  active,
  children
}: {
  context: SessionContext;
  active?: string;
  children: React.ReactNode;
}) {
  const sanctuary = context.membership.sanctuaries;
  if (!sanctuary) redirect("/login");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-stone-200/80 bg-white/80 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-meadow-bark text-white shadow-soft">
              <Leaf className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-lg font-bold text-meadow-bark">Meadow</p>
              <p className="text-xs font-medium text-stone-500">{sanctuary.name}</p>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-meadow-mist px-3 py-2 text-sm text-stone-500">
              <Search className="h-4 w-4" aria-hidden />
              <span>Search sanctuary</span>
            </div>
          </div>

          <nav className="grid gap-1 px-3 pb-4 text-sm lg:flex-1 lg:overflow-y-auto">
            <NavLink href="/app" active={active === "dashboard"} label="Today" icon={Leaf} />
            {modules.map((module) => (
              <NavLink
                key={module.key}
                href={`/app/${module.key}`}
                active={active === module.key}
                label={module.title}
                icon={module.icon}
              />
            ))}
            <NavLink
              href="/app/settings"
              active={active === "settings"}
              label={settingsModule.title}
              icon={settingsModule.icon}
            />
          </nav>

          <div className="border-t border-stone-200 p-4">
            <div className="mb-3 rounded-md bg-meadow-mist p-3">
              <p className="text-sm font-semibold text-stone-900">
                {context.membership.display_name ?? context.user.email}
              </p>
              <p className="text-xs text-stone-500">{roleLabels[context.membership.role]}</p>
            </div>
            <form action={signOut}>
              <button className="button-secondary w-full" type="submit">
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  active,
  label,
  icon: Icon
}: {
  href: string;
  active: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 font-medium transition",
        active
          ? "bg-meadow-bark text-white shadow-soft"
          : "text-stone-700 hover:bg-meadow-mist hover:text-meadow-bark"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </Link>
  );
}
