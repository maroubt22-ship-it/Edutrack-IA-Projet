"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { MoroccanPathCard } from "@/components/moroccan-path-card";
import { DashboardLayout } from "@/components/dashboard-layout";
import { studentRiskAlerts } from "@/lib/mock-data";
import { moroccanSchoolPath, moroccanStreams, roleCapabilities } from "@/lib/morocco-education";

type SkillState = "Maitrisee" | "En cours" | "A renforcer";

type SkillRecord = {
  id: string;
  skill: string;
  status: SkillState;
};

const initialSkills: SkillRecord[] = [
  { id: "SK-01", skill: "Resolution de problemes", status: "En cours" },
  { id: "SK-02", skill: "Expression ecrite", status: "A renforcer" },
  { id: "SK-03", skill: "Calcul mental", status: "Maitrisee" },
  { id: "SK-04", skill: "Comprendre un texte", status: "En cours" },
];

const statuses: SkillState[] = ["Maitrisee", "En cours", "A renforcer"];

const teacherNav = [
  { label: "Dashboard", href: "#", icon: "dashboard" as const },
  { label: "Eleves", href: "#", icon: "students" as const },
  { label: "Seances", href: "#", icon: "teachers" as const },
  { label: "Evaluations", href: "#", icon: "reports" as const },
];

function statusClass(status: SkillState) {
  if (status === "Maitrisee") return "bg-emerald-100 text-emerald-700";
  if (status === "En cours") return "bg-sky-100 text-sky-700";
  return "bg-amber-100 text-amber-700";
}

export default function TeacherDashboardPage() {
  const [skills, setSkills] = useState(initialSkills);
  const [rawNote, setRawNote] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const masteryScore = useMemo(() => {
    const mastered = skills.filter((s) => s.status === "Maitrisee").length;
    return Math.round((mastered / skills.length) * 100);
  }, [skills]);

  const updateSkill = (id: string, status: SkillState) => {
    setSkills((prev) => prev.map((skill) => (skill.id === id ? { ...skill, status } : skill)));
  };

  const generateSmartNote = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/smart-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawNote }),
      });
      const data = await response.json();
      setGeneratedNote(data.text ?? "Aucune suggestion disponible.");
    } catch {
      setGeneratedNote("Generation temporairement indisponible.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard Enseignant" roleBadge="Enseignant" navItems={teacherNav}>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Suivi des competences</h2>
          <p className="mt-1 text-sm text-slate-600">Niveau de maitrise global: {masteryScore}%</p>

          <div className="mt-4 space-y-3">
            {skills.map((record) => (
              <div key={record.id} className="rounded-xl border border-slate-100 p-3">
                <p className="font-medium text-slate-800">{record.skill}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateSkill(record.id, status)}
                      className={`rounded-full px-3 py-1 text-xs transition ${
                        record.status === status
                          ? statusClass(status)
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Alertes decrochage</h2>
          <div className="mt-4 space-y-3">
            {studentRiskAlerts.map((alert) => (
              <div key={alert.student} className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle size={16} />
                  <p className="font-semibold">{alert.level}</p>
                </div>
                <p className="mt-1 text-sm text-slate-700">{alert.student}</p>
                <p className="text-xs text-slate-500">{alert.reason}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Smart Note</h2>
        <p className="text-sm text-slate-600 mt-1">Transformez vos notes brutes en formulation professionnelle.</p>
        <textarea
          value={rawNote}
          onChange={(event) => setRawNote(event.target.value)}
          rows={4}
          placeholder="Exemple: eleve motive mais manque de rigueur dans la methode..."
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-petrol-blue"
        />

        <button
          type="button"
          onClick={generateSmartNote}
          disabled={isGenerating}
          className="ai-button mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium disabled:opacity-60"
        >
          <Sparkles size={16} />
          {isGenerating ? "Generation..." : "Generer via IA"}
        </button>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 min-h-16">
          {generatedNote || "Le resultat IA apparaitra ici."}
        </div>
      </article>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Fonctionnalites enseignant</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {roleCapabilities.teacher.map((capability) => (
              <p key={capability}>- {capability}</p>
            ))}
          </div>

          <h3 className="mt-5 text-sm font-semibold text-petrol-blue-deep">Filieres lycee (Maroc)</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {moroccanStreams.map((stream) => (
              <span key={stream} className="rounded-full bg-petrol-blue-soft px-2 py-1 text-xs text-petrol-blue-deep">
                {stream}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-petrol-blue-deep">Parcours scolaire marocain</h2>
          <p className="mt-1 text-sm text-slate-600">Repere de progression pour adapter les seances et evaluations.</p>
          <div className="mt-3 space-y-3">
            {moroccanSchoolPath.map((cycle) => (
              <div key={cycle.key} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="font-semibold text-petrol-blue-deep">{cycle.title}</p>
                <p className="mt-1 text-xs text-slate-500">{cycle.ageRange}</p>
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
