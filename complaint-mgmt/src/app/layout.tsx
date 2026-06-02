import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { UserProvider } from "@/lib/user-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResolvX — E-Commerce Complaint Management",
  description:
    "A frictionless complaint management system for e-commerce platforms. Track, resolve, and analyze customer complaints with real-time dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          <UserProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 ml-64 overflow-y-auto">
                {children}
              </main>
            </div>
            <Toaster richColors position="top-right" />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
