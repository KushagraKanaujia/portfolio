import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kushagra.dev"),
  title: { default: "Kushagra Kanaujia", template: "%s • Kushagra" },
  description: "Systems + ML engineering with measurable impact.",
  openGraph: {
    type: "website",
    url: "https://kushagra.dev",
    title: "Kushagra Kanaujia",
    description: "Systems + ML engineering with measurable impact.",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
