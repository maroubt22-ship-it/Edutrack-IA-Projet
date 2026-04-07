"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MoroccanPathCard } from "@/components/moroccan-path-card";
import { DashboardLayout } from "@/components/dashboard-layout";
import { parentProgressLine, supportSchedule, studentScoreHistory } from "@/lib/mock-data";
import { calculateProgressTrend, generateParentReport } from "@/lib/ai";
import { moroccanSchoolPath, roleCapabilities } from "@/lib/morocco-education";

const parentNav = [
  { label: "Dashboard", href: "#", icon: "dashboard" as const },
  { label: "Progression", href: "#", icon: "reports" as const },
  { label: "Seances", href: "#", icon: "students" as const },
  { label: "Alertes", href: "#", icon: "teachers" as const },
];

export default function ParentsDashboardPage() {
  const trend = calculateProgressTrend(studentScoreHistory);
  const report = generateParentReport("Sara", "mathematiques", trend.deltaPercent);

  return (
    <DashboardLayout title="Dashboard Parents" roleBadge="Parents" navItems={parentNav}>
      <article className="rounded-2xl border border-slate-100 bg-gradient-to-br from-petrol-blue to-petrol-blue-deep p-5 text-white shadow-glass">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Rapport de progression IA</p>
        <p className="mt-3 text-balance text-lg leading-7">{report}</p>
      </article>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Evolution des notes</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tendance actuelle: <span className="font-semibold">{trend.trend}</span> ({trend.deltaPercent}%)
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={parentProgressLine}>
                <CartesianGrid strokeDasharray="4 4" stroke="#dbe9ed" />
                <XAxis dataKey="week" stroke="#64748b" />
                <YAxis domain={[55, 90]} stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="math" stroke="#0F4C5C" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="french" stroke="#0092C7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Calendrier des seances</h2>
          <div className="mt-3 space-y-3">
            {supportSchedule.map((slot) => (
              <div key={slot.day} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-semibold text-petrol-blue-deep">{slot.day}</p>
                <p className="text-sm text-slate-600">{slot.slot}</p>
                <p className="text-sm text-slate-700 mt-1">{slot.course}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Fonctionnalites parents</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {roleCapabilities.parent.map((capability) => (
              <p key={capability}>- {capability}</p>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Parcours scolaire de l&apos;enfant</h2>
          <p className="mt-1 text-sm text-slate-600">Exemple Maroc: College (2AC) avec orientation vers lycee qualifiant.</p>
          <div className="mt-3 space-y-3">
            {moroccanSchoolPath.map((cycle) => (
              <div key={cycle.key} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-semibold text-petrol-blue-deep">{cycle.title}</p>
                <p className="text-xs text-slate-500 mt-1">{cycle.levels.join(" • ")}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {moroccanSchoolPath.map((cycle) => (
          <MoroccanPathCard key={cycle.key} cycle={cycle} />
        ))}
      </div>
    </DashboardLayout>
  );
}
