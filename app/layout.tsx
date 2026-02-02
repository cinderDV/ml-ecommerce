import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";

// Serif Typography - For headings (Architectural Authority)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

// Sans-Serif Typography - For body text (Clean & Geometric)
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Monospace Typography - For technical details (Blueprint Precision)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muebles Latina - Mobiliario",
  description: "Soluciones de mobiliario para distintos proyectos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" async />
      </head>
      <body className={plusJakarta.className}>
        <Header/>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}