import type { Metadata } from "next";

import "./globals.css";

import { Inter } from "next/font/google";
import Header from "@/components/header";
import { AppProvider } from "./provider";
import { Toaster } from "@/components/ui/toaster"

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
    <html lang="en">
      <body className={`${inter.className}`}>
        <AppProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster />
          <footer className="bg-gray-900 py-12 text">
            <div className="container mx-auto text-center text-gray-200">
              <p>Made with ❤️ by Ayush Singh</p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
