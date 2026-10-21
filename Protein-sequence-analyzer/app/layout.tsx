import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What's In My Protein",
  description: "Trustworthy protein sequence analysis",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
