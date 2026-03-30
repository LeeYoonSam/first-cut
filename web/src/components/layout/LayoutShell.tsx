"use client";
import { useState } from "react";
import { Sidebar, MobileHeader } from "@/components/layout/Sidebar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 모바일 상단 헤더 */}
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        {/* 사이드바 */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-6 py-8 min-w-0 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}
