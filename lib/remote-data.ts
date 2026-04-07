import { adminKpis, subjectOverview, usersTable } from "@/lib/mock-data";

const REMOTE_DB_URL = "https://edutrack-base-donne.vercel.app/";

type SchemaSummary = {
  sourceUrl: string;
  sectionCount: number;
  tableCount: number;
  sections: Array<{ code: string; tables: string[] }>;
};

function parseSchemaSummary(html: string): SchemaSummary {
  const sectionMap = new Map<string, string[]>();

  const sectionRegex = /<section class="schema-section" id="sec-([a-z]+)">([\s\S]*?)<\/section>/g;
  let sectionMatch: RegExpExecArray | null = sectionRegex.exec(html);

  while (sectionMatch) {
    const sectionCode = sectionMatch[1];
    const sectionChunk = sectionMatch[2];
    const tableNames = Array.from(
      sectionChunk.matchAll(/data-table="([a-z_]+)"/g),
      (m) => m[1],
    );

    sectionMap.set(sectionCode, tableNames);
    sectionMatch = sectionRegex.exec(html);
  }

  const sections = Array.from(sectionMap.entries()).map(([code, tables]) => ({
    code,
    tables,
  }));

  const tableCount = sections.reduce((sum, section) => sum + section.tables.length, 0);

  return {
    sourceUrl: REMOTE_DB_URL,
    sectionCount: sections.length,
    tableCount,
    sections,
  };
}

export async function getRemoteOrMockDashboardData() {
  try {
    const response = await fetch(REMOTE_DB_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Remote source unavailable: ${response.status}`);
    }

    const html = await response.text();
    const schemaSummary = parseSchemaSummary(html);

    return {
      source: "remote" as const,
      data: {
        kpis: adminKpis,
        users: usersTable,
        subjects: subjectOverview,
        schema: schemaSummary,
      },
    };
  } catch {
    return {
      source: "mock" as const,
      data: {
        kpis: adminKpis,
        users: usersTable,
        subjects: subjectOverview,
        schema: {
          sourceUrl: REMOTE_DB_URL,
          sectionCount: 4,
          tableCount: 24,
          sections: [
            { code: "core", tables: ["utilisateurs", "eleves", "enseignants", "matieres"] },
            { code: "ped", tables: ["seances", "evaluations", "competences", "presences"] },
            { code: "ana", tables: ["indicateurs_eleve", "progression_matiere"] },
            { code: "rep", tables: ["types_rapport", "rapports"] },
          ],
        },
      },
    };
  }
}
