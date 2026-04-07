import Link from "next/link";
import { ReactNode } from "react";
import { BarChart3, BookOpen, Home, LogOut, Users } from "lucide-react";

type SidebarItem = {
  label: string;
  href: string;
  icon: "dashboard" | "students" | "teachers" | "reports";
};

type DashboardLayoutProps = {
  title: string;
  roleBadge: string;
  children: ReactNode;
  navItems?: SidebarItem[];
};

const defaultItems: SidebarItem[] = [
  { label: "Dashboard", href: "#", icon: "dashboard" },
  { label: "Eleves", href: "#", icon: "students" },
  { label: "Professeurs", href: "#", icon: "teachers" },
  { label: "Rapports", href: "#", icon: "reports" },
];

function pickIcon(kind: SidebarItem["icon"]) {
  if (kind === "dashboard") return <Home size={18} />;
  if (kind === "students") return <BookOpen size={18} />;
  if (kind === "teachers") return <Users size={18} />;
  return <BarChart3 size={18} />;
}

export function DashboardLayout({
  title,
  roleBadge,
  children,
  navItems = defaultItems,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-sky-mist bg-hero-mesh">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 p-4 md:p-6">
        <aside className="rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl shadow-soft p-5 h-fit lg:sticky lg:top-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">EduTrack</p>
          <h2 className="mt-2 text-2xl font-bold text-petrol-blue-deep">{roleBadge}</h2>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 hover:bg-petrol-blue-soft/70 transition-colors"
              >
                {pickIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-petrol-blue/25 bg-white px-4 py-2 text-petrol-blue-deep hover:border-petrol-blue/60 hover:shadow-glass transition"
          >
            <LogOut size={16} />
            Deconnexion
          </Link>
        </aside>

        <section className="rounded-3xl border border-white/75 bg-white/80 backdrop-blur-xl shadow-soft p-4 md:p-6 lg:p-8">
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-petrol-blue-deep">{title}</h1>
            <p className="text-slate-600 mt-1">
              Pilotage intelligent, visualisation claire et decisions pedagogiques appuyees par les donnees.
            </p>
          </header>
          {children}
        </section>
      </div>
    </div>
  );
}
