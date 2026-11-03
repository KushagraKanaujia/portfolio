import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

const title = "Kushagra Kanaujia";
const description =
  "Founder of Throttle. I help companies stop renting their AI. Software engineer, UC Santa Barbara CS.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kushagrakanaujia.vercel.app"),
  title,
  description,
  authors: [{ name: title }],
  openGraph: { title, description, type: "website", siteName: title },
  twitter: { card: "summary_large_image", title, description, creator: "@KushagraKanauji" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f4" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
