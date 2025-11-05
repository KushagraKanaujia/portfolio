import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kushagra Kanaujia | ML Engineer & Full-Stack Developer",
  description: "Building scalable ML systems and full-stack applications. UC Santa Barbara CS '26. 2M+ API requests handled monthly at 99.9% uptime.",
  keywords: ["Kushagra Kanaujia", "ML Engineer", "Full Stack Developer", "UCSB", "Machine Learning", "Software Engineer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
