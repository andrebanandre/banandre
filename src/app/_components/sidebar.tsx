import { SidebarCategories } from "./sidebar-categories";
import { SidebarNav } from "./sidebar-nav";

export async function Sidebar() {
  const navItems = [
    { title: "Home", href: "/" },
    { title: "Categories", href: "/categories" },
  ];

  return (
    <aside className="hidden lg:block w-80 bg-[var(--card)] border-r-4 border-[var(--accent)] p-6 overflow-y-auto fixed left-0 top-16 sm:top-20 bottom-0">
      <div className="mb-8">
        <h2 className="text-[var(--accent)] font-black text-xl uppercase tracking-wide mb-6">
          Navigation
        </h2>
        <div className="h-1 bg-[var(--accent)] w-16 mb-6" />
      </div>

      <SidebarNav items={navItems} />

      {/* Categories Section */}
      <div className="mt-8">
        <SidebarCategories />
      </div>
    </aside>
  );
}
