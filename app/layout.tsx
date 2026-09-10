import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://krishaiworks.com/#organization",
      name: "KrishAIWorks",
      url: "https://krishaiworks.com",
      logo: {
        "@type": "ImageObject",
        url: "https://krishaiworks.com/logo.png",
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://krishaiworks.com/#website",
      url: "https://krishaiworks.com",
      name: "KrishAIWorks",
      description:
        "AI-powered tools, productivity utilities, automation, chatbots, websites and custom digital solutions.",
      publisher: {
        "@id": "https://krishaiworks.com/#organization",
      },
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id":
        "https://markdownhtmlconverter.krishaiworks.com/#webapplication",
      name: "Markdown to HTML Converter",
      url: "https://markdownhtmlconverter.krishaiworks.com/",
      description:
        "Convert Markdown to HTML online quickly and easily with the free Markdown to HTML Converter by KrishAIWorks. Transform Markdown into clean HTML instantly.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser.",
      isPartOf: {
        "@id": "https://krishaiworks.com/#website",
      },
      publisher: {
        "@id": "https://krishaiworks.com/#organization",
      },
    },
    {
      "@type": "WebPage",
      "@id":
        "https://markdownhtmlconverter.krishaiworks.com/#webpage",
      url: "https://markdownhtmlconverter.krishaiworks.com/",
      name:
        "Markdown to HTML Converter | Convert Markdown to HTML Online",
      description:
        "Convert Markdown to HTML online quickly and easily with the free Markdown to HTML Converter by KrishAIWorks. Transform Markdown into clean HTML instantly.",
      isPartOf: {
        "@id": "https://krishaiworks.com/#website",
      },
      about: {
        "@id":
          "https://markdownhtmlconverter.krishaiworks.com/#webapplication",
      },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BS6TSMM1ZR"
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BS6TSMM1ZR');
          `}
        </Script>
      </body>
    </html>
  );
}