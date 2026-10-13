import type { Speaker } from "@/content/types";

type Look = { name: string; role: string; skin: string; hair: string; shirt: string; style: "bun" | "short" | "curly" | "cap" | "long" };

export const personas: Record<Exclude<Speaker, "narrator">, Look> = {
  pm: { name: "Priya", role: "PM", skin: "#C68B59", hair: "#2B1B12", shirt: "var(--accent)", style: "bun" },
  interviewer: { name: "Sam", role: "Interviewer", skin: "#F1C7A0", hair: "#7A4A21", shirt: "#5B6CFF", style: "short" },
  engineer: { name: "Dev", role: "Engineer", skin: "#8D5A3B", hair: "#111111", shirt: "#2BB673", style: "curly" },
  analyst: { name: "Mei", role: "Data analyst", skin: "#EBC29A", hair: "#1E1E2A", shirt: "#FF8A3D", style: "long" },
  user: { name: "Alex", role: "User", skin: "#DFA77A", hair: "#C0392B", shirt: "#B05BFF", style: "cap" },
};

function Hair({ style, color }: { style: Look["style"]; color: string }) {
  switch (style) {
    case "bun":
      return (
        <>
          <circle cx="32" cy="9" r="7" fill={color} />
          <path d="M14 30 C14 14 50 14 50 30 C46 22 18 22 14 30Z" fill={color} />
        </>
      );
    case "short":
      return <path d="M15 28 C15 12 49 12 49 28 C44 20 20 20 15 28Z" fill={color} />;
    case "curly":
      return (
        <g fill={color}>
          {[16, 22, 28, 34, 40, 46].map((x) => (
            <circle key={x} cx={x} cy={x === 16 || x === 46 ? 22 : 16} r="6" />
          ))}
        </g>
      );
    case "long":
      return <path d="M13 44 C10 12 54 12 51 44 L47 44 C48 26 16 26 17 44Z" fill={color} />;
    case "cap":
      return (
        <>
          <path d="M14 26 C14 12 50 12 50 26Z" fill={color} />
          <rect x="40" y="22" width="16" height="5" rx="2.5" fill={color} />
        </>
      );
  }
}

export function Avatar({ speaker, size = 56 }: { speaker: Exclude<Speaker, "narrator">; size?: number }) {
  const p = personas[speaker];
  return (
    <svg
      className="avatar"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={`${p.name}, ${p.role}`}
    >
      <circle cx="32" cy="32" r="31" fill="var(--avatar-bg)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M12 62 C12 46 52 46 52 62Z" fill={p.shirt} stroke="var(--ink)" strokeWidth="2" />
      <circle cx="32" cy="31" r="15" fill={p.skin} stroke="var(--ink)" strokeWidth="2" />
      <Hair style={p.style} color={p.hair} />
      <circle cx="26.5" cy="32" r="1.8" fill="#111" />
      <circle cx="37.5" cy="32" r="1.8" fill="#111" />
      <path d="M27 38 Q32 42 37 38" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
