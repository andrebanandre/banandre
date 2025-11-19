"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function ConditionalLayout({
  children,
  sidebar,
  footer
}: {
  children: ReactNode;
  sidebar: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();

  // Don't show sidebar on home page
  const showSidebar = pathname !== "/";

  // Blog posts have special layout - sidebar appears below hero
  const isBlogPost = pathname?.startsWith("/blog/") && pathname !== "/blog";

  if (isBlogPost) {
    // Blog post layout - children contain their own layout logic
    // Footer is inside the blog post component
    return <>{children}</>;
  }

  if (!showSidebar) {
    // Home page - no sidebar
    return (
      <>
        <main className="min-h-screen">
          {children}
        </main>
        {footer}
      </>
    );
  }

  // Other pages - sidebar on left
  return (
    <>
      {sidebar}
      <div className="lg:ml-80">
        <main className="min-h-screen">
          {children}
        </main>
        {footer}
      </div>
    </>
  );
}
