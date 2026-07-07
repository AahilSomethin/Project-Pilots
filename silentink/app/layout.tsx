import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TopNav } from "@/components/layout/top-nav";

import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silentink",
  description:
    "A silent-first learning platform for sign language, Morse code, and Braille communication.",
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
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <div className="min-h-screen">
            <TopNav />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
