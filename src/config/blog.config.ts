import { Book, FileText, Home, ScrollText, GitFork } from "lucide-react";
import type { SidebarItem } from "@/types";

export const blogConfig: SidebarItem[] = [
  {
    title: "Blog",
    href: "/blog",
    icon: Book,
    items: [],
  },
  {
    title: "Installation",
    href: "/blog/installation",
    icon: FileText,
    items: [],
  },
  {
    title: "Components",
    href: "/blog/components",
    icon: Home,
    items: [],
  },
  {
    title: "License",
    href: "/blog/license",
    icon: ScrollText,
    items: [],
  },
  {
    title: "Contribute",
    href: "/blog/contribute",
    icon: GitFork,
    items: [],
  },
]