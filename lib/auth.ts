export type UserRole = "admin" | "teacher" | "parent";

export type LoginCredential = {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  redirectTo: string;
};

export const LOGIN_CREDENTIALS: LoginCredential[] = [
  {
    role: "admin",
    label: "Administrateur",
    email: "admin@edutrack.ma",
    password: "admin123",
    redirectTo: "/admin",
  },
  {
    role: "teacher",
    label: "Enseignant",
    email: "prof@edutrack.ma",
    password: "prof123",
    redirectTo: "/teacher",
  },
  {
    role: "parent",
    label: "Parents",
    email: "aparent@edutrack.ma",
    password: "parent123",
    redirectTo: "/parents",
  },
];

export function validatePrototypeLogin(
  role: UserRole,
  email: string,
  password: string,
) {
  const candidate = LOGIN_CREDENTIALS.find((entry) => entry.role === role);
  if (!candidate) {
    return { valid: false as const, message: "Role introuvable." };
  }

  const valid =
    candidate.email.toLowerCase() === email.trim().toLowerCase() &&
    candidate.password === password;

  return valid
    ? { valid: true as const, redirectTo: candidate.redirectTo }
    : { valid: false as const, message: "Email ou mot de passe incorrect." };
}
