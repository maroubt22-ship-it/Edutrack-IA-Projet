export type MoroccanCycle = {
  key: string;
  title: string;
  ageRange: string;
  levels: string[];
  goals: string[];
};

export const moroccanSchoolPath: MoroccanCycle[] = [
  {
    key: "primaire",
    title: "Primaire",
    ageRange: "6-12 ans",
    levels: ["1AEP", "2AEP", "3AEP", "4AEP", "5AEP", "6AEP"],
    goals: [
      "Lire, ecrire et raisonner",
      "Bases mathematiques et scientifiques",
      "Developper l'autonomie et la methodologie",
    ],
  },
  {
    key: "college",
    title: "College",
    ageRange: "12-15 ans",
    levels: ["1AC", "2AC", "3AC"],
    goals: [
      "Consolider les fondamentaux",
      "Preparation au brevet et orientation",
      "Developper les competences transversales",
    ],
  },
  {
    key: "lycee",
    title: "Lycee qualifiant",
    ageRange: "15-18 ans",
    levels: ["TC", "1BAC", "2BAC"],
    goals: [
      "Specialisation progressive par filiere",
      "Preparation intensive au baccalaureat",
      "Orientation post-bac (universite, CPGE, OFPPT)",
    ],
  },
];

export const moroccanStreams = [
  "Sciences mathematiques",
  "Sciences physiques",
  "Sciences de la vie et de la terre",
  "Sciences economiques",
  "Lettres et sciences humaines",
  "Sciences et technologies electriques/mecaniques",
];

export const roleCapabilities = {
  admin: [
    "Gestion des centres, classes, niveaux et matieres",
    "Gestion complete des utilisateurs et des roles",
    "Suivi global des seances, evaluations et rapports",
    "Pilotage des indicateurs de performance et alertes",
    "Configuration des parametres systeme",
  ],
  teacher: [
    "Planification des seances par niveau et matiere",
    "Saisie des presences et evaluations",
    "Suivi des competences et observations",
    "Generation de notes pedagogiques assistees par IA",
  ],
  parent: [
    "Visualisation de la progression hebdomadaire",
    "Suivi des absences et alertes de risque",
    "Consultation de l'emploi du temps",
    "Lecture des rapports de progression IA",
  ],
};
