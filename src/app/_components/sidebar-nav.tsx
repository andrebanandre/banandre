"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  title: string;
  href: string;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-3 mb-8">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              block px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-md transition-all duration-200
              ${
                isActive
                  ? "bg-[var(--accent)] bg-opacity-20 border-l-4 border-[var(--accent)] text-[var(--blue-accent)] font-black"
                  : "text-white hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)]"
              }
            `}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
