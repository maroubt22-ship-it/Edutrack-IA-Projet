import { MoroccanCycle } from "@/lib/morocco-education";

type MoroccanPathCardProps = {
  cycle: MoroccanCycle;
};

export function MoroccanPathCard({ cycle }: MoroccanPathCardProps) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{cycle.ageRange}</p>
      <h3 className="mt-1 font-display text-lg font-semibold text-petrol-blue-deep">{cycle.title}</h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {cycle.levels.map((level) => (
          <span key={level} className="rounded-full bg-petrol-blue-soft px-2 py-1 text-xs text-petrol-blue-deep">
            {level}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {cycle.goals.map((goal) => (
          <li key={goal}>- {goal}</li>
        ))}
      </ul>
    </article>
  );
}
