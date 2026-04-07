"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MoroccanPathCard } from "@/components/moroccan-path-card";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  adminKpis,
  subjectOverview,
  usersTable,
  UserStatus,
} from "@/lib/mock-data";
import { moroccanSchoolPath, roleCapabilities } from "@/lib/morocco-education";

type OverviewPayload = {
  source?: "remote" | "mock";
  data?: {
    schema?: {
      sectionCount: number;
      tableCount: number;
      sections: Array<{ code: string; tables: string[] }>;
    };
  };
};

const adminNav = [
  { label: "Dashboard", href: "#", icon: "dashboard" as const },
  { label: "Eleves", href: "#", icon: "students" as const },
  { label: "Professeurs", href: "#", icon: "teachers" as const },
  { label: "Rapports", href: "#", icon: "reports" as const },
];

const radialData = [{ name: "Predictive", value: adminKpis.predictiveSuccessRate, fill: "#0F4C5C" }];

function statusColor(status: UserStatus) {
  if (status === "Actif") return "bg-emerald-100 text-emerald-700";
  if (status === "En attente") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

export default function AdminDashboardPage() {
  const [source, setSource] = useState("Simulation locale");
  const [schemaStats, setSchemaStats] = useState({ sections: 0, tables: 0 });
  const [schemaGroups, setSchemaGroups] = useState<Array<{ code: string; tables: string[] }>>([]);

  useEffect(() => {
    const loadSource = async () => {
      try {
        const response = await fetch("/api/data/overview", { cache: "no-store" });
        const payload = (await response.json()) as OverviewPayload;
        setSource(payload.source === "remote" ? "Base distante" : "Simulation locale");

        const sectionCount = payload.data?.schema?.sectionCount ?? 0;
        const tableCount = payload.data?.schema?.tableCount ?? 0;
        setSchemaStats({ sections: sectionCount, tables: tableCount });
        setSchemaGroups(payload.data?.schema?.sections ?? []);
      } catch {
        setSource("Simulation locale");
      }
    };

    loadSource();
  }, []);

  return (
    <DashboardLayout title="Dashboard Administrateur" roleBadge="Admin" navItems={adminNav}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="text-slate-500 text-sm">Eleves</p>
          <p className="mt-2 text-2xl font-bold text-petrol-blue-deep">{adminKpis.totalStudents}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="text-slate-500 text-sm">Professeurs</p>
          <p className="mt-2 text-2xl font-bold text-petrol-blue-deep">{adminKpis.totalTeachers}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="text-slate-500 text-sm">Parents Actifs</p>
          <p className="mt-2 text-2xl font-bold text-petrol-blue-deep">{adminKpis.activeParents}</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="text-slate-500 text-sm">Source Donnees</p>
          <p className="mt-2 text-xl font-semibold text-petrol-blue-deep">{source}</p>
        </article>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[340px_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">
            Taux de reussite predictif
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="100%"
                barSize={24}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={14} />
                <Tooltip />
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-petrol-blue-deep text-4xl font-bold">
                  {adminKpis.predictiveSuccessRate}%
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-sm">
                  Estimation IA
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft overflow-hidden">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">
            Gestion des utilisateurs
          </h2>
          <div className="mt-3 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">Nom</th>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {usersTable.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50">
                    <td className="py-2 text-slate-500">{item.id}</td>
                    <td className="py-2 text-slate-800">{item.name}</td>
                    <td className="py-2">{item.role}</td>
                    <td className="py-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs ${statusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">
          Performance par matiere
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectOverview}>
              <XAxis dataKey="subject" stroke="#64748b" />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="mastery" radius={[10, 10, 2, 2]}>
                {subjectOverview.map((entry) => (
                  <Cell key={entry.subject} fill={entry.mastery > 75 ? "#1D9A6C" : "#0F4C5C"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">
            Administration globale
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            L&apos;administrateur controle toutes les fonctionnalites, y compris celles des professeurs et des parents.
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {roleCapabilities.admin.map((capability) => (
              <p key={capability}>- {capability}</p>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Schema distant</p>
            <p className="mt-2 text-sm text-slate-700">
              {schemaStats.sections} schemas detectes - {schemaStats.tables} tables detectees
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {schemaGroups.map((group) => (
                <div key={group.code} className="rounded-lg border border-slate-200 bg-white p-2">
                  <p className="text-xs font-semibold uppercase text-petrol-blue-deep">{group.code}</p>
                  <p className="text-xs text-slate-500 mt-1">{group.tables.length} tables</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">
            Parcours scolaire marocain
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Exemple de structuration des niveaux pour le pilotage pedagogique national.
          </p>
          <div className="mt-4 space-y-3">
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
