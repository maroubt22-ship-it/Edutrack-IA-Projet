"use client";

import type { CSSProperties, FormEvent, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { type UserRole, validatePrototypeLogin } from "@/lib/auth";

type RoleCard = {
  key: UserRole;
  title: string;
  subtitle: string;
  color: string;
};

const roles: RoleCard[] = [
  {
    key: "admin",
    title: "Administrateur",
    subtitle: "Pilotage global du centre",
    color: "#67E8F9",
  },
  {
    key: "teacher",
    title: "Enseignant",
    subtitle: "Suivi pédagogique intelligent",
    color: "#C4B5FD",
  },
  {
    key: "parent",
    title: "Parents",
    subtitle: "Vision claire de la progression",
    color: "#F9A8D4",
  },
];

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 3l7 3v5c0 5-3.4 8.8-7 10-3.6-1.2-7-5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9.4 12l1.8 1.8 3.6-3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M3 9.5L12 5l9 4.5L12 14 3 9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7.5 12.2V16c0 1.2 2 2.2 4.5 2.2s4.5-1 4.5-2.2v-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ParentsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="8" cy="9" r="2.7" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="9.8" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.8 18.3c.5-2.5 2.3-4 4.2-4h.1c1.9 0 3.7 1.5 4.1 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.8 18.3c.4-1.9 1.7-3.1 3.2-3.1h.1c1.4 0 2.7 1.2 3.1 3.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function RoleIcon({ role }: { role: UserRole }) {
  if (role === "admin") return <ShieldIcon />;
  if (role === "teacher") return <TeacherIcon />;
  return <ParentsIcon />;
}

function BrainCapSVG({ selectedRole }: { selectedRole: UserRole }) {
  return (
    <svg viewBox="0 0 760 620" className="h-full w-full" role="img" aria-label="Futuristic brain with data streams">
      <defs>
        <linearGradient id="brainFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#DDD6FE" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="capFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DDE6EE" />
          <stop offset="100%" stopColor="#8AA2B7" />
        </linearGradient>
        <filter id="brainGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="252" cy="315" rx="168" ry="142" fill="url(#brainFill)" opacity="0.95" filter="url(#brainGlow)" />
      <ellipse cx="340" cy="312" rx="142" ry="124" fill="url(#brainFill)" opacity="0.9" filter="url(#brainGlow)" />

      <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.86">
        <path d="M130 281c28-56 88-80 140-44 46 32 94 18 128-16" stroke="#60A5FA" strokeWidth="6" />
        <path d="M128 345c40-52 101-62 146-20 44 40 89 44 132 8" stroke="#C4B5FD" strokeWidth="6" />
        <path d="M155 402c44-26 86-23 130 12 42 34 86 26 116-6" stroke="#F9A8D4" strokeWidth="5.5" />
        <path d="M171 239c30-24 72-28 108-4" stroke="#67E8F9" strokeWidth="4.5" opacity="0.8" />
        <path d="M172 447c26 10 58 8 82-8" stroke="#BAE6FD" strokeWidth="4" opacity="0.8" />
      </g>

      <g>
        <path d="M116 170l188-72 188 72-188 52-188-52z" fill="url(#capFill)" />
        <ellipse cx="304" cy="214" rx="69" ry="24" fill="#7E95AA" opacity="0.9" />
        <path d="M102 184l10 127" stroke="#BFD2E1" strokeWidth="4" strokeLinecap="round" />
        <circle cx="113" cy="313" r="9" fill="#CEDCE8" />
      </g>

      {roles.map((role, index) => {
        const active = selectedRole === role.key;
        const y = 242 + index * 84;
        const streamStyle = {
          ["--stream-color" as string]: role.color,
          ["--stream-delay" as string]: `${index * 0.2}s`,
        } as CSSProperties;

        return (
          <g key={role.key}>
            <circle cx="382" cy={y} r="16" fill="#0D3C46" opacity="0.9" />
            <circle cx="382" cy={y} r="8" fill={role.color} opacity={active ? 1 : 0.45} className={active ? "stream-dot" : ""} />

            {[0, 9, -9].map((offset) => (
              <path
                key={`${role.key}-${offset}`}
                d={`M 398 ${y + offset} C 500 ${y + offset - 18}, 590 ${y + offset - 4}, 742 ${206 + index * 103 + offset * 0.28}`}
                fill="none"
                stroke="var(--stream-color)"
                strokeWidth={active ? 3.3 : 2}
                strokeLinecap="round"
                strokeDasharray={active ? "14 16" : "8 18"}
                opacity={active ? 0.95 : 0.22}
                className={active ? "stream-active" : "stream-idle"}
                style={streamStyle}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tappedRole, setTappedRole] = useState<UserRole | null>(null);

  const brainParallaxRef = useRef<HTMLDivElement | null>(null);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roleTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedRoleMeta = useMemo(
    () => roles.find((role) => role.key === selectedRole) ?? roles[0],
    [selectedRole],
  );

  useEffect(() => {
    function createParticle(x: number, y: number) {
      const particle = document.createElement("div");
      particle.style.position = "fixed";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = "10px";
      particle.style.height = "10px";
      particle.style.background =
        "linear-gradient(135deg, var(--petrol-blue), var(--petrol-blue-deep))";
      particle.style.borderRadius = "9999px";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "9999";
      particle.style.opacity = "0.95";
      particle.style.boxShadow = "0 0 20px rgba(15, 76, 92, 0.35)";

      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle
        .animate(
          [
            { transform: "translate(0, 0) scale(1)", opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 },
          ],
          {
            duration: 800,
            easing: "cubic-bezier(0, .9, .57, 1)",
          },
        )
        .addEventListener("finish", () => particle.remove());
    }

    function handleClick(e: MouseEvent) {
      createParticle(e.clientX, e.clientY);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
      if (roleTapTimeoutRef.current) clearTimeout(roleTapTimeoutRef.current);
    };
  }, []);

  function handleRoleSelect(role: UserRole) {
    setSelectedRole(role);
    setTappedRole(role);

    if (roleTapTimeoutRef.current) clearTimeout(roleTapTimeoutRef.current);
    roleTapTimeoutRef.current = setTimeout(() => {
      setTappedRole(null);
    }, 150);
  }

  function handleParallaxMove(event: ReactMouseEvent<HTMLElement>) {
    if (!brainParallaxRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    brainParallaxRef.current.style.transform = `translate3d(${x * 30}px, ${y * 30}px, 0)`;
  }

  function handleParallaxLeave() {
    if (!brainParallaxRef.current) return;
    brainParallaxRef.current.style.transform = "translate3d(0, 0, 0)";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);

    submitTimeoutRef.current = setTimeout(() => {
      const result = validatePrototypeLogin(selectedRole, email, password);
      if (result.valid) {
        alert(`Connexion en tant que: ${selectedRoleMeta.title}`);
        router.push(result.redirectTo);
      } else {
        alert(result.message);
      }

      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-sky-mist">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <aside
          className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-petrol-blue to-petrol-blue-deep px-5 py-8 sm:px-8 lg:px-10 lg:py-12 items-center justify-center"
          onMouseMove={handleParallaxMove}
          onMouseLeave={handleParallaxLeave}
        >
          <div className="absolute inset-0 bg-hero-mesh" />
          <div className="relative w-full max-w-[760px] animate-fade-in-up">
            <div ref={brainParallaxRef} className="will-change-transform transition-transform duration-150">
              <BrainCapSVG selectedRole={selectedRole} />
            </div>
          </div>
        </aside>

        <aside className="flex items-center justify-center bg-gradient-to-br from-sky-mist to-petrol-blue-soft px-4 py-10 sm:px-8 lg:px-10">
          <article className="animate-fade-in-up w-full max-w-[560px] rounded-3xl border border-white/70 bg-white p-6 shadow-glass sm:p-8 lg:p-10">
            <header className="mb-8 text-center">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-petrol-blue sm:text-5xl">
                EduTrack
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">Connexion sécurisée multi-rôles</p>
            </header>

            <div className="space-y-3">
              {roles.map((role, index) => {
                const active = selectedRole === role.key;
                const tapped = tappedRole === role.key;

                return (
                  <button
                    key={role.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleRoleSelect(role.key)}
                    className={
                      "animate-fade-in-up group w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 " +
                      (active
                        ? "border-cyan-200/60 bg-gradient-to-br from-petrol-blue to-petrol-blue-deep text-white shadow-glass"
                        : "border-slate-200 bg-slate-50 text-slate-800 hover:translate-x-2.5 hover:shadow-soft") +
                      (tapped ? " scale-95" : "")
                    }
                    style={{
                      animationDelay: `${0.14 + index * 0.1}s`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={
                          "grid h-12 w-12 place-items-center rounded-full transition-all duration-300 " +
                          (active
                            ? "bg-white text-petrol-blue"
                            : "bg-gradient-to-br from-petrol-blue to-petrol-blue-deep text-white")
                        }
                      >
                        <RoleIcon role={role.key} />
                      </span>

                      <span>
                        <strong className={"block text-base " + (active ? "text-white" : "text-slate-900")}>{role.title}</strong>
                        <span className={"mt-0.5 block text-sm " + (active ? "text-cyan-100/90" : "text-slate-600")}>{role.subtitle}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <form className="mt-8" onSubmit={handleSubmit} aria-busy={isSubmitting}>
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ai-button inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </article>
        </aside>
      </section>

      <style jsx global>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(14px);
          animation: fadeInUp 0.7s ease-out forwards;
        }

        .stream-active {
          animation: pulseStream 1.4s linear infinite;
          filter: drop-shadow(0 0 7px var(--stream-color));
        }

        .stream-idle {
          animation: pulseStream 3.6s linear infinite;
          stroke-dashoffset: 0;
        }

        .stream-dot {
          animation: dotPulse 1.4s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseStream {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -150;
          }
        }

        @keyframes dotPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </main>
  );
}
