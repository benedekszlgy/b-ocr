import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B-OCR - Loan Document Extractor",
  description: "AI-powered document extraction for loan applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
