import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toaster";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Вишлист — создай список желаний",
    template: "%s · Вишлист",
  },
  description:
    "Современный сервис для создания вишлистов, подписок на друзей и выбора подарков. Тёмная тема, плавные анимации, mobile-first.",
  keywords: [
    "вишлист",
    "wishlist",
    "подарки",
    "список желаний",
    "друзья",
    "Ozon",
    "WB",
    "Яндекс Маркет",
  ],
  authors: [{ name: "Wishlist Team" }],
  openGraph: {
    title: "Вишлист — создай список желаний",
    description:
      "Создавай вишлисты, делись с друзьями и выбирай подарки без хаоса.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen font-sans text-foreground antialiased">
        {/*
          NextAuth placeholder: оберните приложение в <SessionProvider> из next-auth/react,
          когда подключите провайдеров авторизации в app/api/auth/[...nextauth]/route.ts.
        */}
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
