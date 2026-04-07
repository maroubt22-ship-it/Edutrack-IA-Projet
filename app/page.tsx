"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, LockKeyhole, Mail, ShieldCheck, UsersRound } from "lucide-react";
import { LoginBrainScene } from "@/components/login-brain-scene";
import { LOGIN_CREDENTIALS, UserRole, validatePrototypeLogin } from "@/lib/auth";

const roleCards = [
  {
    role: "admin" as UserRole,
    title: "Administrateur",
    caption: "Pilotage global du centre",
    icon: ShieldCheck,
  },
  {
    role: "teacher" as UserRole,
    title: "Enseignant",
    caption: "Suivi pedagogique intelligent",
    icon: GraduationCap,
  },
  {
    role: "parent" as UserRole,
    title: "Parents",
    caption: "Vision claire de la progression",
    icon: UsersRound,
  },
];

const roleColors: Record<UserRole, string> = {
  admin: "#65e8f4",
  teacher: "#b8a8ff",
  parent: "#f59cc5",
};

type LineGeometry = Record<
  UserRole,
  {
    start: { x: number; y: number };
    cp1: { x: number; y: number };
    cp2: { x: number; y: number };
    end: { x: number; y: number };
  } | null
>;

function emptyLineGeometry(): LineGeometry {
  return {
    admin: null,
    teacher: null,
    parent: null,
  };
}

