export type SubjectProgress = {
  subject: string;
  mastery: number;
};

export type UserStatus = "Actif" | "En attente" | "Suspendu";

export const adminKpis = {
  totalStudents: 132,
  totalTeachers: 18,
  activeParents: 109,
  predictiveSuccessRate: 82,
};

export const usersTable: Array<{
  id: string;
  name: string;
  role: "Eleve" | "Professeur" | "Parent";
  status: UserStatus;
}> = [
  { id: "USR-001", name: "Yassine Chafik", role: "Eleve", status: "Actif" },
  { id: "USR-002", name: "Nora Benali", role: "Professeur", status: "Actif" },
  { id: "USR-003", name: "Meriem Alaoui", role: "Parent", status: "En attente" },
  { id: "USR-004", name: "Othmane Salmi", role: "Eleve", status: "Suspendu" },
  { id: "USR-005", name: "Karim Lahlou", role: "Professeur", status: "Actif" },
];

export const subjectOverview: SubjectProgress[] = [
  { subject: "Mathematiques", mastery: 78 },
  { subject: "Francais", mastery: 72 },
  { subject: "SVT", mastery: 69 },
  { subject: "Physique", mastery: 74 },
  { subject: "Anglais", mastery: 81 },
];

export const studentRiskAlerts = [
  {
    student: "Hiba Ait Said",
    reason: "Baisse continue en comprehension ecrite",
    level: "Risque eleve",
  },
  {
    student: "Ayoub Mounir",
    reason: "Absences repetees sur 2 semaines",
    level: "Risque modere",
  },
];

export const parentProgressLine = [
  { week: "S1", math: 61, french: 65 },
  { week: "S2", math: 64, french: 66 },
  { week: "S3", math: 67, french: 68 },
  { week: "S4", math: 71, french: 70 },
  { week: "S5", math: 73, french: 72 },
  { week: "S6", math: 76, french: 73 },
];

export const supportSchedule = [
  { day: "Lundi", slot: "18:00 - 19:30", course: "Mathematiques" },
  { day: "Mercredi", slot: "17:00 - 18:00", course: "Francais" },
  { day: "Samedi", slot: "10:00 - 11:30", course: "Revision generale" },
];

export const studentScoreHistory = [58, 62, 64, 67, 70, 73, 76, 79];
