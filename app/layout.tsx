import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

const title = "Kushagra Kanaujia";
const description = "Hey, I'm Kush. I live in Isla Vista, right by the Pacific, and I build things that feel good to use.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kushagrakanaujia.vercel.app"),
  title,
  description,
  authors: [{ name: "Kushagra Kanaujia" }],
  openGraph: { title, description, type: "website", siteName: title },
  twitter: { card: "summary_large_image", title, description, creator: "@kush_1309" },
};

export const viewport: Viewport = { themeColor: "#041a30" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
