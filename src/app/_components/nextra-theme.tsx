"use client";

import type { PageMapItem } from "nextra";
import type { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export const NextraTheme: FC<{
  children: ReactNode;
  pageMap: PageMapItem[];
}> = ({ children, pageMap }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-[var(--background)] text-white flex flex-col">
      <Navbar pageMap={pageMap} />

      <main className="flex-1">
        <div className="flex min-h-screen">
          {!isHomePage && <Sidebar pageMap={pageMap} />}
          <div className={`flex-1 ${isHomePage ? "" : ""}`}>{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
