import { Inter, Manrope } from "next/font/google";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lexispremium.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lexis Premium — Konsultasi Hukum Eksklusif",
    template: "%s | Lexis Premium",
  },
  description:
    "Menghubungkan Anda dengan pakar hukum terpercaya melalui platform digital yang aman, transparan, dan efisien. Konsultasi hukum pertama Anda dimulai di sini.",
  keywords: [
    "konsultasi hukum",
    "pengacara online",
    "advokat Indonesia",
    "hukum bisnis",
    "Lexis Premium",
  ],
  authors: [{ name: "Lexis Premium Tech Center" }],
  creator: "Lexis Premium",
  publisher: "Lexis Premium",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  // OpenGraph — untuk pratinjau saat dibagikan ke medsos / WhatsApp
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Lexis Premium",
    title: "Lexis Premium — Konsultasi Hukum Eksklusif",
    description:
      "Platform konsultasi hukum terpercaya Indonesia. Temukan pengacara berpengalaman dan mulai konsultasi kapan saja.",
    images: [
      {
        url: "/og-image.png", // Buat file ini di /public/og-image.png (1200x630px)
        width: 1200,
        height: 630,
        alt: "Lexis Premium — Platform Hukum Indonesia",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Lexis Premium",
    description: "Konsultasi hukum profesional dengan pengacara terpercaya.",
    creator: "@lexispremium",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/logo-icon.svg", type: "image/svg+xml" }],
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
};

export default function RootLayout({ children }) {
  // suppressHydrationWarning is intentional here.
  // The inline script above sets `dark` class on <html> before React hydrates,
  // to avoid a Flash of Unstyled Content (FOUC) when dark mode is active.
  // This causes a harmless hydration mismatch which we suppress here.
  // See: https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo-icon.svg" type="image/svg+xml" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} bg-surface text-on-surface antialiased flex flex-col min-h-screen transition-colors duration-300`}
      >
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}
