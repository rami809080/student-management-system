// src/components/layout/Sidebar.jsx
"use client";

import React from "react";
import Link from "next-intl/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar({ className }) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: t("title") },
    { href: "/students", label: t("students") },
    { href: "/classes", label: t("classes") },
    // { href: "/users", label: t("users") }, // Uncomment if user management UI is built
    // { href: "/settings", label: t("settings") }, // Uncomment if settings UI is built
  ];

  return (
    <aside className={className}>
      <ScrollArea className="h-full py-4">
        <nav className="flex flex-col space-y-1 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

