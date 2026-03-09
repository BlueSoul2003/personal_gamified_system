import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./context/GameContext";

export const metadata: Metadata = {
  title: "Quantum Nexus | Player Dashboard",
  description: "Personal Gamified System - Quantum Nexus Player Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00f3ff" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
