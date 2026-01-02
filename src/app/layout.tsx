import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookmarkProvider } from "@/context/BookmarkContext";
import { WatchHistoryProvider } from "@/context/WatchHistoryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LayarDrama - Watch Asian Dramas Online",
  description:
    "Stream and watch your favorite Asian dramas including Korean, Chinese, and Japanese dramas for free in high quality.",
  keywords: ["drama", "korean drama", "kdrama", "asian drama", "streaming"],
  openGraph: {
    title: "LayarDrama - Watch Asian Dramas Online",
    description: "Stream and watch your favorite Asian dramas for free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen flex flex-col`}
      >
        <BookmarkProvider>
          <WatchHistoryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </WatchHistoryProvider>
        </BookmarkProvider>
      </body>
    </html>
  );
}
