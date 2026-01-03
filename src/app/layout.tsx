import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookmarkProvider } from "@/context/BookmarkContext";
import { WatchHistoryProvider } from "@/context/WatchHistoryContext";
import { RatingProvider } from "@/context/RatingContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#e11d48",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "LayarDrama - Watch Asian Dramas Online",
  description:
    "Stream and watch your favorite Asian dramas including Korean, Chinese, and Japanese dramas for free in high quality.",
  keywords: ["drama", "korean drama", "kdrama", "asian drama", "streaming"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LayarDrama",
  },
  openGraph: {
    title: "LayarDrama - Watch Asian Dramas Online",
    description: "Stream and watch your favorite Asian dramas for free.",
    type: "website",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <BookmarkProvider>
            <WatchHistoryProvider>
              <RatingProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster
                  position="bottom-right"
                  theme="dark"
                  toastOptions={{
                    style: {
                      background: '#18181b',
                      border: '1px solid #27272a',
                      color: '#fff',
                    },
                  }}
                />
              </RatingProvider>
            </WatchHistoryProvider>
          </BookmarkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

