import type { Metadata } from "next";
import { Montserrat, Bodoni_Moda } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const megante = localFont({
  src: "../../public/fonts/Megante.woff",
  variable: "--font-megante",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kofa Beauty",
  description: "Confidence, not comparison",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${montserrat.variable} ${bodoni.variable} ${megante.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
