import type { Metadata } from "next";

import "./globals.css";

import { Inter } from "next/font/google";
import Header from "@/components/header";
import { AppProvider } from "./provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProjectPro",
  description: "Project Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AppProvider>
          <Header />
          <main className="min-h-screen">
            {children}
            <Analytics />
          </main>
          <Toaster />
          <footer className="bg-black py-12 text-center">
            <div className="container mx-auto text-gray-200">
              <p className="text-lg mb-2">Made with ❤️ by Ayush Singh</p>
              <p className="text-sm">
                For inquiries, contact me at{" "}
                <a
                  href="mailto:ayushsingh916924@gmail.com"
                  className="text-blue-400 hover:text-blue-500"
                >
                  ayushsingh916924@gmail.com
                </a>
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
