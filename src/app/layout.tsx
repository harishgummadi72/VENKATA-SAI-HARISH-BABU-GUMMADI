import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Venkata Sai Harish Babu Gummadi | Software Developer",
  description:
    "Portfolio of Venkata Sai Harish Babu Gummadi, a Computer Science and Engineering student focused on software development, full-stack web development, artificial intelligence and cybersecurity.",
  keywords: [
    "Venkata Sai Harish Babu Gummadi",
    "Harish Babu",
    "Software Developer",
    "Full Stack Web Development",
    "Artificial Intelligence",
    "Generative AI",
    "Cybersecurity",
    "Narasaraopeta Engineering College",
    "Portfolio",
  ],
  authors: [{ name: "Venkata Sai Harish Babu Gummadi" }],
  creator: "Venkata Sai Harish Babu Gummadi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Venkata Sai Harish Babu Gummadi | Software Developer",
    description:
      "Portfolio of Venkata Sai Harish Babu Gummadi, a Computer Science and Engineering student focused on software development, full-stack web development, artificial intelligence and cybersecurity.",
    siteName: "Venkata Sai Harish Babu Gummadi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venkata Sai Harish Babu Gummadi | Software Developer",
    description:
      "Portfolio of Venkata Sai Harish Babu Gummadi, a Computer Science and Engineering student focused on software development, full-stack web development, artificial intelligence and cybersecurity.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

import { AssistantProvider } from "@/components/ai/AssistantContext";
import AssistantModal from "@/components/ai/AssistantModal";
import FloatingAILauncher from "@/components/ai/FloatingAILauncher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Venkata Sai Harish Babu Gummadi",
    alternateName: "Harish Babu",
    jobTitle: "Software Developer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Narasaraopeta Engineering College",
    },
    url: siteUrl,
    sameAs: [
      "https://www.linkedin.com/in/harish-gummadi-18a3153a7/",
      "https://github.com/harishgummadi72",
    ],
  };

  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${inter.variable} ${cormorant.variable} antialiased overflow-x-hidden`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#080808] text-[#F5F5F5] selection:bg-[#FF7A00] selection:text-black overflow-x-hidden">
        <AssistantProvider>
          {children}
          <AssistantModal />
          <FloatingAILauncher />
        </AssistantProvider>
      </body>
    </html>
  );
}
