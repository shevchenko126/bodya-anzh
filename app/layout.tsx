import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { couple } from "@/lib/wedding-data";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: `${couple.groomName} & ${couple.brideName} — запрошення на весілля`,
  description: `Запрошення на весілля ${couple.groomName} та ${couple.brideName}, ${couple.dateLabel}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${playfair.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
