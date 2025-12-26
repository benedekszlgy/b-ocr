import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UploadQueueProvider } from "@/contexts/UploadQueueContext";
import UploadProgress from "@/components/UploadProgress";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "B-OCR - Document Intelligence Platform",
  description: "AI-powered document extraction for loan applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={inter.className}>
        <LanguageProvider>
          <UploadQueueProvider>
            {children}
            <UploadProgress />
          </UploadQueueProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