export default function Home() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);

  const brainAnchorRefs = useRef<Record<UserRole, HTMLDivElement | null>>({
    admin: null,
    teacher: null,
    parent: null,
  });

  const cardRefs = useRef<Record<UserRole, HTMLButtonElement | null>>({
    admin: null,
    teacher: null,
    parent: null,
  });

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("admin@edutrack.ma");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [lineGeometry, setLineGeometry] = useState<LineGeometry>(emptyLineGeometry);

  const selectedCredentials = useMemo(
    () => LOGIN_CREDENTIALS.find((item) => item.role === selectedRole),
    [selectedRole],
  );

  const onRoleChange = useCallback((role: UserRole) => {
    setSelectedRole(role);
    const credential = LOGIN_CREDENTIALS.find((item) => item.role === role);
    if (credential) {
      setEmail(credential.email);
      setPassword(credential.password);
    }
    setError("");
  }, []);

  const updatePaths = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    const next = emptyLineGeometry();

    (Object.keys(roleColors) as UserRole[]).forEach((role) => {
      const card = cardRefs.current[role];
      const anchor = brainAnchorRefs.current[role];
      if (!card || !anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const startX = anchorRect.left + anchorRect.width * 0.5 - stageRect.left;
      const startY = anchorRect.top + anchorRect.height * 0.5 - stageRect.top;
      const endX = cardRect.left + 2 - stageRect.left;
      const endY = cardRect.top + cardRect.height * 0.5 - stageRect.top;

      const distance = Math.max(120, endX - startX);
      const curveAmount = Math.min(190, distance * 0.55);

      next[role] = {
        start: { x: startX, y: startY },
        cp1: { x: startX + curveAmount, y: startY },
        cp2: { x: endX - curveAmount, y: endY },
        end: { x: endX, y: endY },
      };
    });

    setLineGeometry(next);
  }, []);

  useEffect(() => {
    const firstFrame = requestAnimationFrame(() => updatePaths());

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => updatePaths());
    });

    const stage = stageRef.current;
    if (stage) observer.observe(stage);

    const onResize = () => requestAnimationFrame(() => updatePaths());
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(firstFrame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [updatePaths]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => updatePaths());
    return () => cancelAnimationFrame(frame);
  }, [selectedRole, updatePaths]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const verdict = validatePrototypeLogin(selectedRole, email, password);
    if (!verdict.valid) {
      setError(verdict.message);
      return;
    }

    router.push(verdict.redirectTo);
  };

  const getPath = (line: NonNullable<LineGeometry[UserRole]>, offset: number) => {
    const sy = line.start.y + offset;
    const ey = line.end.y + offset;
    const c1y = line.cp1.y + offset;
    const c2y = line.cp2.y + offset;
    return `M ${line.start.x} ${sy} C ${line.cp1.x} ${c1y}, ${line.cp2.x} ${c2y}, ${line.end.x} ${ey}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#e4ecef]">
      <div className="absolute inset-y-0 left-0 hidden w-[48%] bg-[#0f5961] lg:block" />

      <main className="relative z-20 mx-auto max-w-[1320px] px-4 py-6 md:px-8 md:py-10">
        <div ref={stageRef} className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
          >
            <defs>
              <filter id="line-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {(Object.keys(lineGeometry) as UserRole[]).map((role) => {
              const line = lineGeometry[role];
              if (!line) return null;
              const active = selectedRole === role;

              return (
                <g key={role}>
                  {[-8, 0, 8].map((offset) => (
                    <path
                      key={`${role}-${offset}`}
                      d={getPath(line, offset)}
                      fill="none"
                      stroke={roleColors[role]}
                      strokeWidth={active ? 2.3 : 1.35}
                      strokeLinecap="round"
                      strokeDasharray={active ? "14 14" : "8 16"}
                      opacity={active ? 0.95 : 0.22}
                      filter={active ? "url(#line-glow)" : "none"}
                      style={{ animation: active ? "flowDash 1.05s linear infinite" : "none" }}
                    />
                  ))}
                </g>
              );
            })}
          </motion.svg>

          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[1.8rem] px-2 py-2 lg:py-7"
          >
            <div className="relative mx-auto max-w-[620px]">
              <LoginBrainScene selectedRole={selectedRole} />

              <div
                ref={(node) => {
                  brainAnchorRefs.current.admin = node;
                }}
                className="pointer-events-none absolute right-[11%] top-[32%] h-3 w-3 rounded-full bg-cyan-200/0"
              />
              <div
                ref={(node) => {
                  brainAnchorRefs.current.teacher = node;
                }}
                className="pointer-events-none absolute right-[9%] top-[50%] h-3 w-3 rounded-full bg-violet-200/0"
              />
              <div
                ref={(node) => {
                  brainAnchorRefs.current.parent = node;
                }}
                className="pointer-events-none absolute right-[11%] top-[69%] h-3 w-3 rounded-full bg-pink-200/0"
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="rounded-[2rem] bg-[#edf2f5] p-6 shadow-[0_20px_40px_rgba(24,55,73,0.14)] md:p-8"
          >
            <div className="text-center lg:text-left">
              <h1 className="font-display text-5xl font-black tracking-tight text-[#0f4c5c] drop-shadow-[0_3px_6px_rgba(9,42,52,0.18)]">
                EduTrack
              </h1>
              <p className="mt-1 text-[#6b7d84]">Connexion securisee multi-roles</p>
            </div>

            <div className="mt-7 space-y-4">
              {roleCards.map((item, index) => {
                const Icon = item.icon;
                const active = selectedRole === item.role;
                return (
                  <motion.button
                    key={item.role}
                    ref={(node) => {
                      cardRefs.current[item.role] = node;
                    }}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.1, duration: 0.4 }}
                    onClick={() => onRoleChange(item.role)}
                    className="w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      background: active ? "linear-gradient(115deg, #0f5961, #0b4a52)" : "#ffffff",
                      borderColor: active ? "#0f5961" : "#eef2f4",
                      boxShadow: active
                        ? "0 10px 26px rgba(15,89,97,0.34)"
                        : "0 8px 18px rgba(16,42,51,0.06)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 grid h-8 w-8 place-items-center rounded-full"
                        style={{
                          background: active ? "rgba(255,255,255,0.12)" : "#f3f7f8",
                          color: active ? "#d6fbff" : "#2e5159",
                        }}
                      >
                        <Icon size={16} />
                      </span>

                      <div>
                        <p className={`text-base font-bold ${active ? "text-white" : "text-[#0f2e35]"}`}>
                          {item.title}
                        </p>
                        <p className={`mt-0.5 text-sm ${active ? "text-cyan-100/90" : "text-[#72848b]"}`}>
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="mt-6 grid gap-3"
            >
              <label className="grid gap-1">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#6e8188]">
                  <Mail size={13} /> Email
                </span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  className="rounded-xl border border-[#d5e0e5] bg-white px-3 py-2.5 text-[#0f2e35] outline-none transition focus:border-[#0f5961]"
                />
              </label>

              <label className="grid gap-1">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#6e8188]">
                  <LockKeyhole size={13} /> Mot de passe
                </span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  className="rounded-xl border border-[#d5e0e5] bg-white px-3 py-2.5 text-[#0f2e35] outline-none transition focus:border-[#0f5961]"
                />
              </label>

              {error ? <p className="text-sm text-[#d04d5a]">{error}</p> : null}

              <button
                type="submit"
                className="mt-1 w-full rounded-xl bg-[#0f5961] px-4 py-2.5 font-semibold text-white shadow-[0_8px_18px_rgba(15,89,97,0.35)] transition hover:brightness-110"
              >
                Se connecter ({selectedCredentials?.label})
              </button>
            </motion.form>
          </motion.section>
        </div>
      </main>

      <style jsx global>{`
        @keyframes flowDash {
          to {
            stroke-dashoffset: -180;
          }
        }
      `}</style>
    </div>
  );
}
