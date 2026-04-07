export type ProgressTrend = {
  trend: "up" | "down" | "stable";
  deltaPercent: number;
};

export function calculateProgressTrend(history: number[]): ProgressTrend {
  if (history.length < 2) {
    return { trend: "stable", deltaPercent: 0 };
  }

  const first = history[0];
  const last = history[history.length - 1];
  if (first === 0) {
    return { trend: "stable", deltaPercent: 0 };
  }

  const delta = ((last - first) / first) * 100;

  if (delta > 2) {
    return { trend: "up", deltaPercent: Number(delta.toFixed(1)) };
  }

  if (delta < -2) {
    return { trend: "down", deltaPercent: Number(delta.toFixed(1)) };
  }

  return { trend: "stable", deltaPercent: Number(delta.toFixed(1)) };
}

export function generateSmartTeacherNote(rawNote: string): string {
  const normalized = rawNote.trim();
  if (!normalized) {
    return "Aucune observation fournie. Merci d'ajouter un commentaire pour generer une note professionnelle.";
  }

  return `Observation pedagogique: ${normalized}. L'eleve montre une dynamique de progression encourageante. Il est recommande de maintenir un suivi hebdomadaire cible sur les competences prioritaires.`;
}

export function generateParentReport(
  childName: string,
  subject: string,
  trendPercent: number,
): string {
  const direction = trendPercent >= 0 ? "progresse" : "a une legere baisse";
  const magnitude = Math.abs(trendPercent);

  return `Felicitations ! ${childName} ${direction} de ${magnitude}% en ${subject} cette semaine. Continuez a encourager les revisions courtes et regulieres pour consolider les acquis.`;
}
