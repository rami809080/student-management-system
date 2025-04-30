// src/components/layout/Header.jsx
"use client";

import React from "react";
import Link from "next-intl/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile sidebar
import { Menu, LogOut } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher"; // Assuming this component exists
import { usePathname } from "next-intl/client";
import { useRouter } from "next/navigation"; // Use next/navigation for logout redirect
import { toast } from "sonner";

// Placeholder for Sidebar content - can be moved to its own component
const SidebarContent = ({ onLinkClick }) => {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: t("title") },
    { href: "/students", label: t("students") },
    { href: "/classes", label: t("classes") },
    { href: "/users", label: t("users") }, // Add link if user management UI is built
    { href: "/settings", label: t("settings") }, // Add link if settings UI is built
  ];

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === link.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          onClick={onLinkClick} // Close sheet on mobile link click
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default function Header() {
  const t = useTranslations("common");
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      // Call an API endpoint to clear the server-side session/cookie if necessary
      // For cookie-based auth, just clearing the cookie might suffice depending on middleware
      // Example: await fetch("/api/auth/logout", { method: "POST" });
      
      // Clear the token cookie (client-side)
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      toast.success(t("logoutSuccess")); // Add logoutSuccess key
      // Redirect to login page
      router.push("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t("logoutError")); // Add logoutError key
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu */}
        <div className="md:hidden mr-4 rtl:ml-4 rtl:mr-0">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0"> {/* Adjust width as needed */}
              <div className="p-4 border-b">
                <Link href="/dashboard" className="font-bold text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("appName")}
                </Link>
              </div>
              <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo/Title */}
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="font-bold">
            {t("appName")}
          </Link>
        </div>

        {/* Desktop Navigation (can be part of header or separate sidebar) */} 
        {/* <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/dashboard" className="text-foreground/60 hover:text-foreground/80">Dashboard</Link>
          <Link href="/students" className="text-foreground/60 hover:text-foreground/80">Students</Link>
          <Link href="/classes" className="text-foreground/60 hover:text-foreground/80">Classes</Link>
        </nav> */} 

        <div className="flex flex-1 items-center justify-end space-x-4 rtl:space-x-reverse">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">{t("logout")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

