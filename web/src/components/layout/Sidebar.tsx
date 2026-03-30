"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "홈", icon: "⌂" },
  { href: "/glossary", label: "용어집", icon: "📖" },
  { href: "/techniques", label: "기법 학습", icon: "🎬" },
  { href: "/workflow", label: "워크플로우", icon: "🔄" },
  { href: "/simulator", label: "시뮬레이터", icon: "🎯" },
  { href: "/scene-planner", label: "씬 플래너", icon: "🎞" },
  { href: "/decision-matrix", label: "결정 매트릭스", icon: "📊" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* 로고/타이틀 */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" onClick={onClose}>
          <div className="font-bold text-xl" style={{ color: "var(--accent)" }}>
            First-Cut
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            영상 기획 학습
          </div>
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--muted)",
                borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {sidebarContent}
      </aside>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        />
      )}

      {/* 모바일 슬라이드인 사이드바 */}
      <aside
        className="fixed top-0 left-0 z-50 h-full w-56 md:hidden transition-transform duration-300"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl"
          style={{ color: "var(--muted)" }}
          aria-label="닫기"
        >
          ✕
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}

export function MobileHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header
      className="md:hidden flex items-center gap-3 px-4 h-14 sticky top-0 z-30"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={onMenuOpen}
        className="text-xl p-1"
        style={{ color: "var(--muted)" }}
        aria-label="메뉴 열기"
      >
        ☰
      </button>
      <span className="font-bold" style={{ color: "var(--accent)" }}>
        First-Cut
      </span>
    </header>
  );
}
