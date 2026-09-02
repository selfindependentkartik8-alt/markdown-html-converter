import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://markdownhtmlconverter.krishaiworks.com"
  ),

  title: "Markdown to HTML Converter | Convert Markdown to HTML Online",

  description:
    "Convert Markdown to HTML online quickly and easily with the free Markdown to HTML Converter by KrishAIWorks. Transform Markdown into clean HTML instantly.",

  keywords: [
    "Markdown to HTML Converter",
    "Markdown HTML Converter",
    "Markdown to HTML",
    "Convert Markdown to HTML",
    "Markdown Converter Online",
    "Markdown to HTML Online",
    "Free Markdown Converter",
    "Markdown HTML Converter Online",
    "Markdown Parser",
    "Markdown to HTML Tool",
  ],

  authors: [
    {
      name: "KrishAIWorks",
      url: "https://krishaiworks.vercel.app",
    },
  ],

  creator: "KrishAIWorks",
  publisher: "KrishAIWorks",

  alternates: {
    canonical:
      "https://markdownhtmlconverter.krishaiworks.com/",
  },

  openGraph: {
    title: "Markdown to HTML Converter | KrishAIWorks",
    description:
      "Convert Markdown to clean HTML online quickly and easily with KrishAIWorks.",
    url: "https://markdownhtmlconverter.krishaiworks.com/",
    siteName: "KrishAIWorks",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Markdown to HTML Converter | KrishAIWorks",
    description:
      "Convert Markdown into clean HTML instantly with this free online converter.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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