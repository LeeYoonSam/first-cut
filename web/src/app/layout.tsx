import type { Metadata } from "next";
import "@/styles/globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "First-Cut — 영상 기획 AI 하니스",
  description: "씬별 촬영·사운드·편집 기법이 명시된 영상 기획서를 만드는 AI 워크플로우",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
