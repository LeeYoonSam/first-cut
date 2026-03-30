"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "홈" },
  { href: "/glossary", label: "용어집" },
  { href: "/techniques", label: "기법 학습" },
  { href: "/matrices", label: "결정 매트릭스" },
  { href: "/decision-matrix", label: "매트릭스(구)" },
  { href: "/workflow", label: "워크플로우" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link
          href="/"
          className="font-bold text-lg"
          style={{ color: "var(--accent)" }}
        >
          First Cut
        </Link>
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors"
              style={{
                color:
                  pathname === link.href
                    ? "var(--foreground)"
                    : "var(--muted)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
