// src/app/[locale]/layout.js
import { Inter } from "next/font/google";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Toaster } from "@/components/ui/sonner"; // For notifications
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Student Management System", // Default title, can be localized later
  description: "Manage students and classes effectively",
};

export default function RootLayout({ children, params: { locale } }) {
  const messages = useMessages();

  // Determine text direction based on locale
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <div className="flex flex-1">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:block w-64 border-r bg-background" />
            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 overflow-auto">
               {children}
            </main>
          </div>
          <Toaster richColors position="top-right" /> {/* Notification component */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

