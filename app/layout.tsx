import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/auth-provider";
import ScrollToTop from "@/components/common/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ariveeasy",
  description: "Making International property ownership accessible for immigrants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `}>

        <AuthProvider>
          <QueryProvider>
            <ScrollToTop />
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
