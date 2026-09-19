import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brandrise.vercel.app"),
  title: {
    default: "BrandRise — Websites & WhatsApp Automation for Local Businesses",
    template: "%s — BrandRise",
  },
  description:
    "BrandRise helps local businesses in Karachi grow with modern websites, WhatsApp automation and AI-powered lead generation. Affordable, mobile-first websites in days, not weeks.",
  keywords: [
    "web designer karachi",
    "website for small business",
    "whatsapp automation",
    "local business website",
    "affordable website pakistan",
    "ai chatbot for business",
    "brandrise",
  ],
  openGraph: {
    type: "website",
    url: "https://brandrise.vercel.app",
    siteName: "BrandRise",
    title: "BrandRise — Websites & WhatsApp Automation for Local Businesses",
    description:
      "Modern websites and WhatsApp automation for local businesses in Karachi — fast, affordable and mobile-first.",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandRise — Websites & WhatsApp Automation",
    description:
      "Modern websites and WhatsApp automation for local businesses in Karachi.",
  },
  robots: { index: true, follow: true },
  themeColor: "#7c3aed",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}